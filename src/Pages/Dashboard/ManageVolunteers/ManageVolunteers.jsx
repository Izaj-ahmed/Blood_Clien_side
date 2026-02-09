import React from 'react';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const ManageVolunteers = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: volunteers = [], refetch } = useQuery({
        queryKey: ['volunteers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/volunteers');
            return res.data;
        }
    });


    const handleApproval = (volunteer, status) => {
        axiosSecure.patch(`/admin/volunteers/${volunteer._id}`, { status })
            .then(() => {
                refetch();
                Swal.fire('Success', `Volunteer ${status}`, 'success');
            });
    };


    return (
        <div>
            <h2 className="text-3xl mb-6">Volunteer Applications</h2>

            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {volunteers.map((v, index) => (
                        <tr key={v._id}>
                            <th>{index + 1}</th>
                            <td>{v.name}</td>
                            <td>{v.email}</td>
                            <td>{v.availability}</td>
                            <td>{v.status}</td>
                            <td>
                                {v.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApproval(v, 'approved')}
                                            className="btn btn-success mr-2"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleApproval(v, 'rejected')}
                                            className="btn btn-error"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageVolunteers;
