import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { uploadToMinio, getMinioFileUrl, deleteObjectCommand } from '../utils/minioClient.js';

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const reserveName = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, director, address, type } = req.body;
    let securityCertificateUrl = null;
    if (!name || !director || !address) {
      res.status(400).json({ error: 'Name, director, and address are required.' });
      return;
    }
    // Check for existing company
    const existing = await prisma.legalEntity.findFirst({ where: { name } });
    if (existing) {
      res.status(409).json({ error: 'Company name already reserved.' });
      return;
    }
    if (req.file) {
      const key = await uploadToMinio(req.file, 'security-certificates');
      securityCertificateUrl = getMinioFileUrl(key);
    }
    const entity = await prisma.legalEntity.create({
      data: {
        name,
        type,
        director,
        address,
        status: 'Name Reserved',
        documents: securityCertificateUrl
          ? [{ name: 'Security Certificate', url: securityCertificateUrl }]
          : [],
        ownerId: req.user?.id,
      },
    });
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reserve name.' });
  }
};

export const submitProposal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { entityId } = req.body;
    let proposalUrl = null;
    if (!entityId) {
      res.status(400).json({ error: 'entityId is required.' });
      return;
    }
    if (req.file) {
      const key = await uploadToMinio(req.file, 'proposals');
      proposalUrl = getMinioFileUrl(key);
    }
    if (!proposalUrl) {
      res.status(400).json({ error: 'Proposal document is required.' });
      return;
    }
    const entity = await prisma.legalEntity.update({
      where: { id: Number(entityId) },
      data: {
        status: 'Proposal Submitted',
        documents: { push: { name: 'Business Proposal', url: proposalUrl } },
      },
    });
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit proposal.' });
  }
};

export const registerCompany = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { entityId } = req.body;
    if (!entityId) {
      res.status(400).json({ error: 'entityId is required.' });
      return;
    }
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      res.status(400).json({ error: 'At least one registration document is required.' });
      return;
    }
    const registrationDocs = await Promise.all(
      req.files.map(async (file: Express.Multer.File) => {
        const key = await uploadToMinio(file, 'registration-docs');
        return { name: file.originalname, url: getMinioFileUrl(key) };
      })
    );
    const entity = await prisma.legalEntity.update({
      where: { id: Number(entityId) },
      data: {
        status: 'Registered',
        documents: { push: [...registrationDocs] },
      },
    });
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register company.' });
  }
};

// Get all legal entities
export const getAllEntities = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const entities = await prisma.legalEntity.findMany();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entities.' });
  }
};

export const removeDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { remove } = req.body;
    if (!remove) {
      res.status(400).json({ error: 'Document URL required.' });
      return;
    }
    const entity = await prisma.legalEntity.findUnique({ where: { id: Number(id) } });
    if (!entity) {
      res.status(404).json({ error: 'Entity not found.' });
      return;
    }

    // Fix the documents filter - ensure it's an array
    const currentDocs = Array.isArray(entity.documents) ? entity.documents : [];
    const updatedDocs = currentDocs.filter((doc: any) => doc.url !== remove);

    await prisma.legalEntity.update({
      where: { id: Number(id) },
      data: { documents: updatedDocs },
    });

    // Remove from MinIO
    const key = remove.split(`/${process.env.MINIO_BUCKET}/`)[1];
    if (key) await deleteObjectCommand(key);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'remove_document',
        entity: 'legalEntity',
        entityId: Number(id),
        details: remove,
      },
    });

    // Create notification only if ownerId exists
    if (entity.ownerId) {
      await prisma.notification.create({
        data: {
          userId: entity.ownerId,
          message: `A document was removed from company ${entity.name}`,
        },
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove document.' });
  }
};
