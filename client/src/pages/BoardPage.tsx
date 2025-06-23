import {useEffect, useState} from "react";
import ListsDisplay from "../components/ListsDisplay";
import BoardUsers from "../components/BoardUsers";
import '../styles/board.css'
import {useApiServices} from "../hooks/useApiServices";
import {useParams} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Tab = 'board' | 'users';

interface TaskType {
    id: string;
    description: string;
}

interface ListType {
    id: string;
    title: string;
    tasks: TaskType[];
}

interface UserType {
    id: string;
    email: string;
    canEdit: boolean;
}

const BoardPage = () => {
    const api = useApiServices();
    const {boardId} = useParams<{boardId: string}>();
    const [activeTab, setActiveTab] = useState<Tab>('board');
    const [boardName, setBoardName] = useState<string>('');
    const [lists, setLists] = useState<ListType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ownerId, setOwnerId] = useState<string>('');

    const {user} = useAuth();

    const tabs: Tab[] = ['board', 'users'];
    const currentUserCanEdit = users.find(u => u.id === user?.id)?.canEdit ?? false;

    useEffect(() => {
        const getBoard = async () => {
            try {
                const response = await api.boards.getBoard(boardId!);

                const transformedLists: ListType[] = response.lists.map(list => ({
                    id: list.id,
                    title: list.title,
                    tasks: list.tasks.map(task => ({
                        id: task.id,
                        description: task.description,
                    }))
                }));

                const transformedUsers: UserType[] = response.users.map(user => ({
                    id: user.userId,
                    email: user.user.email,
                    canEdit: user.canEdit,
                }));

                setBoardName(response.title);
                setOwnerId(response.ownerId);
                setLists(transformedLists);
                setUsers(transformedUsers);
            }
            catch (error) {
                console.error(error);
            }
        }

        setIsLoading(false);

        getBoard().catch();
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'board': {
                return <ListsDisplay lists={lists} currentUserCanEdit={currentUserCanEdit}/>;
            }
            case 'users': {
                return <BoardUsers users={users} setUsers={setUsers} ownerId={ownerId} currentUserCanEdit={currentUserCanEdit}/>;
            }
            default: {
                return <div>Something went wrong...</div>
            }
        }
    }

    return (
        <div id="board">
            {isLoading ? (<p>Loading...</p>) : (
                <>
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