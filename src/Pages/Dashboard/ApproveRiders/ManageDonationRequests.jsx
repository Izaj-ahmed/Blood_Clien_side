import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FaCheck, FaTrashAlt, FaEye } from 'react-icons/fa';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const ManageDonationRequests = () => {
    const axiosSecure = UseAxiosSecure();

    // Fetch donation requests
    const { refetch, data: requests = [] } = useQuery({
        queryKey: ['donationRequests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/donation-requests');
            return res.data;
        }
    });

    const updateRequestStatus = (request, status) => {
        axiosSecure
            .patch(`/donation-requests/${request._id}/status`, { status })
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Request ${status}`,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
    };


    const handleApprove = request => updateRequestStatus(request, 'approved');
    const handleReject = request => updateRequestStatus(request, 'rejected');
    const handleComplete = request => updateRequestStatus(request, 'completed');

    const handleDeleteRequest = request => {
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
                axiosSecure.delete(`/donation-requests/${request._id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Donation request has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    return (
        <div className='p-3 m-4 rounded-2xl bg-[#efefef]'>
            <h2>Manage Donation Requests : {requests.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Requester Name</th>
                            <th>Email</th>
                            <th>Blood Group</th>
                            <th>Region / District</th>
                            <th>Status</th>
                            <th>Urgency</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={request._id}>
                                <th>{index + 1}</th>
                                <td>{request.name}</td>
                                <td>{request.email}</td>
                                <td>{request.bloodGroup}</td>
                                <td>{request.region} / {request.district}</td>
                                <td>
                                    <p className={`${request.status === 'approved' ? 'text-green-800' : request.status === 'completed' ? 'text-blue-800' : 'text-red-500'}`}>
                                        {request.status}
                                    </p>
                                </td>
                                <td>
                                    <p className={`${request.urgency === 'urgent' ? 'text-red-600 font-bold' : 'text-black'}`}>
                                        {request.urgency || 'normal'}
                                    </p>
                                </td>
                                <td>
                                    <button className='btn mx-1'><FaEye /></button>
                                    <button onClick={() => handleApprove(request)} className='btn mx-1'><FaCheck /></button>
                                    <button onClick={() => handleReject(request)} className='btn mx-1'><IoCloseCircleOutline /></button>
                                    <button onClick={() => handleComplete(request)} className='btn mx-1'>Complete</button>
                                    <button onClick={() => handleDeleteRequest(request)} className='btn mx-1'><FaTrashAlt /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageDonationRequests;
