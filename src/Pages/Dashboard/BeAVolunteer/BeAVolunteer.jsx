import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import UseAuth from '../../../Hooks/UseAuth';

const BeAVolunteer = () => {
    const { register, handleSubmit } = useForm();
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: user.displayName,
                email: user.email,
                availability: data.availability,
                motivation: data.motivation,
            };

            const res = await axiosSecure.post('/volunteer-apply', payload);

            if (res.data.insertedId) {
                Swal.fire('Success', 'Volunteer application submitted', 'success');
            }
        } catch (error) {
            Swal.fire(
                'Error',
                error.response?.data?.message || 'Something went wrong',
                'error'
            );
        }
    };


    return (
        <div className="p-6 bg-white rounded-xl">
            <h2 className="text-3xl font-bold mb-6">Apply as Volunteer</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input className="input w-full" value={user.displayName} readOnly />
                <input className="input w-full" value={user.email} readOnly />

                <select {...register('availability')} className="select w-full">
                    <option value="weekends">Weekends</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="anytime">Anytime</option>
                </select>

                <textarea
                    {...register('motivation', { required: true })}
                    className="textarea w-full"
                    placeholder="Why do you want to volunteer?"
                />

                <button className="btn btn-primary w-full">
                    Apply
                </button>
            </form>
        </div>
    );
};

export default BeAVolunteer;
