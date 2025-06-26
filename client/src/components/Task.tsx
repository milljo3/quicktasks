import { useState } from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

interface TaskType {
    id: string;
    description: string;
    position: number;
}

interface TaskProps {
    task: TaskType;
    onEdit: (taskId: string, description: string) => void;
    onDelete: (taskId: string) => void;
}

const Task = ({task, onEdit, onDelete}: TaskProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(task.description);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        disabled: isEditing
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleEditConfirm = () => {
        if (inputValue.trim() !== "" && inputValue.trim() !== task.description) {
            onEdit(task.id, inputValue.trim());
        }
        setIsEditing(false);
    }

    return (
        <div className="task" ref={setNodeRef} style={style}>
            <div className="task-content" {...attributes} {...listeners}>
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
            </div>
            {!isEditing && (
                <div className="task-edit-buttons">
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