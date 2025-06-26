import {useEffect, useState} from "react";
import ListsDisplay from "../components/ListsDisplay";
import BoardUsers from "../components/BoardUsers";
import '../styles/board.css'
import {useApiServices} from "../hooks/useApiServices";
import {useParams} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {BoardWithListsAndTasksAndUsers} from "../types/api";

type Tab = 'board' | 'users';

interface TaskType {
    id: string;
    description: string;
    position: number;
}

interface ListEntity {
    id: string;
    title: string;
    taskIds: string[];
    position: number;
}

interface UserType {
    id: string;
    email: string;
    canEdit: boolean;
}

interface BoardState {
    lists: Record<string, ListEntity>;
    tasks: Record<string, TaskType>;
}

const BoardPage = () => {
    const api = useApiServices();
    const {user} = useAuth();
    const {boardId} = useParams<{boardId: string}>();

    const [activeTab, setActiveTab] = useState<Tab>('board');
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ownerId, setOwnerId] = useState<string>('');
    const [boardState, setBoardState] = useState<BoardState>({
        lists: {},
        tasks: {},
    });
    const [isEditingBoardName, setIsEditingBoardName] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [inputValue, setInputValue] = useState(boardName);

    const tabs: Tab[] = ['board', 'users'];
    const currentUserCanEdit = users.find(u => u.id === user?.id)?.canEdit ?? false;
    const isOwner = user?.id === ownerId;

    useEffect(() => {
        const getBoard = async () => {
            try {
                const response: BoardWithListsAndTasksAndUsers = await api.boards.getBoard(boardId!);

                const lists: Record<string, ListEntity> = {};
                const tasks: Record<string, TaskType> = {};

                response.lists.forEach((list) => {
                    lists[list.id] = {
                        id: list.id,
                        title: list.title,
                        position: list.position,
                        taskIds: list.tasks
                            .sort((a, b) => Number(a.position) - Number(b.position))
                            .map((task) => {
                                tasks[task.id] = {
                                    id: task.id,
                                    description: task.description,
                                    position: Number(task.position)
                                };
                                return task.id
                            })
                    };
                });

                const transformedUsers: UserType[] = response.users.map((user) => ({
                    id: user.userId,
                    email: user.user.email,
                    canEdit: user.canEdit
                }));

                setBoardName(response.title);
                setInputValue(response.title);
                setOwnerId(response.ownerId);
                setUsers(transformedUsers);
                setBoardState({lists, tasks});
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }

        getBoard().catch();
    }, []);

    const getOrderedLists = () => {
        return Object.values(boardState.lists)
            .sort((a, b) => a.position - b.position)
            .map(list => list.id);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'board': {
                return (
                    <ListsDisplay
                        lists={boardState.lists}
                        listOrder={getOrderedLists()}
                        boardState={boardState}
                        setBoardState={setBoardState}
                        currentUserCanEdit={currentUserCanEdit}
                    />
                );
            }
            case 'users': {
                return (
                    <BoardUsers
                        users={users}
                        setUsers={setUsers}
                        ownerId={ownerId}
                        currentUserCanEdit={currentUserCanEdit}
                    />
                );
            }
            default: {
                return <div>Something went wrong...</div>
            }
        }
    }

    const handleEditConfirm = async () => {
        if (!isOwner || inputValue.trim() === "" || inputValue.trim() === boardName) {
            setIsEditingBoardName(false);
            return;
        }

        setIsEditingBoardName(false);

        try {
             await api.boards.updateBoard(boardId!, inputValue);
             setBoardName(inputValue);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div id="board">
            {isLoading ? (<p>Loading...</p>) : (
                <>
                    <div id="board-header">
                        <div id="board-header-sub">
                            {isEditingBoardName ? (
                                <input
                                    type="text"
                                    placeholder="Enter board name"
                                    value={inputValue}
                                    autoFocus={true}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onBlur={handleEditConfirm}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleEditConfirm();
                                        }
                                        else if (e.key === "Escape") {
                                            setInputValue(boardName);
                                            setIsEditingBoardName(false);
                                        }
                                    }}
                                />
                            ) : (
                                <h1>{boardName}</h1>
                            )}
                            {isOwner && !isEditingBoardName && (
                                <button onClick={() => setIsEditingBoardName(true)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div id="board-selection">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {setActiveTab(tab)}}
                                className={activeTab === tab ? "board-selection-button active" : "board-selection-button"}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div id="board-tab-content">
                        {renderTabContent()}
                    </div>
                </>
            )}

        </div>
    );
};

export default BoardPage;