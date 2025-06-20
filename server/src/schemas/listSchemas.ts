import { z } from 'zod';

export const createListSchema = z.object({
    title: z.string().min(1)
});

export const renameListSchema = z.object({
    title: z.string().min(1)
});