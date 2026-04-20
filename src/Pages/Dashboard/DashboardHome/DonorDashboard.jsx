import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import UseAuth from '../../../Hooks/UseAuth';
import Swal from 'sweetalert2';
import { MdEdit } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';

const DonorDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const [editingId, setEditingId] = useState(null);

    const { data: myRequests = [], refetch } = useQuery({
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

    // Get 3 most recent requests
    const recentRequests = myRequests.slice(0, 3);

    const handleStatusChange = (requestId, newStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to mark this request as ${newStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, mark as ${newStatus}`
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/donation-requests/${requestId}/status`, { status: newStatus })
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
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update status'
                        });
                    });
            }
        });
    };

    const handleDelete = (requestId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/donation-requests/${requestId}`)
                    .then(() => {
                        refetch();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Your donation request has been deleted',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    })
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete request'
                        });
                    });
            }
        });
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
                    My Recent Blood Donation Requests (Latest 3)
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                recentRequests.map((req, index) => (
                                    <tr key={req._id}>
                                        <th>{index + 1}</th>
                                        <td>{req.bloodGroup}</td>
                                        <td>{req.requestDistrict}</td>
                                        <td>
                                            <span className={`badge 
                                                ${req.status === 'pending' && 'badge-warning'}
                                                ${req.status === 'approved' && 'badge-primary'}
                                                ${req.status === 'in-progress' && 'badge-info'}
                                                ${req.status === 'completed' && 'badge-success'}
                                                ${req.status === 'canceled' && 'badge-error'}
                                            `}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className='flex gap-2 flex-wrap'>
                                                {req.status === 'in-progress' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(req._id, 'completed')}
                                                            className='btn btn-sm btn-success text-white'
                                                            title='Mark as Done'
                                                        >
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(req._id, 'canceled')}
                                                            className='btn btn-sm btn-error text-white'
                                                            title='Cancel Request'
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(req._id)}
                                                            className='btn btn-sm btn-primary text-white'
                                                            title='Edit Request'
                                                        >
                                                            <MdEdit />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(req._id)}
                                                    className='btn btn-sm btn-ghost'
                                                    title='Delete Request'
                                                >
                                                    <FaTrashAlt className='text-red-500' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {
                        recentRequests.length === 0 && (
                            <p className="text-center text-gray-500 py-6">
                                You haven't created any donation requests yet.
                            </p>
                        )
                    }
                </div>

                {myRequests.length > 3 && (
                    <div className='mt-4 text-center'>
                        <a href='/dashboard/my-donation-requests' className='btn btn-outline'>
                            View All Requests ({myRequests.length})
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorDashboard;
