import React from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const VolunteerDashboard = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const { data: requests = [], refetch } = useQuery({
        queryKey: ['volunteer-requests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/donation-requests/volunteer');
            return res.data;
        }
    });

    const handleComplete = (id) => {
        axiosSecure
            .patch(`/donation-requests/${id}/status`, { status: 'completed' })
            .then(() => {
                refetch(); // refresh requests
            })
            .catch((err) => console.error(err));
    };
    const pendingCount = requests.filter(r => r.status === 'volunteer_assigned').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Welcome, {user?.displayName || 'Volunteer'}
            </h1>

            {/* Stats */}
            <div className="flex gap-4 mb-6">
                <div className="p-4 bg-green-100 rounded shadow w-1/3 text-center">
                    <p className="text-lg font-semibold">Pending Requests</p>
                    <p className="text-2xl">{pendingCount}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded shadow w-1/3 text-center">
                    <p className="text-lg font-semibold">Completed Requests</p>
                    <p className="text-2xl">{completedCount}</p>
                </div>
            </div>

            {/* Requests Table */}
            <h2 className="text-xl font-semibold mb-2">Assigned Donation Requests</h2>
            {requests.length === 0 ? (
                <p>No assigned requests yet.</p>
            ) : (
                <table className="table-auto border-collapse w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Requester</th>
                            <th className="border px-4 py-2">Blood Group</th>
                            <th className="border px-4 py-2">Region</th>
                            <th className="border px-4 py-2">District</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id} className="text-center">
                                <td className="border px-4 py-2">{req.requesterEmail}</td>
                                <td className="border px-4 py-2">{req.bloodGroup}</td>
                                <td className="border px-4 py-2">{req.requestRegion}</td>
                                <td className="border px-4 py-2">{req.requestDistrict}</td>
                                <td className="border px-4 py-2">{req.status}</td>
                                <td className="border px-4 py-2">
                                    {req.status === 'volunteer_assigned' ? (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleComplete(req._id)}
                                        >
                                            Mark Completed
                                        </button>
                                    ) : (
                                        <span>Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VolunteerDashboard;
