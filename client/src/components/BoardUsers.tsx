import {useAuth} from "../context/AuthContext";
import BoardUser from "./BoardUser";
import {useState} from "react";
import {useApiServices} from "../hooks/useApiServices";
import {useParams} from "react-router-dom";
import BasicModal from "./BasicModal";

interface UserType {
    id: string;
    email: string;
    canEdit: boolean;
}

interface BoardUsersProps {
    users: UserType[];
    setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
    ownerId: string;
    currentUserCanEdit: boolean;
}

const BoardUsers = ({users, setUsers, ownerId, currentUserCanEdit}: BoardUsersProps) => {
    const api = useApiServices();
    const {user} = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState("");
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const {boardId} = useParams<{boardId: string}>();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setShareEmail("");
    };

    const addUser = async () => {
        if (shareEmail.trim() === "" || !currentUserCanEdit) {
            return;
        }

        closeModal();
        try {
            const response = await api.boards.shareBoard(boardId!, shareEmail, false);
            setUsers([...users, {
                id: response.userId,
                email: shareEmail,
                canEdit: false
            }]);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleSetCanEdit = async (userId: string, newValue: boolean) => {
        setLoadingIds(prev => new Set(prev).add(userId));

        try {
            await api.boards.updateBoardPermissions(boardId!, userId, newValue);

            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === userId ? { ...u, canEdit: newValue } : u
                )
            );
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoadingIds(prev => {
                const updated = new Set(prev);
                updated.delete(userId);
                return updated;
            })
        }
    };

    if (!user) {
        return (
            <p>Failed to fetch user. Try again later</p>
        )
    }

    return (
        <div id="board-users">
            <div id="board-users-display">
                <h2 className="board-users-header">User:</h2>
                <h2 className="board-users-header header-2">Can Edit:</h2>
                {users.map((u: UserType) => (
                    <BoardUser
                        key={u.id}
                        currentUserId={user.id}
                        ownerId={ownerId}
                        user={u}
                        onSetCanEdit={handleSetCanEdit}
                        isLoading={loadingIds.has(u.id)}
                    />
                ))}
            </div>
            {currentUserCanEdit && (
                <button id="board-users-add" onClick={openModal}>
                    Add User
                </button>
            )}
            {isModalOpen && (
                <BasicModal
                    title={"Enter email:"}
                    placeholder={"Ex: johndoe@gmail.com"}
                    inputValue={shareEmail}
                    onInputChange={(e) => setShareEmail(e.target.value)}
                    onClose={() => closeModal()}
                    onConfirm={addUser}
                    confirmText={"Share"}
                />
            )}
        </div>
    )
};

export default BoardUsers;