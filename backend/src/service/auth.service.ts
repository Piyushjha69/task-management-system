import { PrismaClient } from '../generated/prisma/client.js';
import { generateTokens, type JwtTokens } from '../utils/jwt.utils.js';
import { hashPassword, comparePasswords } from '../utils/password.utils.js';

const prisma = new PrismaClient();

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: JwtTokens;
}

export class AuthService {
  async register(data: RegisterDTO): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(data.password);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare hashed password
    const isPasswordValid = await comparePasswords(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Return user and tokens without password
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<JwtTokens> {
    const { verifyRefreshToken } = await import('../utils/jwt.utils.js');
    
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid or expired refresh token');
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    // Logout is typically handled on the client-side by removing tokens
    // This endpoint is here for API completeness and future enhancements
    // (e.g., token blacklisting, logging logout events, etc.)
    console.log(`User ${userId} logged out`);
  }
}
