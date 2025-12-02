
import axios from 'axios';
import { useNavigate } from 'react-router';
import { getAuth } from 'firebase/auth';
import useAuth from './useAuth';

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth();

    const axiosSecure = axios.create({
        baseURL: 'http://localhost:3000'
    });

    // Request interceptor
    axiosSecure.interceptors.request.use(async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const token = await currentUser.getIdToken(); // Firebase JWT
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => Promise.reject(error));

    // Response interceptor
    axiosSecure.interceptors.response.use(
        (res) => res,
        (error) => {
            const status = error.response?.status;
            if (status === 403) {
                navigate('/forbidden');
            } else if (status === 401) {
                logOut()
                    .then(() => navigate('/login'))
                    .catch(() => { });
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
