import { ApiCallFunction, List, Task } from '../types/api';

export const createListsApi = (apiCall: ApiCallFunction) => ({
    // PATCH /api/lists/:listId - returns updated list
    updateList: (listId: string, title: string): Promise<List> =>
        apiCall({
            method: 'PATCH',
            url: `/api/lists/${listId}`,
            data: { title }
        }),

    // DELETE /api/lists/:listId - returns success message
    deleteList: (listId: string): Promise<{ message: string }> =>
        apiCall({
            method: 'DELETE',
            url: `/api/lists/${listId}`
        }),

    // POST /api/lists/:listId/tasks - returns new task
    createTask: (listId: string, description: string): Promise<Task> =>
        apiCall({
            method: 'POST',
            url: `/api/lists/${listId}/tasks`,
            data: { description }
        })
});