import { z } from 'zod';

export const createBoardSchema = z.object({
    title: z.string().min(1).max(100, "Exceeded max length.")
});

export const shareBoardSchema = z.object({
    email: z.string().email(),
    canEdit: z.boolean()
});

export const updateBoardPermissionsSchema = z.object({
    userId: z.string(),
    canEdit: z.boolean()
});