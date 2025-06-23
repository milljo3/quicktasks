import { useApi } from './useApi';
import { createBoardsApi } from '../api/boards';
import { createListsApi } from '../api/lists';
import { createTasksApi } from '../api/tasks';

interface ApiServices {
    boards: ReturnType<typeof createBoardsApi>;
    lists: ReturnType<typeof createListsApi>;
    tasks: ReturnType<typeof createTasksApi>;
}

export const useApiServices = (): ApiServices => {
    const { apiCall } = useApi();

    return {
        boards: createBoardsApi(apiCall),
        lists: createListsApi(apiCall),
        tasks: createTasksApi(apiCall)
    };
};