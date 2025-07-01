// Central RBAC config and checkPermission middleware

type Role = 'user' | 'admin';

type Permission =
  | 'kyc:submit'
  | 'kyc:view'
  | 'kyc:review'
  | 'user:manage'
  | 'user:view'
  | 'notification:view';

const rolePermissions: Record<Role, Permission[]> = {
  user: ['kyc:submit', 'kyc:view', 'notification:view'],
  admin: ['kyc:submit', 'kyc:view', 'kyc:review', 'user:manage', 'user:view', 'notification:view'],
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role]?.includes(permission);
}

import { Request, Response, NextFunction } from 'express';

export function checkPermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}
