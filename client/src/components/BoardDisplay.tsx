import {Link} from "react-router-dom";
import '../styles/dashboard.css'

interface BoardDisplayType {
    id: string;
    title: string;
}

const BoardDisplay = (props: BoardDisplayType) => {
    return (
        <Link className="board-display" to={`/board/${props.id}`}>
            {props.title}
        </Link>
    )
};

export default BoardDisplay;