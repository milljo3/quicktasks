import prisma from '../prismaClient';

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

export async function requireBoardDeleteAccess(boardId: string, userId: string) {
    const access = await prisma.boardUser.findUnique({
        where: {
            userId_boardId: {
                userId: userId,
                boardId: boardId,
            },
        },
    });

    if (!access || !access.canDelete) {
        throw new Error('Forbidden');
    }

    return access;
}