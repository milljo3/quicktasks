import { useState } from "react";

interface TaskType {
    id: string;
    description: string;
}

interface TaskProps {
    task: TaskType;
    onEdit: (taskId: string, description: string) => void;
    onDelete: (taskId: string) => void;
}

const Task = ({task, onEdit, onDelete}: TaskProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(task.description);

    const handleEditConfirm = () => {
        if (inputValue.trim() !== "" && inputValue.trim() !== task.description) {
            onEdit(task.id, inputValue.trim());
        }
        setIsEditing(false);
    }

    return (
        <div className="task">
            {isEditing ? (
                <input
                    type="text"
                    placeholder="Enter task description"
                    value={inputValue}
                    autoFocus={true}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleEditConfirm}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleEditConfirm();
                        }
                        else if (e.key === "Escape") {
                            setInputValue(task.description);
                            setIsEditing(false);
                        }
                    }}
                />
            ) : (
                <p>{task.description}</p>
            )}
            {!isEditing && (
                <div>
                    <button onClick={() => setIsEditing(true)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => onDelete(task.id)}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Task;