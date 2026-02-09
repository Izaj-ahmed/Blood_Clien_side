import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const VolunteerAssignedRequests = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();

    const { data: requests = [], isLoading,refetch } = useQuery({
        queryKey: ['volunteerRequests', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/volunteer/requests');
            return res.data;
        }
    });

    if (isLoading) return <p>Loading...</p>;

    if (!requests.length) {
        return (
            <p>
                {user.role !== 'volunteer'
                    ? 'You are not approved as a volunteer yet.'
                    : 'No requests assigned yet.'}
            </p>
        );
    }



    const handleStatusUpdate = (request, status) => {
        const statusInfo = {
            status,
            volunteerId: request.volunteerId,
            trackingId: request.trackingId
        };

        let message = `Request status updated to ${status.replace('_', ' ')}`;

        axiosSecure.patch(`/donation-requests/${request._id}/status`, statusInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
    };

    return (
        <div>
            <h2 className="text-4xl mb-6">
                Assigned Donation Requests: {requests.length}
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Patient / Request</th>
                            <th>Confirmation</th>
                            <th>Volunteer Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={request._id}>
                                <th>{index + 1}</th>

                                <td>
                                    {request.patientName}
                                    <br />
                                    <span className="text-sm opacity-70">
                                        Blood Group: {request.bloodGroup}
                                    </span>
                                </td>

                                <td>
                                    {request.status === 'volunteer_assigned' ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(request, 'volunteer_accepted')
                                                }
                                                className="btn btn-primary mr-2 text-black"
                                            >
                                                Accept
                                            </button>

                                            <button className="btn btn-warning text-black">
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span className="font-semibold text-green-600">
                                            Accepted
                                        </span>
                                    )}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate(request, 'donor_contacted')
                                        }
                                        className="btn btn-primary mx-1 text-black"
                                    >
                                        Donor Contacted
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleStatusUpdate(request, 'blood_collected')
                                        }
                                        className="btn btn-primary mx-1 text-black"
                                    >
                                        Blood Collected
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VolunteerAssignedRequests;
