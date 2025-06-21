import {useAuth} from "../context/AuthContext";
import axios, {AxiosRequestConfig} from "axios";
import {API_CONFIG} from "../config/api";
import {ApiCallConfig, ApiCallFunction} from "../types/api";

export const useApi = () => {
    const {token, logout} = useAuth();

    const apiCall: ApiCallFunction = async (config: ApiCallConfig) => {
        try {
            const axiosConfig: AxiosRequestConfig = {
                ...config,
                baseURL: API_CONFIG.baseURL,
                timeout: API_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...config.headers,
                }
            };

            const response = await axios(axiosConfig);
            return response.data;
        }
        catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
            throw error;
        }
    };

    return {apiCall};
}