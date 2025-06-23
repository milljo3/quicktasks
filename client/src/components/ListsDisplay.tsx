import List from "./List";

interface TaskType {
    id: string;
    description: string;
}

interface ListType {
    id: string;
    title: string;
    tasks: TaskType[];
}

interface ListsDisplayProps {
    lists: ListType[];
    currentUserCanEdit: boolean;
}

const ListsDisplay = ({lists, currentUserCanEdit}: ListsDisplayProps) => {
    return (
        <>
            {currentUserCanEdit && (
                <button>
                    Add new category
                </button>
            )}
            <div id="lists-display">
                {lists.map((list: ListType) => (
                    <List key={list.id} list={list} currentUserCanEdit={currentUserCanEdit}/>
                ))}
            </div>
        </>
    )
}

export default ListsDisplay;