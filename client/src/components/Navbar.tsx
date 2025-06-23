import {useAuth} from "../context/AuthContext";
import '../styles/navbar.css'

const Navbar = () => {
    const {logout} = useAuth();

    return (
        <>
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