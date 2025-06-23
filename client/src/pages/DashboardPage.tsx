import BoardDisplay from "../components/BoardDisplay";
import {useAuth} from "../context/AuthContext";
import {useEffect, useState} from "react";
import {useApiServices} from "../hooks/useApiServices";
import BasicModal from "../components/BasicModal";

interface BoardDisplayType {
    id: string;
    title: string;
}

const DashboardPage = () => {
    const api = useApiServices()
    const [boards, setBoards] = useState<BoardDisplayType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");

    const {user} = useAuth();
    const email = user?.email.split('@')[0];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setBoardTitle("");
    };

    useEffect(() => {
        const getAllBoards = async () => {
            try {
                const response = await api.boards.getUserBoards();
                const boardDisplays = response.map(board => ({
                    id: board.board.id,
                    title: board.board.title,
                }));
                setBoards(boardDisplays);
            }
            catch (error) {
                console.log(error);
            }
        }

        getAllBoards().catch();
    }, []);

    const createBoard = async () => {
        if (boardTitle.trim() === "") {
            return;
        }

        closeModal();
        try {
            const response = await api.boards.createBoard(boardTitle);
            const newBoard: BoardDisplayType = {
                id: response.id,
                title: response.title
            }
            setBoards([...boards, newBoard]);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleRenameBoard = async (boardId: string, newTitle: string) => {
        try {
            await api.boards.updateBoard(boardId, newTitle);

            const updatedBoards = boards.map(board =>
                board.id === boardId ? {...board, title: newTitle } : board
            );
            setBoards(updatedBoards);
        }
        catch (error) {
            console.error(error);
        }
    }

    // Add modal confirmation later
    const handleDeleteBoard = async (boardId: string) => {
        try {
            await api.boards.deleteBoard(boardId);

            const updatedBoards = boards.filter(board => board.id !== boardId);
            setBoards(updatedBoards);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div id="dashboard">
            <h1>Welcome {email}</h1>
            {boards.length !== 0 && (
                <button className="dashboard-add-board" onClick={openModal}>
                    Add New Board
                </button>
            )}
            <div id="dashboard-body">
                <h2>Your boards:</h2>
                <div id="dashboard-boards">
                    {boards.length === 0 && (
                        <div id="dashboard-no-boards">
                            <h2>No boards yet? <br/> Create a new board:</h2>
                            <button className="dashboard-add-board" onClick={openModal}>
                                Create New Board
                            </button>
                        </div>

                    )}
                    {boards.map((board) => (
                        <BoardDisplay
                            key={board.id}
                            boardId={board.id}
                            title={board.title}
                            onEditTitle={handleRenameBoard}
                            onDelete={handleDeleteBoard}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <BasicModal
                    title={"Enter board title:"}
                    placeholder={"Title"}
                    inputValue={boardTitle}
                    onInputChange={(e) => setBoardTitle(e.target.value)}
                    onClose={() => closeModal()}
                    onConfirm={createBoard}
                    confirmText={"Create"}
                />
            )}
        </div>
    );
};

export default DashboardPage;