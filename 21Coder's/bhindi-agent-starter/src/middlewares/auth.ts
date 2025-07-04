import { Request, Response, NextFunction } from 'express';
import { BaseErrorResponseDto } from '@/types/agent.js';

// Extend Request interface to include auth properties
declare module 'express-serve-static-core' {
  interface Request {
    bearerToken?: string;
  }
}

/**
 * Middleware to validate Bearer token from Authorization header
 * Required for all tool execution endpoints
 */
export const validateBearerToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new BaseErrorResponseDto(
      'Bearer token is required',
      401,
      'Missing or invalid Authorization header. Expected format: Bearer <token>'
    );
    res.status(401).json(error);
    return;
  }

  const bearerToken = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (!bearerToken) {
    const error = new BaseErrorResponseDto(
      'Bearer token is required',
      401,
      'Empty bearer token'
    );
    res.status(401).json(error);
    return;
  }

  req.bearerToken = bearerToken;
  next();
}; 