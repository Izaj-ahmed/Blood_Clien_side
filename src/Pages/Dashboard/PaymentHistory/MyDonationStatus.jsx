import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const MyDonationStatus = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: requests = []} = useQuery({
        queryKey: ['my-donation-requests', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/my-donation-requests');
            return res.data;
        }
    });


    return (
        <div className='p-3 m-4 rounded-2xl bg-[#efefef]'>
            <h2 className='text-3xl font-bold'>
                My Blood Donation Requests : {requests.length}
            </h2>

            <div className="overflow-x-auto mt-5">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Patient</th>
                            <th>Blood Group</th>
                            <th>Units</th>
                            <th>Hospital</th>
                            <th>District</th>
                            <th>Required Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            requests.map((req, index) => (
                                <tr key={req._id}>
                                    <th>{index + 1}</th>
                                    <td>{req.patientName}</td>
                                    <td>{req.bloodGroup}</td>
                                    <td>{req.units}</td>
                                    <td>{req.hospitalName}</td>
                                    <td>{req.requestDistrict}</td>
                                    <td>{req.requiredDate}</td>
                                    <td>
                                        <span className={`font-semibold
                                            ${req.status === 'approved' && 'text-green-600'}
                                            ${req.status === 'pending' && 'text-yellow-500'}
                                            ${req.status === 'rejected' && 'text-red-500'}
                                            ${req.status === 'completed' && 'text-blue-600'}
                                        `}>
                                            {req.status}
                                        </span>
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

export default MyDonationStatus;
