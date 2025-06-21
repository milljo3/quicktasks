import { z } from 'zod';

export const createListSchema = z.object({
    title: z.string().min(1).max(100, "Exceeded max length.")
});

export const renameListSchema = z.object({
    title: z.string().min(1).max(100, "Exceeded max length.")
});