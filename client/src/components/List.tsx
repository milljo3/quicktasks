import Task from "./Task";

interface TaskType {
    id: string;
    description: string;
}

interface ListType {
    id: string;
    title: string;
    tasks: TaskType[];
}

interface ListProps {
    list: ListType;
    currentUserCanEdit: boolean;
}

const List = ({list, currentUserCanEdit}: ListProps) => {
    return (
        <div id="list">
            <h3>{list.title}</h3>
            {list.tasks.map((task: TaskType) => (
                <Task key={task.id} id={task.id} description={task.description}/>
            ))}
            {currentUserCanEdit && (
                <button>
                    Add new task
                </button>
            )}
        </div>
    )
}

export default List;