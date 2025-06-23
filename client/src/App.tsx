import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Layout from "./components/Layout";
import {useAuth} from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";

const ProtectedRoute = ({children} : {children: React.ReactNode}) => {
    const {token, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return token ? <>{children}</> : <Navigate to="/login" replace />;
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<Layout />}>
                    <Route index element = {
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="board/:boardId" element={
                        <ProtectedRoute>
                            <BoardPage />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;