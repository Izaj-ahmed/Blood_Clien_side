import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import UseAuth from '../../../Hooks/UseAuth';

const DonorDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();

    const { data: myRequests = [] } = useQuery({
        queryKey: ['my-donation-requests', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/my-donation-requests');
            return res.data;
        }
    });

    const stats = {
        total: myRequests.length,
        pending: myRequests.filter(r => r.status === 'pending').length,
        approved: myRequests.filter(r => r.status === 'approved').length,
        completed: myRequests.filter(r => r.status === 'completed').length
    };

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold mb-6">
                Welcome, {user?.displayName}
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Total Requests</div>
                    <div className="stat-value">{stats.total}</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-warning">{stats.pending}</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Approved</div>
                    <div className="stat-value text-primary">{stats.approved}</div>
                </div>

                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Completed</div>
                    <div className="stat-value text-success">{stats.completed}</div>
                </div>
            </div>

            {/* My Requests Table */}
            <div className="bg-base-100 shadow rounded-xl p-4">
                <h3 className="text-2xl font-semibold mb-4">
                    My Blood Donation Requests
                </h3>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Blood Group</th>
                                <th>District</th>
                                <th>Status</th>
                                <th>Requested On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myRequests.map((req, index) => (
                                    <tr key={req._id}>
                                        <th>{index + 1}</th>
                                        <td>{req.bloodGroup}</td>
                                        <td>{req.requestDistrict}</td>
                                        <td>
                                            <span className={`badge 
                                                ${req.status === 'pending' && 'badge-warning'}
                                                ${req.status === 'approved' && 'badge-primary'}
                                                ${req.status === 'completed' && 'badge-success'}
                                            `}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {
                        myRequests.length === 0 && (
                            <p className="text-center text-gray-500 py-6">
                                You haven’t created any donation requests yet.
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
