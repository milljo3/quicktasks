// @ts-ignore
import express from 'express';
import {Response} from "express";
import prisma from '../prismaClient';
import {AuthenticatedRequest, requireAuth} from "../middleware/auth";
import {validateBody} from "../middleware/validate";
import {reorderTaskSchema, updateTaskSchema} from "../schemas/taskSchemas";
import {requireBoardEditAccess} from "../middleware/permissions";
import {POSITION_GAP} from "../constants/positions";

const router = express.Router();
router.use(requireAuth);

// Update the contents of a task
router.patch('/:taskId', validateBody(updateTaskSchema), async (req: AuthenticatedRequest, res: Response) => {
    const {taskId} = req.params;
    const {description} = req.body;
    const userId = req.userId!;

    try {
        const boardId = await getBoardIdByTask(taskId);

        await requireBoardEditAccess(boardId, userId);

        const updatedTask = await prisma.task.update({
            where: {id: taskId},
            data: {description}
        });

        return res.status(200).json({updatedTask});
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later",
            error: error.message
        });
    }
});

// Delete a task
router.delete('/:taskId', async (req: AuthenticatedRequest, res: Response) => {
    const {taskId} = req.params;
    const userId = req.userId!;

    try {
        const boardId = await getBoardIdByTask(taskId);

        await requireBoardEditAccess(boardId, userId);

        await prisma.task.delete({where: {id: taskId}});

        return res.status(201).send({
            message: "Task deleted successfully",
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later",
            error: error.message
        });
    }
});

// Handle reordering tasks within or between lists
router.patch('/:taskId/reorder', validateBody(reorderTaskSchema), async (req: AuthenticatedRequest, res: Response) => {
    const { taskId } = req.params;
    const { newIndex, toListId } = req.body;
    const userId = req.userId!;

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { list: true }
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await requireBoardEditAccess(task.list.boardId, userId);

        let tasks = await prisma.task.findMany({
            where: {
                listId: toListId,
                ...(task.listId === toListId ? { id: { not: taskId } } : {})
            },
            orderBy: {position: 'asc'}
        });

        if (newIndex < 0 || newIndex > tasks.length) {
            return res.status(400).json({
                message: "Invalid position",
                index: newIndex,
                maxPosition: tasks.length
            });
        }

        let position = await calculatePosition(tasks, newIndex, toListId);

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                position,
                listId: toListId,
            },
            include: {
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        return res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

async function calculatePosition(tasks: any[], newIndex: number, listId: string): Promise<number> {
    const prev = tasks[newIndex - 1];
    const next = tasks[newIndex];

    let position: number;

    if (prev && next) {
        const gap = next.position - prev.position;
        if (gap <= 1) {
            await reindexTasks(listId);

            const reindexedTasks = await prisma.task.findMany({
                where: { listId },
                orderBy: { position: 'asc' }
            });

            const rePrev = reindexedTasks[newIndex - 1];
            const reNext = reindexedTasks[newIndex];

            if (rePrev && reNext) {
                position = (rePrev.position + reNext.position) / 2;
            }
            else if (rePrev) {
                position = rePrev.position + POSITION_GAP;
            }
            else if (reNext) {
                position = reNext.position / 2;
            }
            else {
                position = POSITION_GAP;
            }
        }
        else {
            position = (prev.position + next.position) / 2;
        }
    }
    else if (prev) {
        position = prev.position + POSITION_GAP;
    }
    else if (next) {
        position = next.position / 2;
    }
    else {
        position = POSITION_GAP;
    }

    return position;
}

const reindexTasks = async (listId: string) => {
    await prisma.$transaction(async (tx) => {
        const tasks = await tx.task.findMany({
            where: { listId },
            orderBy: { position: 'asc' },
        });

        const updates = tasks.map((task, index) =>
            tx.task.update({
                where: { id: task.id },
                data: { position: (index + 1) * POSITION_GAP },
            })
        );

        await Promise.all(updates);
    });
};

async function getBoardIdByTask(taskId: string): Promise<string> {
    const task = await prisma.task.findUnique({
        where: {id: taskId},
        select: {
            list: {
                select: {
                    boardId: true
                }
            }
        }
    });

    if (!task || !task.list) {
        throw new Error("Task or associated list not found")
    }

    return task.list.boardId;
}

export default router;