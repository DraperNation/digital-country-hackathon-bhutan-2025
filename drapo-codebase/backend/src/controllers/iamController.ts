import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Role name required' });
    return;
  }
  const role = await prisma.role.create({ data: { name } });
  res.status(201).json(role);
};

export const createScope = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Scope name required' });
    return;
  }
  const scope = await prisma.scope.create({ data: { name } });
  res.status(201).json(scope);
};

export const assignRoleToUser = async (req: Request, res: Response) => {
  const { userId, roleId } = req.body;
  if (!userId || !roleId) {
    res.status(400).json({ error: 'UserId and Role id is required' });
    return;
  }
  const userRole = await prisma.userRole.create({ data: { userId, roleId } });
  res.status(201).json(userRole);
};

export const removeRoleFromUser = async (req: Request, res: Response) => {
  const { userId, roleId } = req.body;
  if (!userId || !roleId) {
    res.status(400).json({ error: 'userId and RoleId is required' });
    return;
  }
  await prisma.userRole.deleteMany({ where: { userId, roleId } });
  res.json({ success: true });
};

export const assignScopeToRole = async (req: Request, res: Response) => {
  const { roleId, scopeId } = req.body;
  if (!roleId || !scopeId) {
    res.status(400).json({ error: 'Role Id and Scope Id is required' });
    return;
  }
  const roleScope = await prisma.roleScope.create({ data: { roleId, scopeId } });
  res.status(201).json(roleScope);
};

export const removeScopeFromRole = async (req: Request, res: Response) => {
  const { roleId, scopeId } = req.body;
  if (!roleId || !scopeId) {
    res.status(400).json({ error: 'RoleId and Scope Id required' });
    return;
  }
  await prisma.roleScope.deleteMany({ where: { roleId, scopeId } });
  res.json({ success: true });
};

export const checkUserScope = async (req: Request, res: Response) => {
  const { userId, scopeName } = req.body;
  if (!userId || !scopeName) {
    res.status(400).json({ error: 'userId and scopeName required' });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              scopes: { include: { scope: true } },
            },
          },
        },
      },
    },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const hasScope = user.userRoles.some((ur: { role: { scopes: { scope: { name: any } }[] } }) =>
    ur.role.scopes.some((rs: { scope: { name: any } }) => rs.scope.name === scopeName)
  );
  res.json({ hasScope });
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { entity, entityId, userId, action, limit = 50 } = req.query;
    const where: any = {};
    if (entity) where.entity = entity;
    if (entityId) where.entityId = Number(entityId);
    if (userId) where.userId = Number(userId);
    if (action) where.action = action;
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
};
