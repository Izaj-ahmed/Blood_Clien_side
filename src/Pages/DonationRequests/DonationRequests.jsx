import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import UseAuth from '../../Hooks/UseAuth';

const DonationRequests = () => {

    const { register, handleSubmit, control } = useForm();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const { user } = UseAuth();

    const serviceCenters = useLoaderData();
    const regions = [...new Set(serviceCenters.map(c => c.region))];

    const requestRegion = useWatch({ name: 'requestRegion', control });

    const districtsByRegion = (region) => {
        return serviceCenters
            .filter(c => c.region === region)
            .map(d => d.district);
    };

    const handleDonationRequest = data => {
        data.requesterEmail = user?.email;
        data.status = 'pending';
        data.createdAt = new Date();

        axiosSecure.post('/donation-requests', data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Donation Request Created',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    navigate('/dashboard/payment-history');

                }
            });
    };

    return (
        <div className='p-3 m-4 rounded-2xl bg-white'>
            <h2 className="text-5xl font-bold">Blood Donation Request</h2>

            <form onSubmit={handleSubmit(handleDonationRequest)} className='mt-12 p-4 text-black'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mt-5'>

                    {/* Requester & Patient Details */}
                    <fieldset className="fieldset">
                        <h2 className='text-2xl font-semibold'>Request & Patient Details</h2>

                        <label className="label">Requester Name</label>
                        <input
                            type="text"
                            defaultValue={user?.displayName}
                            className="input w-full"
                            {...register('requesterName', { required: true })}
                        />

                        <label className="label">Requester Email</label>
                        <input
                            type="email"
                            defaultValue={user?.email}
                            readOnly
                            className="input w-full"
                        />

                        <label className="label mt-4">Patient Name</label>
                        <input
                            type="text"
                            className="input w-full"
                            {...register('patientName', { required: true })}
                            placeholder="Patient Name"
                        />

                        <label className="label mt-4">Patient Age</label>
                        <input
                            type="number"
                            className="input w-full"
                            {...register('patientAge', { required: true })}
                            placeholder="Age"
                        />

                        <label className="label mt-4">Blood Group Needed</label>
                        <select {...register('bloodGroup', { required: true })} className="select">
                            <option value="">Select Blood Group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>

                        <label className="label mt-4">Units Needed</label>
                        <input
                            type="number"
                            className="input w-full"
                            {...register('units', { required: true })}
                            placeholder="e.g. 2"
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <h2 className='text-2xl font-semibold'>Hospital & Location</h2>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Region</legend>
                            <select {...register('requestRegion', { required: true })} className="select">
                                <option value="">Pick a region</option>
                                {regions.map((r, i) => (
                                    <option key={i} value={r}>{r}</option>
                                ))}
                            </select>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">District</legend>
                            <select {...register('requestDistrict', { required: true })} className="select">
                                <option value="">Pick a district</option>
                                {districtsByRegion(requestRegion).map((d, i) => (
                                    <option key={i} value={d}>{d}</option>
                                ))}
                            </select>
                        </fieldset>

                        <label className="label mt-4">Hospital Name</label>
                        <input
                            type="text"
                            className="input w-full"
                            {...register('hospitalName', { required: true })}
                            placeholder="Hospital Name"
                        />

                        <label className="label mt-4">Hospital Address</label>
                        <input
                            type="text"
                            className="input w-full"
                            {...register('hospitalAddress', { required: true })}
                            placeholder="Hospital Address"
                        />

                        <label className="label mt-4">Required Date</label>
                        <input
                            type="date"
                            className="input w-full"
                            {...register('requiredDate', { required: true })}
                        />

                        <label className="label mt-4">Additional Notes</label>
                        <textarea
                            {...register('notes')}
                            className="input w-full"
                            placeholder="Any special instructions"
                        />
                    </fieldset>

                </div>

                <input
                    type="submit"
                    value="Submit Donation Request"
                    className='btn btn-primary mt-9 text-black'
                />
            </form>
        </div>
    );
};


export default DonationRequests;

