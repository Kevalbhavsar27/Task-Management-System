import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();
const registerSchema = z.object({
  username: z.string().trim().min(3).max(30),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72)
});
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

function issueToken(user: { id: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({}, secret, { subject: user.id, expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'] });
}

router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Please provide a valid username, email and password (at least 8 characters).' });
    const { username, email, password } = parsed.data;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email: email.toLowerCase() }, { username }] } });
    if (existing) return res.status(409).json({ message: 'That email or username is already registered.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { username, email: email.toLowerCase(), passwordHash }, select: { id: true, username: true, email: true } });
    return res.status(201).json({ token: issueToken(user), user });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Please enter a valid email and password.' });
    const userRecord = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!userRecord || !(await bcrypt.compare(parsed.data.password, userRecord.passwordHash))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    const user = { id: userRecord.id, username: userRecord.username, email: userRecord.email };
    return res.json({ token: issueToken(user), user });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));
export default router;
