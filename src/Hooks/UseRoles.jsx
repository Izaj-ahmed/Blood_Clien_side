import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAuth from './UseAuth';
import UseAxiosSecure from './UseAxiosSecure';

const UseRoles = () => {

    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const { isLoading: roleLoading, data: role = 'donor' } = useQuery({
        queryKey: ['user-role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data?.role || 'donor';
        }
    });

    return { role, roleLoading };
};

export default UseRoles;