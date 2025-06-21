import { z } from 'zod';

export const createTaskSchema = z.object({
    description: z.string().min(1).max(100, "Exceeded max length.")
});

export const updateTaskSchema = z.object({
    description: z.string().min(1).max(100, "Exceeded max length.")
});

export const reorderTaskSchema = z.object({
    newIndex: z.number().int().nonnegative(),
    toListId: z.string()
});
