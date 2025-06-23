// @ts-ignore
import express from 'express';
import {Response} from "express";
import prisma from '../prismaClient';
import {AuthenticatedRequest, requireAuth} from "../middleware/auth";
import {validateBody} from "../middleware/validate";
import {createBoardSchema, shareBoardSchema, updateBoardPermissionsSchema} from "../schemas/boardSchemas";
import {createListSchema} from "../schemas/listSchemas";
import {requireBoardAccess, requireBoardEditAccess, requireBoardOwnership} from "../middleware/permissions";
import {POSITION_GAP} from "../constants/positions";

const router = express.Router();
router.use(requireAuth);

// Get all boards a user has access to
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId!;

        const boards = await prisma.boardUser.findMany({
            where: {
                userId
            },
            select: {
                board: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        res.status(200).json(boards);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Get a specified board by id along with its lists and tasks
router.get('/:boardId', async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const userId = req.userId!;

    try {
        await requireBoardAccess(boardId, userId);

        const board = await prisma.board.findUnique({
            where: {id: boardId},
            include: {
                lists: {
                    orderBy: {position: 'asc'},
                    include: {
                        tasks: {
                            orderBy: {position: 'asc'}
                        }
                    }
                },
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                },
            }
        });

        if (!board) {
            return res.status(404).send({
                message: "Board not found",
            });
        }

        res.status(200).json(board);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Create a new board
router.post('/', validateBody(createBoardSchema), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const {title} = req.body;

    try {
        const board = await prisma.board.create({
            data: {
                title,
                ownerId: userId,
                users: {
                    create: {
                        userId: userId,
                        canEdit: true
                    }
                }
            },
            include: {
                users: true
            }
        });

        res.status(201).json(board);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Update board info such as board title
router.patch('/:boardId', async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const userId = req.userId!;
    const {title} = req.body;

    try {
        await requireBoardOwnership(boardId, userId);

        const updated = await prisma.board.update({
            where: {id: boardId},
            data: {title}
        });

        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Delete a board by id
router.delete('/:boardId', async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const userId = req.userId!;

    try {
        await requireBoardOwnership(boardId, userId);

        await prisma.board.delete({
            where: {id: boardId}
        });

        res.status(204).send({
            message: "Board deleted successfully"
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Create a new list within a board
router.post('/:boardId/lists', validateBody(createListSchema), async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const userId = req.userId!;
    const {title} = req.body;

    try {
        await requireBoardEditAccess(boardId, userId);

        const lastList = await prisma.list.findFirst({
            where: {boardId},
            orderBy: {position: 'desc'}
        });

        const newPosition = lastList ? lastList.position + POSITION_GAP : POSITION_GAP;

        const list = await prisma.list.create({
            data: {
                title,
                boardId,
                position: newPosition
            }
        });

        res.status(201).json(list);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Get a list of users who can access the board and their permissions
router.get('/:boardId/users', async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const userId = req.userId!;

    try {
        await requireBoardAccess(boardId, userId);

        const users = await prisma.boardUser.findMany({
            where: {boardId: boardId},
            select: {
                canEdit: true,
                user: {
                    select: {
                        email: true,
                    }
                }
            }
        });

        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Share the board with another user - should also include edit permissions
router.post('/:boardId/share', validateBody(shareBoardSchema), async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const userId = req.userId!;
    const {email, canEdit} = req.body;

    try {
        await requireBoardAccess(boardId, userId);

        const getUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if (!getUser) {
            res.status(404).send({
                message: "Email not found."
            });
        }

        const existingShare = await prisma.boardUser.findUnique({
            where: {
                userId_boardId: {
                    userId: getUser.id,
                    boardId: boardId
                }
            }
        })

        if (existingShare) {
            return res.status(400).send({
                message: "User already has access to this board"
            });
        }

        const user = await prisma.boardUser.create({
            data: {
                userId: getUser.id,
                boardId,
                canEdit: canEdit
            }
        });

        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Edit a users board permissions
router.patch('/:boardId/share', validateBody(updateBoardPermissionsSchema), async (req: AuthenticatedRequest, res: Response) => {
    const {boardId} = req.params;
    const {userId, canEdit} = req.body;
    const reqUserId = req.userId!;

    try {
        await requireBoardOwnership(boardId, reqUserId);

        if (reqUserId == userId) {
            return res.status(400).send({
                message: "Board owners cannot remove their own edit permissions."
            });
        }

        const user = await prisma.boardUser.update({
            where: {
                userId_boardId: {
                    userId: userId,
                    boardId: boardId,
                },
            },
            data: {
                canEdit
            }
        });

        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

// Remove a user from the board
router.delete('/:boardId/share/:userId', async (req: AuthenticatedRequest, res: Response) => {
    const {boardId, userId} = req.params;
    const reqUserId = req.userId!;

    try {
        await requireBoardOwnership(boardId, reqUserId);

        await prisma.boardUser.delete({
            where: {
                userId_boardId: {
                    userId: userId,
                    boardId: boardId,
                },
            },
        });

        res.status(200).send({
            message: "User deleted successfully from the board!."
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong. Try again later.",
            error: error.message
        });
    }
});

export default router;