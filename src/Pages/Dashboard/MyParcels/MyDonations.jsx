import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { MdEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const MyDonations = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const itemsPerPage = 5;

    const { data: donations = [], refetch } = useQuery({
        queryKey: ['my-donations', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/fundings?email=${user.email}`);
            return res.data;
        }
    });

    // Filter donations
    const filteredDonations = filterStatus
        ? donations.filter(d => d.status === filterStatus)
        : donations;

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDonations = filteredDonations.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

    const handleDonationDelete = id => {
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
                axiosSecure.delete(`/fundings/${id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your donation has been deleted.",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false
                            });
                        }
                    });
            }
        });
    };

    const handleViewDonation = (donation) => {
        setSelectedDonation(donation);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditClick = (donation) => {
        setEditData({ ...donation });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!editData.amount || !editData.purpose) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all required fields'
            });
            return;
        }

        axiosSecure.patch(`/fundings/${editData._id}`, {
            amount: editData.amount,
            purpose: editData.purpose,
            message: editData.message
        })
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    setShowModal(false);
                    setIsEditing(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated',
                        text: 'Your donation has been updated',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update donation'
                });
            });
    };

    return (
        <div className='p-6 rounded-2xl bg-base-100 shadow'>
            <div className='mb-6'>
                <h2 className='text-3xl font-bold mb-4'>My Donations : {donations.length}</h2>

                {/* Filter & Actions */}
                <div className='flex gap-4 flex-wrap mb-6'>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className='select select-bordered'
                    >
                        <option value=''>All Status</option>
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='rejected'>Rejected</option>
                    </select>
                </div>
            </div>

            {donations.length === 0 ? (
                <div className='text-center py-12'>
                    <p className='text-gray-600 text-lg mb-4'>You haven't made any donations yet.</p>
                    <a href='/fundings' className='btn btn-primary'>
                        Make a Donation
                    </a>
                </div>
            ) : filteredDonations.length === 0 ? (
                <p className='text-center text-gray-500 py-6'>No donations with selected status.</p>
            ) : (
                <>
                    <div className="overflow-x-auto mb-6">
                        <table className="table table-zebra">
                            <thead>
                                <tr className='bg-base-200'>
                                    <th>#</th>
                                    <th>Purpose</th>
                                    <th>Amount (TK)</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    paginatedDonations.map((donation, index) => (
                                        <tr key={donation._id}>
                                            <th>{startIndex + index + 1}</th>

                                            <td className='font-medium'>{donation.purpose}</td>

                                            <td>
                                                <span className='badge badge-lg'>{donation.amount}</span>
                                            </td>

                                            <td>
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge 
                                                        ${donation.status === 'approved' && 'badge-success'}
                                                        ${donation.status === 'rejected' && 'badge-error'}
                                                        ${donation.status === 'pending' && 'badge-warning'}
                                                    `}
                                                >
                                                    {donation.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() => handleViewDonation(donation)}
                                                        className="btn btn-sm btn-ghost"
                                                        title='View Details'
                                                    >
                                                        <FaMagnifyingGlass />
                                                    </button>

                                                    {donation.status === 'pending' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDonation(donation);
                                                                handleEditClick(donation);
                                                                setShowModal(true);
                                                            }}
                                                            className="btn btn-sm btn-ghost"
                                                            title='Edit Donation'
                                                        >
                                                            <MdEdit />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDonationDelete(donation._id)}
                                                        className="btn btn-sm btn-ghost text-error"
                                                        title='Delete Donation'
                                                    >
                                                        <FaRegTrashAlt />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='flex justify-center gap-2 mb-6'>
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

            {/* View/Edit Modal */}
            {showModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-md">
                        <h3 className="font-bold text-lg mb-4">
                            {isEditing ? 'Edit Donation' : 'Donation Details'}
                        </h3>

                        {isEditing ? (
                            <div className='space-y-4'>
                                <div>
                                    <label className='label'>Purpose *</label>
                                    <select
                                        value={editData?.purpose || ''}
                                        onChange={(e) => setEditData({...editData, purpose: e.target.value})}
                                        className='select select-bordered w-full'
                                    >
                                        <option value='Emergency Patient Support'>Emergency Patient Support</option>
                                        <option value='Blood Campaign'>Blood Campaign</option>
                                        <option value='Awareness Program'>Awareness Program</option>
                                        <option value='General Fund'>General Fund</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='label'>Amount (TK) *</label>
                                    <input
                                        type='number'
                                        value={editData?.amount || ''}
                                        onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                                        className='input input-bordered w-full'
                                        placeholder='Amount'
                                    />
                                </div>

                                <div>
                                    <label className='label'>Message</label>
                                    <textarea
                                        value={editData?.message || ''}
                                        onChange={(e) => setEditData({...editData, message: e.target.value})}
                                        className='textarea textarea-bordered w-full'
                                        placeholder='Optional message'
                                    ></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                <p><strong>Purpose:</strong> {selectedDonation?.purpose}</p>
                                <p><strong>Amount:</strong> {selectedDonation?.amount} TK</p>
                                <p><strong>Status:</strong> <span className='badge badge-lg'>{selectedDonation?.status}</span></p>
                                {selectedDonation?.message && (
                                    <p><strong>Message:</strong> {selectedDonation.message}</p>
                                )}
                                <p><strong>Date:</strong> {new Date(selectedDonation?.createdAt).toLocaleDateString()}</p>
                            </div>
                        )}

                        <div className="modal-action mt-6">
                            {isEditing && (
                                <button
                                    onClick={handleSaveEdit}
                                    className='btn btn-primary'
                                >
                                    Save Changes
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setIsEditing(false);
                                    setEditData(null);
                                }}
                                className="btn"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => {
                            setShowModal(false);
                            setIsEditing(false);
                            setEditData(null);
                        }}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default MyDonations;

