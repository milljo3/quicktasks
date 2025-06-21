import '../styles/navbar.css';
import {useAuth} from "../context/AuthContext";

const Navbar = () => {
    const {token, logout} = useAuth();

    return (
        <>
            {token &&
                <button
                    id="navbar-sign-out"
                    onClick={() => {
                        logout();
                    }}
                >
                    Sign out
                </button>
            }
        </>
    )
};

export default Navbar;