import AuditLog from '../models/AuditLog.js';
import { getClientIp } from '@supercharge/request-ip';

/**
 * Middleware to log API requests and responses
 */
const auditLogger = async (req, res, next) => {
  // Skip health checks and monitoring endpoints
  if (req.path === '/health' || req.path.startsWith('/monitoring')) {
    return next();
  }

  const startTime = Date.now();
  const originalEnd = res.end;
  const chunks = [];

  // Override res.end to capture the response body
  res.end = function (chunk, encoding) {
    if (chunk) {
      chunks.push(Buffer.from(chunk, encoding));
    }
    return originalEnd.apply(res, arguments);
  };

  // Get the client IP address
  const ipAddress = getClientIp(req) || req.ip || req.connection.remoteAddress;
  
  // Get user agent
  const userAgent = req.headers['user-agent'];

  // Function to log the response
  const logResponse = async () => {
    try {
      // Calculate duration
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Get the response body
      let responseBody = {};
      if (chunks.length > 0) {
        const body = Buffer.concat(chunks).toString('utf8');
        try {
          responseBody = JSON.parse(body);
        } catch (e) {
          responseBody = { message: 'Non-JSON response' };
        }
      }

      // Determine the action based on the route and method
      let action = `${req.method.toLowerCase()}_${req.path.replace(/\//g, '_').replace(/^_|_$/g, '')}`;
      
      // Extract entity type and ID from the URL if possible
      let entityType, entityId;
      const idMatch = req.path.match(/\/([a-zA-Z]+)\/([0-9a-fA-F]{24})/);
      if (idMatch) {
        entityType = idMatch[1];
        entityId = idMatch[2];
      }

      // Log the request
      await AuditLog.log({
        user: req.user?._id || null,
        action,
        entityType,
        entityId,
        metadata: {
          method: req.method,
          path: req.path,
          query: req.query,
          params: req.params,
          user: req.user ? {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role
          } : null,
          statusCode: res.statusCode,
          duration
        },
        request: {
          method: req.method,
          url: req.originalUrl || req.url,
          params: req.params,
          query: req.query,
          body: req.body,
          headers: req.headers
        },
        response: {
          statusCode: res.statusCode,
          body: responseBody,
          headers: res.getHeaders()
        },
        status: res.statusCode < 400 ? 'success' : 'failure',
        ipAddress,
        userAgent,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      });
    } catch (error) {
      console.error('Error in audit logger:', error);
      // Don't fail the request if logging fails
    }
  };

  // Log response when it's finished
  res.on('finish', logResponse);
  res.on('close', logResponse);

  next();
};

/**
 * Middleware to log specific actions (e.g., user login, document upload)
 */
const logAction = (action, options = {}) => {
  return async (req, res, next) => {
    try {
      const { entityType, entityIdField = 'id', metadata = {} } = options;
      
      // Get entity ID from request params or body
      const entityId = req.params[entityIdField] || req.body[entityIdField];
      
      // Get client IP and user agent
      const ipAddress = getClientIp(req) || req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      // Add additional metadata
      const actionMetadata = {
        ...metadata,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
      };
      
      // Log the action
      await AuditLog.log({
        user: req.user?._id || null,
        action,
        entityType,
        entityId,
        metadata: actionMetadata,
        request: {
          method: req.method,
          url: req.originalUrl || req.url,
          params: req.params,
          query: req.query,
          body: req.body
        },
        ipAddress,
        userAgent
      });
    } catch (error) {
      console.error('Error in action logger:', error);
      // Don't fail the request if logging fails
    }
    
    next();
  };
};

export { auditLogger, logAction };
