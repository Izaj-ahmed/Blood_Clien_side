import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import UseRoles from '../Hooks/UseRoles';
import Loading from '../Loading/Loading';
import Forbidden from '../Components/Forbidden';

const VolunteerRoutes = ({ children }) => {
  const { user, loading } = UseAuth();
  const { role, roleLoading } = UseRoles();

  if (loading || roleLoading) return <Loading></Loading>;

  if (!user || role !== 'volunteer') {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default VolunteerRoutes;