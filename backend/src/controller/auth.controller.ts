import type { Request, Response } from 'express';
import { AuthService, type RegisterDTO, type LoginDTO } from '../service/auth.service.js';
import type { ValidatedRequest } from '../middleware/validate.middleware.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const authService = new AuthService();

export class AuthController {
  async register(req: ValidatedRequest, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.validated?.body as unknown as RegisterDTO;

      const user = await authService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  async login(req: ValidatedRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.validated?.body as unknown as LoginDTO;

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const tokens = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      await authService.logout(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Logout successful. Please clear tokens on client-side.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }
}
