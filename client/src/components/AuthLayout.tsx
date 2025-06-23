import React from "react";
import '../styles/authLayout.css'

const AuthLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <div id="auth-layout">
            <h1>QuickTasks</h1>
            {children}
            <div id="auth-signature">
                <small>Created by</small>
                <a target="_blank" href="https://github.com/milljo3">
                    <img alt="pfp" src="https://avatars.githubusercontent.com/u/144623594?v=4"/>
                    <p>@milljo3</p>
                    <i className="fa-brands fa-github"></i>
                </a>
            </div>
        </div>
    );
}

export default AuthLayout;