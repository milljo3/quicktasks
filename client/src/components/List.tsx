import Task from "./Task";
import {useState} from "react";

interface TaskType {
    id: string;
    description: string;
}

interface ListEntity {
    id: string;
    title: string;
    taskIds: string[];
}

interface ListProps {
    list: ListEntity;
    tasks: TaskType[];
    onAddTask: (taskId: string, description: string) => void;
    onDeleteList: (taskId: string) => void;
    onEditListTitle: (taskId: string, newTitle: string) => void;
    onEditTask: (taskId: string, newDescription: string) => void;
    onDeleteTask: (taskId: string) => void;
    isDeleting: boolean;
    currentUserCanEdit: boolean;
}

const List = ({list, tasks, onAddTask, onDeleteList, onEditListTitle, onEditTask, onDeleteTask, isDeleting, currentUserCanEdit}: ListProps) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState(list.title);

    const handleTitleConfirm = () => {
        if (titleInput.trim() !== "" && titleInput.trim() !== list.title) {
            onEditListTitle(list.id, titleInput.trim());
        }
        setIsEditingTitle(false);
    }

    return (
        <div className="list">
            <div className="list-header">
                {isEditingTitle ? (
                    <input
                        type="text"
                        placeholder="Enter category title"
                        value={titleInput}
                        autoFocus={true}
                        onChange={(e) => setTitleInput(e.target.value)}
                        onBlur={handleTitleConfirm}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleTitleConfirm();
                            }
                            else if (e.key === "Escape") {
                                setTitleInput(list.title);
                                setIsEditingTitle(false);
                            }
                        }}
                    />
                ) : (
                    <h3>{list.title}</h3>
                )}
                {currentUserCanEdit && !isEditingTitle && (
                    <div>
                        <button onClick={() => setIsEditingTitle(true)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => onDeleteList(list.id)} disabled={isDeleting}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                )}
            </div>
            <div className="list-body">
                {tasks.map((task: TaskType) => (
                    <Task
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                    />
                ))}
            </div>
            {currentUserCanEdit && (
                <button className="list-add-task" onClick={() => onAddTask(list.id, "Blank")}>
                    Add new task
                </button>
            )}
        </div>
    )
}

export default List;