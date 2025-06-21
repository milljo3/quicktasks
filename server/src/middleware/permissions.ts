import prisma from '../prismaClient';

export async function requireBoardAccess(boardId: string, userId: string) {
    const access = await prisma.boardUser.findUnique({
        where: {
            userId_boardId: {
                userId: userId,
                boardId: boardId,
            },
        },
    });

    if (!access) {
        throw new Error("Forbidden");
    }

    return access;
}

export async function requireBoardOwnership(boardId: string, userId: string) {
    const board = await prisma.board.findUnique({
        where: { id: boardId }
    });

    if (!board || board.ownerId !== userId) {
        throw new Error('Only the board owner can perform this action.');
    }

    return board;
}

export async function requireBoardEditAccess(boardId: string, userId: string) {
    const access = await prisma.boardUser.findUnique({
        where: {
            userId_boardId: {
                userId: userId,
                boardId: boardId,
            },
        },
    });

    if (!access || !access.canEdit) {
        throw new Error('Forbidden');
    }

    return access;
}