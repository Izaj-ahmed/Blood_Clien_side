import React, { useState } from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const VolunteerDashboard = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: requests = [], refetch } = useQuery({
        queryKey: ['volunteer-requests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/donation-requests/volunteer');
            return res.data;
        }
    });

    const handleStatusChange = (id, newStatus) => {
        Swal.fire({
            title: "Update Status",
            text: `Mark this request as ${newStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, mark as ${newStatus}`
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure
                    .patch(`/donation-requests/${id}/status`, { status: newStatus })
                    .then(() => {
                        refetch();
                        Swal.fire({
                            icon: 'success',
                            title: 'Status Updated',
                            text: `Request marked as ${newStatus}`,
                            timer: 1500,
                            showConfirmButton: false
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update status'
                        });
                    });
            }
        });
    };

    const pendingCount = requests.filter(r => r.status === 'volunteer_assigned' || r.status === 'approved').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;
    const totalCount = requests.length;

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = requests.slice(startIndex, endIndex);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6">
                Welcome, {user?.displayName || 'Volunteer'}
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Total Requests</div>
                    <div className="stat-value text-info">{totalCount}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Pending/Assigned</div>
                    <div className="stat-value text-warning">{pendingCount}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-xl">
                    <div className="stat-title">Completed</div>
                    <div className="stat-value text-success">{completedCount}</div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-base-100 shadow rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Blood Donation Requests</h2>
                {requests.length === 0 ? (
                    <p className="text-gray-600 py-6">No assigned requests yet.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto mb-6">
                            <table className="table table-zebra">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>#</th>
                                        <th>Requester</th>
                                        <th>Blood Group</th>
                                        <th>Region</th>
                                        <th>District</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.map((req, index) => (
                                        <tr key={req._id}>
                                            <th>{startIndex + index + 1}</th>
                                            <td>{req.requesterName || req.requesterEmail}</td>
                                            <td>
                                                <span className="badge badge-primary">{req.bloodGroup}</span>
                                            </td>
                                            <td>{req.requestRegion}</td>
                                            <td>{req.requestDistrict}</td>
                                            <td>
                                                <span className={`badge 
                                                    ${req.status === 'approved' && 'badge-warning'}
                                                    ${req.status === 'volunteer_assigned' && 'badge-info'}
                                                    ${req.status === 'completed' && 'badge-success'}
                                                `}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td>
                                                {req.status !== 'completed' ? (
                                                    <div className='flex gap-2'>
                                                        <button
                                                            className="btn btn-sm btn-primary text-white"
                                                            onClick={() => handleStatusChange(req._id, 'completed')}
                                                            title='Mark as Completed'
                                                        >
                                                            Done
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => handleStatusChange(req._id, 'canceled')}
                                                            title='Cancel Request'
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-success font-semibold">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='flex justify-center gap-2 mt-6'>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className='btn btn-outline'
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className='btn btn-outline'
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;
