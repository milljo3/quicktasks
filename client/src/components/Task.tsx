interface TaskType {
    id: string;
    description: string;
}

const Task = ({id, description}: TaskType) => {
    return (
        <div id="task">
            <p>{description}</p>
        </div>
    )
}

export default Task;