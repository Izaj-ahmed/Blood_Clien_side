import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import Loading from '../Loading/Loading';
import UseRoles from '../Hooks/UseRoles';
import Forbidden from '../Components/Forbidden';

const AdminRoute = ({ children }) => {

    const { user, loading } = UseAuth();
    const { role, roleLoading } = UseRoles();

    if (loading || !user|| roleLoading) {
       return <Loading></Loading>
    }

    if (role !== 'admin') {
        return <Forbidden></Forbidden>
    }

    return children
};

export default AdminRoute;