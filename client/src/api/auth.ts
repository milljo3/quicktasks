import axios from 'axios';
import {AuthResponse} from "../types/api";

// Authenticates a user by logging them in with their username and password
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await axios.post('/api/auth/login', {
        email,
        password,
    });
    return res.data;
};

// Registers a new user with the provided username and password
export const register = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await axios.post('/api/auth/register', {
        email,
        password,
    });
    return res.data;
};