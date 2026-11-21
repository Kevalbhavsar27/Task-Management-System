import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const secret = () => process.env.JWT_SECRET;

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    if (!secret()) return res.status(500).json({ message: 'Server authentication is not configured.' });
    const payload = jwt.verify(token, secret()!) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, username: true, email: true } });
    if (!user) return res.status(401).json({ message: 'Your session is no longer valid. Please log in again.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
