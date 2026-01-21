import express from 'express';
import { AuthController } from '../controller/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schema';

const router = express.Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', validateRequest({body: RegisterSchema}), (req, res) => {
  authController.register(req, res);
});

// POST /api/auth/login
router.post('/login', validateRequest({body: LoginSchema}), (req, res) => {
  authController.login(req, res);
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  authController.refreshToken(req, res);
});

// POST /api/auth/logout (Protected route - requires authentication)
router.post('/logout', authenticateToken, (req, res) => {
  authController.logout(req, res);
});

export default router;
