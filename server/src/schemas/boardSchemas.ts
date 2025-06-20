import { z } from 'zod';

export const createBoardSchema = z.object({
    title: z.string().min(1)
});

export const shareBoardSchema = z.object({
    email: z.string().email(),
    canEdit: z.boolean(),
    canDelete: z.boolean()
});

export const updateBoardPermissionsSchema = z.object({
    canEdit: z.boolean(),
    canDelete: z.boolean()
});