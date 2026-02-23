import axios from 'axios';
import React, { useEffect } from 'react';
import UseAuth from './UseAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: 'https://blooddonation-gold.vercel.app/'
})

const UseAxiosSecure = () => {
    const { user, logOut } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Get the Firebase ID token
        const getToken = async () => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    return token;
                } catch (error) {
                    console.error('Error getting token:', error);
                    return null;
                }
            }
            return null;
        };

        const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                const statusCode = error.response?.status;
                if (statusCode === 401 || statusCode === 403) {
                    logOut()
                        .then(() => {
                            navigate('/login');
                        })
                        .catch(err => console.error('Logout error:', err));
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [logOut, navigate, user]);

    return axiosSecure;
};

export default UseAxiosSecure;