import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import UseAuth from '../../Hooks/UseAuth';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

const Funding = () => {

    const { register, handleSubmit } = useForm();
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const handleFunding = data => {
        const fundingData = {
            donorName: user?.displayName,
            donorEmail: user?.email,
            amount: parseFloat(data.amount),
            purpose: data.purpose,
            message: data.message,
            status: 'pending',
            createdAt: new Date()
        };

        Swal.fire({
            title: "Confirm Donation?",
            text: `You are donating ${fundingData.amount} TK`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Proceed to Payment"
        }).then(async result => {
            if (result.isConfirmed) {
                const saveRes = await axiosSecure.post('/fundings', fundingData);

                if (saveRes.data.insertedId) {
                    const paymentRes = await axiosSecure.post(
                        '/funding-checkout-session',
                        {
                            amount: fundingData.amount,
                            donorEmail: fundingData.donorEmail,
                            purpose: fundingData.purpose,
                            fundingId: saveRes.data.insertedId
                        }
                    );
                    window.location.href = paymentRes.data.url;
                }
            }
        });
    };


    return (
        <div className='p-3 m-4 rounded-2xl bg-white'>
            <h2 className="text-4xl">Support Our Mission</h2>

            <form onSubmit={handleSubmit(handleFunding)} className='mt-12 p-4 text-black'>

                <div className=''>
                    <fieldset className="fieldset">
                        <h2 className='text-2xl font-semibold'>Donor Details</h2>

                        <label className="label">Name</label>
                        <input
                            type="text"
                            defaultValue={user?.displayName}
                            className="input"
                            readOnly
                        />

                        <label className="label">Email</label>
                        <input
                            type="email"
                            defaultValue={user?.email}
                            className="input"
                            readOnly
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <h2 className='text-2xl font-semibold'>Funding Details</h2>

                        <label className="label">Donation Amount (TK)</label>
                        <input
                            type="number"
                            className="input"
                            {...register('amount', { required: true })}
                            placeholder="Enter amount"
                        />

                        <label className="label mt-4">Purpose</label>
                        <select {...register('purpose')} className="select">
                            <option value="Emergency Patient Support">Emergency Patient Support</option>
                            <option value="Blood Campaign">Blood Campaign</option>
                            <option value="Awareness Program">Awareness Program</option>
                            <option value="General Fund">General Fund</option>
                        </select>

                        <label className="label mt-4">Message (Optional)</label>
                        <textarea
                            {...register('message')}
                            className="input"
                            placeholder="Optional message"
                        ></textarea>
                    </fieldset>

                </div>

                <input
                    type="submit"
                    value="Donate Now"
                    className='btn btn-primary mt-9 text-black'
                />

            </form>
        </div>
    );
};

export default Funding;