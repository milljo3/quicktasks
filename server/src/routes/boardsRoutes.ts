// @ts-ignore
import express from 'express';
import {Request, Response} from "express";
import prisma from '../prismaClient';
import {requireAuth} from "../middleware/auth";
import {validateBody} from "../middleware/validate";
import {createBoardSchema, shareBoardSchema, updateBoardPermissionsSchema} from "../schemas/boardSchemas";
import {createListSchema} from "../schemas/listSchemas";

const router = express.Router();
router.use(requireAuth);

// Get all boards a user has access to
router.get('/', async (req: Request, res: Response) => {

});

// Get a specified board by id along with its lists and tasks
router.get('/:boardId', async (req: Request, res: Response) => {

});

// Create a new board
router.post('/', validateBody(createBoardSchema), async (req: Request, res: Response) => {

});

// Update board info such as board title
router.patch('/:boardId', async (req: Request, res: Response) => {

});

// Delete a board by id
router.delete('/:boardId', async (req: Request, res: Response) => {

});

// Create a new list within a board
router.post('/:boardId/lists', validateBody(createListSchema), async (req: Request, res: Response) => {

});

// Get a list of users who can access the board and their permissions
router.get('/:boardId/users', async (req: Request, res: Response) => {

});

// Share the board with another user - should also include edit/delete permissions
router.post('/:boardId/share', validateBody(shareBoardSchema), async (req: Request, res: Response) => {

});

// Edit a users board permissions
router.patch('/:boardId/share/:userId', validateBody(updateBoardPermissionsSchema), async (req: Request, res: Response) => {

});

// Remove a user from the board
router.delete('/:boardId/share/:userId', async (req: Request, res: Response) => {

});

export default router;