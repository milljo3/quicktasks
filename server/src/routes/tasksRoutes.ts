// @ts-ignore
import express from 'express';
import {Request, Response} from "express";
import prisma from '../prismaClient';
import {requireAuth} from "../middleware/auth";
import {validateBody} from "../middleware/validate";
import {updateTaskSchema} from "../schemas/taskSchemas";

const router = express.Router();
router.use(requireAuth);

// Update the contents of a task
router.patch('/:taskId', validateBody(updateTaskSchema), async (req: Request, res: Response) => {

});

// Delete a task
router.delete('/:taskId', async (req: Request, res: Response) => {

});

export default router;