import { ApiCallFunction, Task, TaskWithList } from '../types/api';

export const createTasksApi = (apiCall: ApiCallFunction) => ({
    // POST /api/lists/:listId/tasks - returns new task
    createTask: (listId: string, description: string): Promise<Task> =>
        apiCall({
            method: 'POST',
            url: `/api/lists/${listId}/tasks`,
            data: { description }
        }),

    // PATCH /api/tasks/:taskId - returns new task
    updateTask: (taskId: string, description: string): Promise<Task> =>
        apiCall({
            method: 'PATCH',
            url: `/api/tasks/${taskId}`,
            data: { description }
        }),

    // DELETE /api/tasks/:taskId - returns success message
    deleteTask: (taskId: string): Promise<{ message: string }> =>
        apiCall({
            method: 'DELETE',
            url: `/api/tasks/${taskId}`
        }),

    // PATCH /api/tasks/:taskId/reorder - returns task with list info
    reorderTask: (taskId: string, newIndex: number, toListId: string): Promise<TaskWithList> =>
        apiCall({
            method: 'PATCH',
            url: `/api/tasks/${taskId}/reorder`,
            data: { newIndex, toListId }
        })
});