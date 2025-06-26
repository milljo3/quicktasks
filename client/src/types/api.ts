export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User
}

export interface Board {
    id: string;
    title: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface List {
    id: string;
    title: string;
    position: number;
    boardId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    description: string;
    position: number;
    listId: string;
    createdAt: string;
    updatedAt: string;
}

export interface BoardUser {
    userId: string;
    boardId: string;
    canEdit: boolean;
    user: {
        id: string;
        email: string;
    }
}

export interface UserBoardsResponse {
    board: {
        id: string;
        title: string;
    };
}

export interface BoardWithListsAndTasksAndUsers extends Board {
    lists: Array<List & {
        tasks: Task[];
    }>;
    users: BoardUser[];
}

export interface BoardWithUsers extends Board {
    users: BoardUser[];
}

export interface BoardUsersResponse {
    canEdit: boolean;
    user: {
        email: string;
    };
}

export interface TaskWithList extends Task {
    list: {
        id: string;
        title: string;
    };
}

export interface ApiCallConfig {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    url: string;
    data?: any;
    headers?: Record<string, string>;
}


export type ApiCallFunction = (config: ApiCallConfig) => Promise<any>;