import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { uploadToMinio, getMinioFileUrl } from '../utils/minioClient.js';

export const submitKYC = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }
    const files = req.files as any;
    // Required files
    const passportFile = files.passport?.[0];
    const proofOfAddressFile = files.proofOfAddress?.[0];
    const photoFile = files.photo?.[0];
    const selfieFile = files.selfie?.[0];
    if (!passportFile || !proofOfAddressFile || !photoFile || !selfieFile) {
      res
        .status(400)
        .json({ error: 'Passport, proof of address, photo, and selfie are required.' });
      return;
    }
    // Optional files
    const nationalIdFile = files.nationalId?.[0];
    const fingerprintScanFile = files.fingerprintScan?.[0];
    const fingerprintImageFile = files.fingerprintImage?.[0];
    const signatureFile = files.signature?.[0];
    // Upload required files
    const passportKey = await uploadToMinio(passportFile, 'passport');
    const proofOfAddressKey = await uploadToMinio(proofOfAddressFile, 'proofOfAddress');
    const photoKey = await uploadToMinio(photoFile, 'photo');
    const selfieKey = await uploadToMinio(selfieFile, 'selfie');
    // Upload optional files
    const nationalIdKey = nationalIdFile ? await uploadToMinio(nationalIdFile, 'nationalId') : null;
    const fingerprintScanKey = fingerprintScanFile
      ? await uploadToMinio(fingerprintScanFile, 'fingerprintScan')
      : null;
    const fingerprintImageKey = fingerprintImageFile
      ? await uploadToMinio(fingerprintImageFile, 'fingerprintImage')
      : null;
    const signatureKey = signatureFile ? await uploadToMinio(signatureFile, 'signature') : null;
    // Other documents (array)
    let otherDocumentsArr = [];
    if (files.otherDocuments) {
      for (const doc of files.otherDocuments) {
        const key = await uploadToMinio(doc, 'otherDocuments');
        otherDocumentsArr.push({ name: doc.originalname, url: getMinioFileUrl(key) });
      }
    }
    // Save KYC record
    const kyc = await prisma.kYC.create({
      data: {
        userId: Number(userId),
        passportUrl: getMinioFileUrl(passportKey),
        nationalIdUrl: nationalIdKey ? getMinioFileUrl(nationalIdKey) : undefined,
        proofOfAddressUrl: getMinioFileUrl(proofOfAddressKey),
        photoUrl: getMinioFileUrl(photoKey),
        otherDocuments: otherDocumentsArr.length > 0 ? otherDocumentsArr : undefined,
        fingerprintScanUrl: fingerprintScanKey ? getMinioFileUrl(fingerprintScanKey) : undefined,
        fingerprintImageUrl: fingerprintImageKey ? getMinioFileUrl(fingerprintImageKey) : undefined,
        signatureUrl: signatureKey ? getMinioFileUrl(signatureKey) : undefined,
        selfieUrl: getMinioFileUrl(selfieKey),
        status: 'APPLIED',
      },
    });
    res.status(201).json(kyc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getKycById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kyc = await prisma.kYC.findUnique({ where: { id: Number(id) } });
    if (!kyc) {
      res.status(404).json({ error: 'KYC not found' });
      return;
    }
    res.json(kyc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllKYC = async (_req: Request, res: Response) => {
  try {
    const kycs = await prisma.kYC.findMany();
    res.json(kycs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateKYCStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const kyc = await prisma.kYC.findUnique({ where: { id: Number(id) } });
    if (!kyc) {
      res.status(404).json({ error: 'KYC not found' });
      return;
    }
    if (kyc.status !== status) {
      await prisma.kYCStatusHistory.create({
        data: {
          kycId: kyc.id,
          oldStatus: kyc.status,
          newStatus: status,
        },
      });
      await prisma.notification.create({
        data: {
          userId: kyc.userId,
          message: `Your KYC status changed from ${kyc.status} to ${status}.`,
        },
      });
    }
    const updatedKYC = await prisma.kYC.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedKYC);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserKYC = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const kycs = await prisma.kYC.findMany({ where: { userId: Number(userId) } });
    res.json(kycs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getKYCStatusHistory = async (req: Request, res: Response) => {
  try {
    const { kycId } = req.params;
    const history = await prisma.kYCStatusHistory.findMany({
      where: { kycId: Number(kycId) },
      orderBy: { changedAt: 'desc' },
    });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
