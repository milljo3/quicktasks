import { z } from 'zod';

export const createTaskSchema = z.object({
    description: z.string().min(1)
});

export const updateTaskSchema = z.object({
    description: z.string().min(1)
});

export const reorderTaskSchema = z.object({
    taskId: z.string().uuid(),
    newPosition: z.number().int().nonnegative(),
    toListId: z.string().uuid()
});
