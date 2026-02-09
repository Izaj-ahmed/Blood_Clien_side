import axios from 'axios';
import React, { useEffect } from 'react';
import UseAuth from './UseAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL : 'http://localhost:3000'
})

const UseAxiosSecure = () => {
    const {user, logOut} = UseAuth();

    const navigate = useNavigate();

    useEffect(()=>{
        const reqInterceptor = axiosSecure.interceptors.request.use(config=>{
            config.headers.Authorization = `Bearer ${user?.accessToken} `
            return config
        })

        const resInterceptor = axiosSecure.interceptors.response.use((response)=>{
            return response;
        },(error)=>{
            const statusCode = error.status;
            if(statusCode===401 || statusCode===403){
                logOut()
                .then(()=>{
                    navigate('/login')
                })
            }
            return Promise.reject(error)
        })

        return ()=> {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);

        }

    },[logOut, navigate, user])

    return axiosSecure
};

export default UseAxiosSecure;