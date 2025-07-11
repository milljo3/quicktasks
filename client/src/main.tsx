import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {AuthProvider} from "./context/AuthContext";

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
root.render(
    <StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </StrictMode>
)

