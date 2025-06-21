// @ts-ignore
import express from 'express';
import {Response} from "express";
import prisma from '../prismaClient';
import {AuthenticatedRequest, requireAuth} from "../middleware/auth";
import {validateBody} from "../middleware/validate";
import {renameListSchema} from "../schemas/listSchemas";
import {createTaskSchema} from "../schemas/taskSchemas";
import {requireBoardEditAccess} from "../middleware/permissions";
import {POSITION_GAP} from "../constants/positions";

const router = express.Router();
router.use(requireAuth);

// Handle list renaming
router.patch('/:listId', validateBody(renameListSchema), async (req: AuthenticatedRequest, res: Response) => {
    const {listId} = req.params;
    const userId = req.userId!;
    const {title} = req.body;

    try {
        const boardId = await getBoardIdByList(listId);

        await requireBoardEditAccess(boardId, userId);

        const newList = await prisma.list.update({
            where: {id: listId},
            data: {
                title: title
            }
        });

        return res.status(200).json(newList);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Handle deleting a list
router.delete('/:listId', async (req: AuthenticatedRequest, res: Response) => {
    const {listId} = req.params;
    const userId = req.userId!;

    try {
        const boardId = await getBoardIdByList(listId);

        await requireBoardEditAccess(boardId, userId);

        await prisma.list.delete({
            where: {id: listId}
        });

        return res.status(200).json({
            message: "Successfully deleted list",
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Handle creating a new task within a list
router.post('/:listId/tasks', validateBody(createTaskSchema), async (req: AuthenticatedRequest, res: Response) => {
    const {listId} = req.params;
    const userId = req.userId!;
    const {description} = req.body;

    try {
        const boardId = await getBoardIdByList(listId);

        await requireBoardEditAccess(boardId, userId);

        const lastTask = await prisma.task.findFirst({
            where: {listId},
            orderBy: {position: 'desc'}
        });

        const newPosition = lastTask ? lastTask.position + POSITION_GAP : POSITION_GAP;

        const task = await prisma.task.create({
            data: {
                description,
                position: newPosition,
                listId
            }
        });

        return res.status(200).json(task);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

async function getBoardIdByList(listId: string): Promise<string> {
    const list = await prisma.list.findUnique({
        where: {id: listId},
        select: {
            boardId: true
        }
    });

    if (!list) {
        throw new Error("List not found")
    }

    return list.boardId;
}

export default router;