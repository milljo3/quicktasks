import { ApiCallFunction, UserBoardsResponse, BoardWithListsAndTasks, BoardWithUsers, Board, List, BoardUsersResponse, BoardUser } from '../types/api';

export const createBoardsApi = (apiCall: ApiCallFunction) => ({
    // GET /api/boards - returns array of simplified board objects
    getUserBoards: (): Promise<UserBoardsResponse[]> =>
        apiCall({
            method: 'GET',
            url: '/api/boards'
        }),

    // GET /api/boards/:boardId - returns board with lists and tasks
    getBoard: (boardId: string): Promise<BoardWithListsAndTasks> =>
        apiCall({
            method: 'GET',
            url: `/api/boards/${boardId}`
        }),

    // POST /api/boards - returns board with users
    createBoard: (title: string): Promise<BoardWithUsers> =>
        apiCall({
            method: 'POST',
            url: '/api/boards',
            data: { title }
        }),

    // PATCH /api/boards/:boardId - returns updated board
    updateBoard: (boardId: string, title: string): Promise<Board> =>
        apiCall({
            method: 'PATCH',
            url: `/api/boards/${boardId}`,
            data: { title }
        }),

    // DELETE /api/boards/:boardId - returns 204, no content
    deleteBoard: (boardId: string): Promise<{ message: string }> =>
        apiCall({
            method: 'DELETE',
            url: `/api/boards/${boardId}`
        }),

    // POST /api/boards/:boardId/lists - returns new list
    createList: (boardId: string, title: string): Promise<List> =>
        apiCall({
            method: 'POST',
            url: `/api/boards/${boardId}/lists`,
            data: { title }
        }),

    // GET /api/boards/:boardId/users - returns users with permissions
    getBoardUsers: (boardId: string): Promise<BoardUsersResponse[]> =>
        apiCall({
            method: 'GET',
            url: `/api/boards/${boardId}/users`
        }),

    // POST /api/boards/:boardId/share - share board with user
    shareBoard: (boardId: string, email: string, canEdit: boolean): Promise<BoardUser> =>
        apiCall({
            method: 'POST',
            url: `/api/boards/${boardId}/share`,
            data: { email, canEdit }
        }),

    // PATCH /api/boards/:boardId/share - update user permissions
    updateBoardPermissions: (boardId: string, userId: string, canEdit: boolean): Promise<BoardUser> =>
        apiCall({
            method: 'PATCH',
            url: `/api/boards/${boardId}/share`,
            data: { userId, canEdit }
        }),

    // DELETE /api/boards/:boardId/share/:userId - remove user from board
    removeUserFromBoard: (boardId: string, userId: string): Promise<{ message: string }> =>
        apiCall({
            method: 'DELETE',
            url: `/api/boards/${boardId}/share/${userId}`
        })
});