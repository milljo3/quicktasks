import {useAuth} from "../context/AuthContext";
import '../styles/navbar.css'
import {Link} from "react-router-dom";

const Navbar = () => {
    const {logout} = useAuth();

    return (
        <>
            <Link id="board-logo" to={`/`}>
                <p>Quick</p>
                <p id="board-logo-2">Tasks</p>
            </Link>
            <button
                id="navbar-sign-out"
                onClick={() => {
                    logout();
                }}
            >
                Sign out
            </button>
        </>
    )
};

export default Navbar;