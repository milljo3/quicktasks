import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Layout from "./components/Layout";
import {useAuth} from "./context/AuthContext";

const ProtectedRoute = ({children} : {children: React.ReactNode}) => {
    const {token, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return token ? <>{children}</> : <Navigate to="/login"/>;
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login"/>
                <Route path="/register"/>

                <Route path="/" element={<Layout />}>
                    <Route index element = {
                        <ProtectedRoute>
                            <></>
                        </ProtectedRoute>
                    } />
                    <Route path="board/:boardId" element={
                        <ProtectedRoute>
                            <></>
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;