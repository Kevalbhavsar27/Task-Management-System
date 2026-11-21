import { Router } from 'express';
import { TaskStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);
const statusSchema = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);
const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().max(2000).optional().default(''),
  status: statusSchema.optional().default('TODO')
});

router.get('/', async (req, res, next) => {
  try {
    const status = req.query.status;
    if (status && status !== 'ALL' && !statusSchema.safeParse(status).success) return res.status(400).json({ message: 'Invalid task status.' });
    const tasks = await prisma.task.findMany({
      where: { userId: req.user!.id, ...(status && status !== 'ALL' ? { status: status as TaskStatus } : {}) },
      orderBy: { updatedAt: 'desc' }
    });
    return res.json({ tasks });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid task details.' });
    const task = await prisma.task.create({ data: { ...parsed.data, userId: req.user!.id } });
    return res.status(201).json({ task });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = taskSchema.partial().safeParse(req.body);
    if (!parsed.success || Object.keys(parsed.data || {}).length === 0) return res.status(400).json({ message: 'Provide valid task details to update.' });
    if (parsed.data.title !== undefined && !parsed.data.title.trim()) return res.status(400).json({ message: 'Title cannot be empty.' });
    const result = await prisma.task.updateMany({ where: { id: req.params.id, userId: req.user!.id }, data: parsed.data });
    if (!result.count) return res.status(404).json({ message: 'Task not found.' });
    const task = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
    return res.json({ task });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await prisma.task.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
    if (!result.count) return res.status(404).json({ message: 'Task not found.' });
    return res.json({ message: 'Task deleted successfully.' });
  } catch (error) { next(error); }
});
export default router;
