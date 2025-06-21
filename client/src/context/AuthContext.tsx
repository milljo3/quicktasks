import {createContext, useContext, useEffect, useState} from "react";
import {useApiServices} from "../hooks/useApiServices";

interface User {
    id: string;
    email: string;
}

interface AuthContext {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const api = useApiServices();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const validateStoredAuth = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) {
                try {
                    const response = await api.auth.verify();

                    if (response.valid) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    }
                    else {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                    }
                }
                catch (error) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }

            setIsLoading(false);
        };

        validateStoredAuth().catch();
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{token, user, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the auth context in other components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be defined');
    }
    return context;
}