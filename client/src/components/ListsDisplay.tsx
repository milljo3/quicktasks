import List from "./List";
import {useState} from "react";
import {useApiServices} from "../hooks/useApiServices";
import {useParams} from "react-router-dom";
import {DndContext, DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";

interface TaskType {
    id: string;
    description: string
    position: number;
}

interface ListEntity {
    id: string;
    title: string;
    taskIds: string[];
    position: number;
}

interface BoardState {
    lists: Record<string, ListEntity>;
    tasks: Record<string, TaskType>;
}

interface ListsDisplayProps {
    lists: Record<string, ListEntity>;
    listOrder: string[];
    boardState: BoardState;
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
    currentUserCanEdit: boolean;
}

const ListsDisplay = ({lists, listOrder, boardState, setBoardState, currentUserCanEdit}: ListsDisplayProps) => {
    const api = useApiServices();
    const {boardId} = useParams<{boardId: string}>();

    const [deletingListIds, setDeletingListIds] = useState<Set<string>>(new Set());
    const [dragSnapshot, setDragSnapshot] = useState<BoardState | null>(null);

    const displayState = dragSnapshot || boardState;

    const addList = async () => {
        if (!currentUserCanEdit) {
            return;
        }

        const defaultTitle: string = "New Category";

        try {
            const response = await api.boards.createList(boardId!, defaultTitle)

            setBoardState((prev) => {
                const currentPositions = Object.values(prev.lists).map(l => l.position);
                const maxPosition = currentPositions.length > 0 ? Math.max(...currentPositions) : 0;
                const newPosition = maxPosition + 1;

                return {
                    ...prev,
                    lists: {
                        ...prev.lists,
                        [response.id]: {
                            id: response.id,
                            title: defaultTitle,
                            taskIds: [],
                            position: newPosition
                        }
                    }
                };
            });
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
                const currentTasks = prev.lists[listId].taskIds
                    .map(id => prev.tasks[id])
                    .filter(Boolean);

                const maxPosition = currentTasks.length > 0
                    ? Math.max(...currentTasks.map(t => t.position))
                    : 0;

                const newTask = {
                    id: response.id,
                    description: response.description,
                    position: maxPosition + 1
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
                }
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

    const handleDragStart = (e: DragStartEvent) => {
        if (!currentUserCanEdit) return;

        setDragSnapshot({...boardState});
    };


    const handleDragOver = (e: DragOverEvent) => {

    };

    const handleDragEnd = async (e: DragEndEvent) => {
        setDragSnapshot(null);

        const activeId = e.active.id.toString();
        const overId = e.over?.id?.toString();
        const containerId = e.active.data.current?.sortable.containerId;
        const overContainerId = e.over?.data.current?.sortable.containerId;

        if (!overId || !containerId || containerId !== overContainerId || activeId === overId) {
            return;
        }

        const list = boardState.lists[containerId];
        const oldIndex = list.taskIds.indexOf(activeId);
        const newIndex = list.taskIds.indexOf(overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        setBoardState(prev => {
            const list = prev.lists[containerId];
            const newTaskIds = arrayMove(list.taskIds, oldIndex, newIndex);

            return {
                ...prev,
                lists: {
                    ...prev.lists,
                    [containerId]: {
                        ...list,
                        taskIds: newTaskIds
                    }
                }
            };
        });

        try {
            await api.tasks.reorderTask(activeId, newIndex, containerId);
        }
        catch (error) {
            console.error("Failed to reorder task:", error);
        }
    };

    const handleDragCancel = (e: DragCancelEvent) => {
        setDragSnapshot(null);
    }

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div id="lists-display">
                {listOrder.map((listId) => {
                    const list = displayState.lists[listId];
                    if (!list) {
                        return null;
                    }

                    const listsTasks= list.taskIds.map(id => displayState.tasks[id]).filter(Boolean);

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
        </DndContext>
    )
}

export default ListsDisplay;