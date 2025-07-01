import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IDataStoreORM,
  IKeyManager,
  ICredentialPlugin,
  IMessageHandler,
  IIdentifier,
  VerifiableCredential,
  VerifiablePresentation,
  TAgent,
} from '@veramo/core';

import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';
import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store';
import { DataSource } from 'typeorm';

const INFURA_PROJECT_ID = process.env.INFURA_API_KEY ?? '';
const KMS_SECRET_KEY = process.env.KMS_SECRET_KEY ?? 'your-secret-key-here';

// Database connection for Veramo
const dbConnection = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'drapo_citizen_db',
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
});

// Initialize database connection
let initialized = false;
const initializeDB = async () => {
  if (!initialized) {
    try {
      await dbConnection.initialize();
      console.log('Veramo database connection initialized');
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize Veramo database:', error);
      throw error;
    }
  }
  return dbConnection;
};

// Create Veramo agent
export const createVeramoAgent = async (): Promise<
  TAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin>
> => {
  const connection = await initializeDB();

  return createAgent<
    IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin
  >({
    plugins: [
      new KeyManager({
        store: new KeyStore(connection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(connection, new SecretBox(KMS_SECRET_KEY))
          ),
        },
      }),
      new DIDManager({
        store: new DIDStore(connection),
        defaultProvider: 'did:ethr:sepolia',
        providers: {
          'did:ethr:sepolia': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'sepolia',
            rpcUrl: 'https://sepolia.infura.io/v3/' + INFURA_PROJECT_ID,
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
          ...webDidResolver(),
        }),
      }),
      new CredentialPlugin(),
    ],
  });
};

// Singleton agent instance
let agentInstance: TAgent<
  IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin
> | null = null;

export const getAgent = async () => {
  if (!agentInstance) {
    agentInstance = await createVeramoAgent();
  }
  return agentInstance;
};

// Helper functions for common Veramo operations
export const veramoHelpers = {
  // Create a new DID for a user
  async createDID(userId: string, alias?: string): Promise<IIdentifier> {
    const agent = await getAgent();
    const did = await agent.didManagerCreate({
      alias: alias || `user-${userId}`,
      provider: 'did:ethr:sepolia',
    });
    return did;
  },

  // Get DID by alias
  async getDIDByAlias(alias: string): Promise<IIdentifier | null> {
    const agent = await getAgent();
    const dids = await agent.didManagerFind({ alias });
    return dids.length > 0 ? dids[0] : null;
  },

  // Issue a verifiable credential
  async issueCredential(
    issuer: string,
    subject: string,
    credentialType: string,
    credentialData: any,
    expirationDate?: string
  ): Promise<VerifiableCredential> {
    const agent = await getAgent();

    const credential = await agent.createVerifiableCredential({
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', credentialType],
        issuer: { id: issuer },
        issuanceDate: new Date().toISOString(),
        expirationDate:
          expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        credentialSubject: {
          id: subject,
          ...credentialData,
        },
      },
      proofFormat: 'jwt',
    });

    return credential;
  },

  // Verify a verifiable credential
  async verifyCredential(credential: VerifiableCredential): Promise<boolean> {
    const agent = await getAgent();
    const result = await agent.verifyCredential({
      credential,
    });
    return result.verified;
  },

  // Create a verifiable presentation
  async createPresentation(
    holder: string,
    credentials: VerifiableCredential[],
    challenge?: string
  ): Promise<VerifiablePresentation> {
    const agent = await getAgent();

    const presentation = await agent.createVerifiablePresentation({
      presentation: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        holder: holder,
        verifiableCredential: credentials,
      },
      proofFormat: 'jwt',
      challenge: challenge || 'challenge-' + Date.now(),
    });

    return presentation;
  },

  // Verify a verifiable presentation
  async verifyPresentation(presentation: VerifiablePresentation): Promise<boolean> {
    const agent = await getAgent();
    const result = await agent.verifyPresentation({
      presentation,
    });
    return result.verified;
  },

  // Get all DIDs for a user
  async getUserDIDs(userId: string): Promise<IIdentifier[]> {
    const agent = await getAgent();
    return await agent.didManagerFind({ alias: `user-${userId}` });
  },

  // Delete a DID
  async deleteDID(did: string): Promise<boolean> {
    const agent = await getAgent();
    await agent.didManagerDelete({ did });
    return true;
  },
};

// Legacy export for backward compatibility
export const agent = getAgent();
