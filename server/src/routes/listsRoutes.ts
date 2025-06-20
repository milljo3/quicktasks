// @ts-ignore
import express from 'express';
import {Request, Response} from "express";
import prisma from '../prismaClient';
import {requireAuth} from "../middleware/auth";
import {validateBody} from "../middleware/validate";
import {renameListSchema} from "../schemas/listSchemas";
import {createTaskSchema, reorderTaskSchema} from "../schemas/taskSchemas";

const router = express.Router();
router.use(requireAuth);

// Handle list renaming
router.patch('/:listId', validateBody(renameListSchema), async (req: Request, res: Response) => {

});

// Handle deleting a list
router.delete('/:listId', async (req: Request, res: Response) => {

});

// Handle creating a new task within a list
router.post('/:listId/tasks', validateBody(createTaskSchema), async (req: Request, res: Response) => {

});

// Handle reordering tasks within a list - from a drag and drop
router.patch('/:listId/tasks/reorder', validateBody(reorderTaskSchema), async (req: Request, res: Response) => {

});

export default router;