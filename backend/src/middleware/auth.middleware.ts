import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader, type TokenPayload } from '../utils/jwt.utils';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware to verify JWT access token
 * Extracts and validates the Bearer token from Authorization header
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);
    const token = extractTokenFromHeader(authHeader);
    console.log("Extracted Token:", token);
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is missing. Provide a valid Bearer token.',
      });
      return;
    }

    const payload = verifyAccessToken(token);
    console.log("Token Payload:", payload);
    if (!payload) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired access token',
      });
      return;
    }

    // Attach user payload to request
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't reject if token is missing, but validates if provided
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
