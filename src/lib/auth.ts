import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'rynochi_luxury_jwt_secret_key_change_in_production_2026';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: Partial<User>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string; fullName: string; role: Role } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export const DEMO_USERS = [
  {
    id: 'user-admin-01',
    email: 'admin@rynochi.com',
    fullName: 'RYNOCHI Chief Administrator',
    role: 'ADMIN' as Role,
    phone: '+91 98765 43210',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-customer-01',
    email: 'customer@rynochi.com',
    fullName: 'Saurabh Kumar',
    role: 'CUSTOMER' as Role,
    phone: '+91 98112 34567',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

