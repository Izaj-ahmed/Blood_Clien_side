import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

const VolunteerAllBloodRequest = () => {
    const axiosSecure = UseAxiosSecure();
    const [filterStatus, setFilterStatus] = useState(null);

    const { data: requests = [], refetch } = useQuery({
        queryKey: ['volunteer-all-requests', filterStatus],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/donation-requests/all?status=${filterStatus || ''}`
            );
            return res.data;
        }
    });


    const handleStatusUpdate = (id, status) => {
        axiosSecure
            .patch(`/donation-requests/${id}/status`, { status })
            .then(() => refetch());
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">
                All Blood Donation Requests
            </h2>

            {/* Filter */}
            <div className="mb-4">
                <select
                    className="select select-bordered"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Requester</th>
                            <th>Blood Group</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((req, index) => (
                            <tr key={req._id}>
                                <td>{index + 1}</td>
                                <td>{req.requesterEmail}</td>
                                <td>{req.bloodGroup}</td>
                                <td>{req.requestRegion}</td>
                                <td>{req.requestDistrict}</td>
                                <td className="capitalize">{req.status}</td>
                                <td>
                                    {req.status === 'approved' && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleStatusUpdate(req._id, 'completed')}
                                        >
                                            Mark Completed
                                        </button>
                                    )}

                                    {req.status === 'completed' && (
                                        <span className="text-green-600 font-semibold">Completed</span>
                                    )}

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VolunteerAllBloodRequest;
