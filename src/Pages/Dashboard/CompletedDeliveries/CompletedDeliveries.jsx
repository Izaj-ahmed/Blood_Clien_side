import React from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import UseAuth from '../../../Hooks/UseAuth';
import { useQuery } from '@tanstack/react-query';

const CompletedDeliveries = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const { data: parcels = []} = useQuery({
        queryKey: ['parcels', user.email, 'driver_assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=parcel_deliverd`)

            return res.data;
        }
    })


    const calculatePayout = parcel => {
        if (parcel.senderDistrict === parcel.recieverDistrict) {
            return parcel.cost * 0.8
        }
        else {
            return parcel.cost * 0.6
        }
    }

    return (
        <div>
            <h2 className='text-4xl'>Completed deliveries : {parcels.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Pickup District</th>
                            <th>Cost</th>
                            <th>Payout</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, index) => <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <td>{parcel.parcelName}</td>

                                <td>{parcel.createdAt}</td>
                                <td>{parcel.senderDistrict}</td>
                                <td>$ {parcel.cost} </td>
                                <td>$ {calculatePayout(parcel)} </td>
                                <td>
                                    <button
                                        // onClick={() => openAssignRider(parcel)} 
                                        className="btn btn-primary text-black">Cash Out</button>
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries;