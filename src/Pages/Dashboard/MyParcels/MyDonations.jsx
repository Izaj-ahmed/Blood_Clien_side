import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { MdEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const MyDonations = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: donations = [], refetch } = useQuery({
        queryKey: ['my-donations', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/fundings?email=${user.email}`);
            return res.data;
        }
    });

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
                                text: "Your donation request has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    return (
        <div className='p-3 m-4 rounded-2xl bg-[#efefef]'>
            <h2>My Donations : {donations.length}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Purpose</th>
                            <th>Amount (TK)</th>
                            <th>Status</th>
                            <th>Message</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            donations.map((donation, index) => (
                                <tr key={donation._id}>
                                    <th>{index + 1}</th>

                                    <td>{donation.purpose}</td>

                                    <td>{donation.amount}</td>

                                    <td>
                                        <span
                                            className={`font-semibold ${
                                                donation.status === 'approved'
                                                    ? 'text-green-500'
                                                    : donation.status === 'rejected'
                                                    ? 'text-red-500'
                                                    : 'text-yellow-500'
                                            }`}
                                        >
                                            {donation.status}
                                        </span>
                                    </td>

                                    <td>
                                        {donation.message || '—'}
                                    </td>

                                    <td>
                                        <button className="btn btn-square hover:bg-primary">
                                            <FaMagnifyingGlass />
                                        </button>

                                        <button className="btn btn-square hover:bg-primary mx-3">
                                            <MdEdit />
                                        </button>

                                        <button
                                            onClick={() => handleDonationDelete(donation._id)}
                                            className="btn btn-square hover:bg-red-500"
                                        >
                                            <FaRegTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyDonations;

