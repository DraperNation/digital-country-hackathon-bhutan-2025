import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../helpers/password.js';
import { createUserDIDAndPassport } from '../services/did.js';
import { agent } from '../utils/veramo/agent.js';
import { generateQRCode } from '../utils/qrcode.js';

// Use nullish coalescing for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      dateOfBirth,
      nationality,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      mother,
      father,
      spouse,
      children,
    } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered.' });
      return;
    }
    const hashed = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        dateOfBirth,
        nationality,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        mother: mother ? JSON.parse(mother) : undefined,
        father: father ? JSON.parse(father) : undefined,
        spouse: spouse ? JSON.parse(spouse) : undefined,
        children: children ? JSON.parse(children) : undefined,
      },
    });

    const vcdid = await createUserDIDAndPassport(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        did: vcdid.did,
        vc: vcdid.passportVC,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }
    // Remove 'role' from JWT and response (User model does not have 'role')
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, name },
    });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPassportByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });

  if (!user?.vc) {
    return res.status(404).json({ error: 'Digital Passport not found' });
  }

  const vcJwt = (user.vc as Record<string, Record<string, string>>).proof?.jwt;
  if (!vcJwt) {
    return res.status(400).json({ error: 'VC JWT not available' });
  }

  const qrCode = await generateQRCode(vcJwt);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      did: user.did,
    },
    passport: user.vc,
    qrCode,
  });
};

export const verifyPassport = async (req: Request, res: Response) => {
  const { vcJwt } = req.body;

  if (!vcJwt) {
    return res.status(400).json({ error: 'vcJwt is required' });
  }

  try {
    const veramoAgent = await agent;
    const verifiedVC = await veramoAgent.verifyCredential({ credential: vcJwt });

    res.json({
      valid: true,
      verifiedVC,
    });
  } catch (error: any) {
    res.status(400).json({
      valid: false,
      error: 'Verification failed',
      details: error.message,
    });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};
