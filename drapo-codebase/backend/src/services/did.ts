import { randomUUID } from 'crypto';
import prisma from '../utils/prisma.js';
import { agent } from '../utils/veramo/agent.js';

export const createUserDIDAndPassport = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const veramoAgent = await agent;
  const identifier = await veramoAgent.didManagerCreate();

  await prisma.user.update({
    where: { id: userId },
    data: { did: identifier.did },
  });

  const vc = await veramoAgent.createVerifiableCredential({
    credential: {
      issuer: { id: identifier.did },
      type: ['VerifiableCredential', 'DigitalPassport'],
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: identifier.did,
        name: user.name,
        passportNumber: 'DIGI-' + randomUUID().slice(0, 10).toUpperCase(),
        residencyStatus: 'Permanent Resident',
      },
    },
    proofFormat: 'jwt',
  });

  return { did: identifier.did, passportVC: vc };
};
