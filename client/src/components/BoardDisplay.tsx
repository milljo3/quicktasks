import {Link} from "react-router-dom";
import '../styles/dashboard.css'
import {useState} from "react";

interface BoardDisplayProps {
    boardId: string;
    title: string;
    onEditTitle: (boardId: string, newTitle: string) => void;
    onDelete: (boardId: string) => void;
}

const BoardDisplay = ({boardId, title, onEditTitle, onDelete}: BoardDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState<string>(title);

    const handleEditConfirm = () => {
        if (inputValue.trim() !== "" && inputValue.trim() !== title) {
            onEditTitle(boardId, inputValue.trim());
        }
        setIsEditing(false);
    }

    return (
        <div className="board-display">
            {isEditing ? (
                <input
                    type="text"
                    placeholder="Enter board title"
                    value={inputValue}
                    autoFocus={true}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleEditConfirm}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleEditConfirm();
                        }
                        else if (e.key === "Escape") {
                            setInputValue(title);
                            setIsEditing(false);
                        }
                    }}
                />
            ) : (
                <Link className="board-display-link" to={`/board/${boardId}`}>
                    {title}
                </Link>
            )}
            <div className="board-display-buttons">
                <button onClick={() => setIsEditing(true)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => onDelete(boardId)}>
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    )
};

export default BoardDisplay;