import React from 'react';
import UseRoles from '../../../Hooks/UseRoles';
import Loading from '../../../Loading/Loading';
import AdminDashboard from './AdminDashboard';
import RiderDashboard from './VolunteerDashboard';
import DonorDashboard from './DonorDashboard';
import VolunteerDashboard from './VolunteerDashboard';

const DashboardHome = () => {
    const {role, roleLoading} = UseRoles();
    if(roleLoading){
        return <Loading></Loading>
    }
    if (role==='admin'){
        return <AdminDashboard></AdminDashboard>
    }
    else if( role === 'volunteer'){
        return <VolunteerDashboard></VolunteerDashboard>
    }
    else{
        return <DonorDashboard></DonorDashboard>
    }
};

export default DashboardHome;