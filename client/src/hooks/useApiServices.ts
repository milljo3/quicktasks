import { useApi } from './useApi';
import { createBoardsApi } from '../api/boards';
import { createListsApi } from '../api/lists';
import { createTasksApi } from '../api/tasks';
import { createAuthApi } from '../api/auth';

interface ApiServices {
    auth: ReturnType<typeof createAuthApi>;
    boards: ReturnType<typeof createBoardsApi>;
    lists: ReturnType<typeof createListsApi>;
    tasks: ReturnType<typeof createTasksApi>;
}

export const useApiServices = (): ApiServices => {
    const { apiCall } = useApi();

    return {
        auth: createAuthApi(apiCall),
        boards: createBoardsApi(apiCall),
        lists: createListsApi(apiCall),
        tasks: createTasksApi(apiCall)
    };
};