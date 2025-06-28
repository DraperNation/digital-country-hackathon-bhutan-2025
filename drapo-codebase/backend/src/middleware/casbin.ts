import { Request, Response, NextFunction } from 'express';
import { checkPermission } from '../utils/casbin.js';

/**
 * Casbin RBAC middleware for Express routes.
 * Usage: casbinMiddleware('kyc', 'submit')
 */
export function casbinMiddleware(obj: string, act: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use user id or email as Casbin subject (sub)
      const user = (req as any).user;
      if (!user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const allowed = await checkPermission(String(user.userId), obj, act);
      if (!allowed) {
        res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
