import { PrismaClient } from '@prisma/client';
import { veramoHelpers } from '../utils/veramo/agent.js';
import { VerifiableCredential, VerifiablePresentation, IIdentifier } from '@veramo/core';

const prisma = new PrismaClient();

export class VeramoService {
  // DID Management
  static async createUserDID(userId: string, userData: any): Promise<IIdentifier> {
    try {
      // Create DID using Veramo
      const did = await veramoHelpers.createDID(userId, `user-${userId}`);

      // Store DID reference in Prisma
      const existingDID = await prisma.dID.findUnique({
        where: { userId: parseInt(userId) },
      });

      if (existingDID) {
        return existingDID as unknown as IIdentifier;
      }

      await prisma.dID.create({
        data: {
          userId: parseInt(userId),
          did: did.did,
          status: 'Active',
          lastVerified: new Date(),
        },
      });

      return did;
    } catch (error) {
      console.error('Error creating user DID:', error);
      throw new Error('Failed to create user DID');
    }
  }

  static async getUserDID(userId: string): Promise<IIdentifier | null> {
    try {
      return await veramoHelpers.getDIDByAlias(`user-${userId}`);
    } catch (error) {
      console.error('Error getting user DID:', error);
      return null;
    }
  }

  static async updateDIDStatus(userId: string, status: string): Promise<boolean> {
    try {
      await prisma.dID.update({
        where: { userId: parseInt(userId) },
        data: {
          status,
          lastVerified: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating DID status:', error);
      return false;
    }
  }

  // Credential Management
  static async issueKYCProofCredential(
    userId: string,
    kycData: any
  ): Promise<VerifiableCredential> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      // Government DID (issuer)
      const governmentDID = 'did:ethr:sepolia:0x1234567890123456789012345678901234567890';

      const credential = await veramoHelpers.issueCredential(
        governmentDID,
        userDID.did,
        'KYCCredential',
        {
          name: kycData.name,
          dateOfBirth: kycData.dateOfBirth,
          nationality: kycData.nationality,
          idNumber: kycData.idNumber,
          verificationLevel: 'Level2',
          verifiedBy: 'Bhutan Government',
          verificationDate: new Date().toISOString(),
        }
      );

      // Store credential in Prisma
      await prisma.credential.create({
        data: {
          userId: parseInt(userId),
          type: 'KYC Proof',
          issuer: 'Bhutan Government',
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'valid',
          credentialData: credential,
        },
      });

      return credential;
    } catch (error) {
      console.error('Error issuing KYC credential:', error);
      throw new Error('Failed to issue KYC credential');
    }
  }

  static async issueBiometricCredential(
    userId: string,
    biometricData: any
  ): Promise<VerifiableCredential> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      const governmentDID = 'did:ethr:sepolia:0x1234567890123456789012345678901234567890';

      const credential = await veramoHelpers.issueCredential(
        governmentDID,
        userDID.did,
        'BiometricCredential',
        {
          biometricType: biometricData.type,
          enrollmentDate: new Date().toISOString(),
          verificationMethod: biometricData.method,
          deviceId: biometricData.deviceId,
          verifiedBy: 'Bhutan Government',
        }
      );

      // Store in Prisma
      await prisma.credential.create({
        data: {
          userId: parseInt(userId),
          type: 'Biometric Verification',
          issuer: 'Bhutan Government',
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years
          status: 'valid',
          credentialData: credential,
        },
      });

      return credential;
    } catch (error) {
      console.error('Error issuing biometric credential:', error);
      throw new Error('Failed to issue biometric credential');
    }
  }

  static async issuePassportCredential(
    userId: string,
    passportData: any
  ): Promise<VerifiableCredential> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      const governmentDID = 'did:ethr:sepolia:0x1234567890123456789012345678901234567890';

      const credential = await veramoHelpers.issueCredential(
        governmentDID,
        userDID.did,
        'PassportCredential',
        {
          passportNumber: passportData.passportNumber,
          issuingCountry: 'Bhutan',
          issueDate: passportData.issueDate,
          expiryDate: passportData.expiryDate,
          holderName: passportData.holderName,
          dateOfBirth: passportData.dateOfBirth,
          nationality: 'Bhutanese',
          documentType: 'Passport',
        }
      );

      // Store in Prisma
      await prisma.credential.create({
        data: {
          userId: parseInt(userId),
          type: 'Passport',
          issuer: 'Bhutan Government',
          issuedDate: new Date(passportData.issueDate),
          expiryDate: new Date(passportData.expiryDate),
          status: 'valid',
          credentialData: credential,
        },
      });

      return credential;
    } catch (error) {
      console.error('Error issuing passport credential:', error);
      throw new Error('Failed to issue passport credential');
    }
  }

  static async issueProofOfPersonhoodCredential(
    userId: string,
    personhoodData: any
  ): Promise<VerifiableCredential> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      const governmentDID = 'did:ethr:sepolia:0x1234567890123456789012345678901234567890';

      const credential = await veramoHelpers.issueCredential(
        governmentDID,
        userDID.did,
        'ProofOfPersonhoodCredential',
        {
          personhoodScore: personhoodData.score,
          verificationMethod: personhoodData.method,
          verificationDate: new Date().toISOString(),
          attributes: personhoodData.attributes,
          verifiedBy: 'Bhutan Government',
          validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 2 years
        }
      );

      // Store in Prisma
      await prisma.credential.create({
        data: {
          userId: parseInt(userId),
          type: 'Proof of Personhood',
          issuer: 'Bhutan Government',
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
          status: 'valid',
          credentialData: credential,
        },
      });

      return credential;
    } catch (error) {
      console.error('Error issuing proof of personhood credential:', error);
      throw new Error('Failed to issue proof of personhood credential');
    }
  }

  // Credential Verification
  static async verifyCredential(credential: VerifiableCredential): Promise<boolean> {
    try {
      return await veramoHelpers.verifyCredential(credential);
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }

  static async getUserCredentials(userId: string): Promise<VerifiableCredential[]> {
    try {
      const credentials = await prisma.credential.findMany({
        where: {
          userId: parseInt(userId),
          status: 'valid',
        },
        orderBy: { issuedDate: 'desc' },
      });

      return credentials.map((c) => c.credentialData as VerifiableCredential);
    } catch (error) {
      console.error('Error getting user credentials:', error);
      return [];
    }
  }

  // Presentation Management
  static async createIdentityPresentation(
    userId: string,
    credentialTypes: string[] = []
  ): Promise<VerifiablePresentation> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      const allCredentials = await this.getUserCredentials(userId);
      let selectedCredentials = allCredentials;

      // Filter by credential types if specified
      if (credentialTypes.length > 0) {
        selectedCredentials = allCredentials.filter((credential) =>
          credentialTypes.some((type) => credential.type?.includes(type))
        );
      }

      if (selectedCredentials.length === 0) {
        throw new Error('No valid credentials found for presentation');
      }

      const presentation = await veramoHelpers.createPresentation(
        userDID.did,
        selectedCredentials,
        `challenge-${Date.now()}`
      );

      return presentation;
    } catch (error) {
      console.error('Error creating identity presentation:', error);
      throw new Error('Failed to create identity presentation');
    }
  }

  static async verifyPresentation(presentation: VerifiablePresentation): Promise<boolean> {
    try {
      return await veramoHelpers.verifyPresentation(presentation);
    } catch (error) {
      console.error('Error verifying presentation:', error);
      return false;
    }
  }

  // Reputation and Attestations
  static async issueReputationCredential(
    userId: string,
    reputationData: any
  ): Promise<VerifiableCredential> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      const communityDID = 'did:ethr:sepolia:0x9876543210987654321098765432109876543210';

      const credential = await veramoHelpers.issueCredential(
        communityDID,
        userDID.did,
        'ReputationCredential',
        {
          reputationScore: reputationData.score,
          category: reputationData.category,
          contributions: reputationData.contributions,
          attestations: reputationData.attestations,
          issuedBy: reputationData.issuer,
          issuanceDate: new Date().toISOString(),
        }
      );

      // Store in Prisma
      await prisma.credential.create({
        data: {
          userId: parseInt(userId),
          type: 'Reputation',
          issuer: reputationData.issuer,
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'valid',
          credentialData: credential,
        },
      });

      return credential;
    } catch (error) {
      console.error('Error issuing reputation credential:', error);
      throw new Error('Failed to issue reputation credential');
    }
  }

  static async issueAttestationCredential(
    userId: string,
    attestationData: any
  ): Promise<VerifiableCredential> {
    try {
      const userDID = await this.getUserDID(userId);
      if (!userDID) {
        throw new Error('User DID not found');
      }

      const attesterDID =
        attestationData.attesterDID ||
        'did:ethr:sepolia:0x1111111111111111111111111111111111111111';

      const credential = await veramoHelpers.issueCredential(
        attesterDID,
        userDID.did,
        'AttestationCredential',
        {
          attestationType: attestationData.type,
          description: attestationData.description,
          evidence: attestationData.evidence,
          confidence: attestationData.confidence,
          issuedBy: attestationData.attesterName,
          issuanceDate: new Date().toISOString(),
        }
      );

      // Store in Prisma
      await prisma.credential.create({
        data: {
          userId: parseInt(userId),
          type: 'Attestation',
          issuer: attestationData.attesterName,
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'valid',
          credentialData: credential,
        },
      });

      return credential;
    } catch (error) {
      console.error('Error issuing attestation credential:', error);
      throw new Error('Failed to issue attestation credential');
    }
  }

  // Utility Methods
  static async revokeCredential(credentialId: string): Promise<boolean> {
    try {
      await prisma.credential.update({
        where: { id: parseInt(credentialId) },
        data: { status: 'revoked' },
      });
      return true;
    } catch (error) {
      console.error('Error revoking credential:', error);
      return false;
    }
  }

  static async getCredentialStatus(credentialId: string): Promise<string> {
    try {
      const credential = await prisma.credential.findUnique({
        where: { id: parseInt(credentialId) },
        select: { status: true },
      });
      return credential?.status || 'unknown';
    } catch (error) {
      console.error('Error getting credential status:', error);
      return 'unknown';
    }
  }

  static async getUserIdentitySummary(userId: string): Promise<any> {
    try {
      const userDID = await this.getUserDID(userId);
      const credentials = await this.getUserCredentials(userId);

      const kycCredential = credentials.find((c) => c.type?.includes('KYC'));
      const biometricCredential = credentials.find((c) => c.type?.includes('Biometric'));
      const passportCredential = credentials.find((c) => c.type?.includes('Passport'));
      const personhoodCredential = credentials.find((c) => c.type?.includes('Personhood'));

      return {
        did: userDID?.did || null,
        didStatus: userDID ? 'Active' : 'Not Created',
        kycVerified: !!kycCredential,
        biometricEnrolled: !!biometricCredential,
        passportIssued: !!passportCredential,
        personhoodVerified: !!personhoodCredential,
        totalCredentials: credentials.length,
        lastVerified: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting user identity summary:', error);
      throw new Error('Failed to get user identity summary');
    }
  }
}
