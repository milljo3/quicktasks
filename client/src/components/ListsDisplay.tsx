import List from "./List";
import {useState} from "react";
import {useApiServices} from "../hooks/useApiServices";
import {useParams} from "react-router-dom";

interface TaskType {
    id: string;
    description: string;
}

interface ListEntity {
    id: string;
    title: string;
    taskIds: string[];
}

interface BoardState {
    lists: Record<string, ListEntity>;
    tasks: Record<string, TaskType>;
    listOrder: string[];
}

interface ListsDisplayProps {
    lists: Record<string, ListEntity>;
    tasks: Record<string, TaskType>;
    listOrder: string[];
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
    currentUserCanEdit: boolean;
}

const ListsDisplay = ({lists, tasks, listOrder, setBoardState, currentUserCanEdit}: ListsDisplayProps) => {
    const api = useApiServices();
    const {boardId} = useParams<{boardId: string}>();

    const [deletingListIds, setDeletingListIds] = useState<Set<string>>(new Set());

    const addList = async () => {
        if (!currentUserCanEdit) {
            return;
        }

        const defaultTitle: string = "New Category";

        try {
            const response = await api.boards.createList(boardId!, defaultTitle)

            setBoardState((prev) => ({
                ...prev,
                lists: {
                    ...prev.lists,
                    [response.id]: {
                        id: response.id,
                        title: defaultTitle,
                        taskIds: []
                    }
                },
                listOrder: [...prev.listOrder, response.id],
            }));
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleRemoveList = async (listId: string) => {
        if (!currentUserCanEdit) {
            return;
        }

        const removedList = lists[listId];

        setBoardState((prev) => {
            const {[listId]: _, ...newLists} = prev.lists;
            return {
                ...prev,
                lists: newLists,
                listOrder: prev.listOrder.filter((id) => id !== listId),
            };
        });

        setDeletingListIds((prev) => new Set(prev).add(listId));

        try {
            await api.lists.deleteList(listId);
        }
        catch (error) {
            console.error(error);
            alert("Failed to delete the list. Restoring it.");

            setBoardState((prev) => ({
                ...prev,
                lists: {
                    ...prev.lists,
                    [removedList.id]: removedList
                },
                listOrder: [
                    ...prev.listOrder.slice(0, prev.listOrder.indexOf(listId)),
                    listId,
                    ...prev.listOrder.slice(prev.listOrder.indexOf(listId))
                ]
            }));
        }
        finally {
            setDeletingListIds((prev) => {
                const next = new Set(prev);
                next.delete(listId);
                return next;
            });
        }
    }

    const handleRenameList = async (listId: string, newTitle: string) => {
        try {
            await api.lists.updateList(listId, newTitle);
            setBoardState((prev) => ({
                ...prev,
                lists: {
                    ...prev.lists,
                    [listId]: {
                        ...prev.lists[listId],
                        title: newTitle,
                    },
                },
            }));
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleAddTask = async (listId: string, taskDescription: string) => {
        try {
            const response = await api.lists.createTask(listId, taskDescription);

            setBoardState(prev => {
                const newTask = {
                    id: response.id,
                    description: response.description,
                };

                const newTasks = {
                    ...prev.tasks,
                    [newTask.id]: newTask
                };

                const newTaskIds = [...prev.lists[listId].taskIds, newTask.id];

                const newLists = {
                    ...prev.lists,
                    [listId]: {
                        ...prev.lists[listId],
                        taskIds: newTaskIds
                    }
                };

                return {
                    ...prev,
                    tasks: newTasks,
                    lists: newLists
                };
            });
        }
        catch (error) {
            console.error("Failed to add task", error);
        }
    }

    const handleEditTask = async (taskId: string, newDescription: string) => {
        try {
            await api.tasks.updateTask(taskId, newDescription);
            setBoardState((prev) => ({
                ...prev,
                tasks: {
                    ...prev.tasks,
                    [taskId]: {
                        ...prev.tasks[taskId],
                        description: newDescription,
                    },
                },
            }));
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
            await api.tasks.deleteTask(taskId);

            setBoardState((prev) => {
                const { [taskId]: _, ...newTasks } = prev.tasks;

                const updatedLists = Object.entries(prev.lists).reduce((acc, [listId, list]) => {
                    acc[listId] = {
                        ...list,
                        taskIds: list.taskIds.filter((id) => id !== taskId),
                    };
                    return acc;
                }, {} as Record<string, ListEntity>);

                return {
                    ...prev,
                    tasks: newTasks,
                    lists: updatedLists,
                };
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div id="lists-display">
                {listOrder.map((listId) => {
                    const list = lists[listId];
                    if (!list) {
                        return null;
                    }

                    const listsTasks = list.taskIds.map((id) => tasks[id]);

                    return (
                        <List
                            key={list.id}
                            list={list}
                            tasks={listsTasks}
                            onAddTask={handleAddTask}
                            onDeleteList={() => handleRemoveList(list.id)}
                            onEditListTitle={handleRenameList}
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                            isDeleting={deletingListIds.has(list.id)}
                            currentUserCanEdit={currentUserCanEdit}
                        />
                    )
                })}
                {currentUserCanEdit && (
                    <button id="list-add" onClick={addList}>
                        New Category
                    </button>
                )}
            </div>
        </>
    )
}

export default ListsDisplay;