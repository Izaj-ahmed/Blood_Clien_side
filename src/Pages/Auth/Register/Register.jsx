import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import UseAuth from '../../../Hooks/UseAuth';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router';
import Social from '../Social/Social';
import axios from 'axios';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const Register = () => {

    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = UseAuth();
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const location = useLocation();
    const navigate = useNavigate();

    const axiosSecure = UseAxiosSecure();
    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region)
    const regions = [...new Set(regionsDuplicate)];

    const registerRegion = useWatch({ name: 'registerRegion', control });

    const districtsByRegion = (region) => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return districts;
    }


    const handleRegister = (data) => {

        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const profileImage = data.image[0];

        registerUser(data.email, data.password)
            .then(() => {

                const formData = new FormData();
                formData.append('image', profileImage);

                const imageApiURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

                axios.post(imageApiURL, formData)
                    .then(res => {
                        const photoUrl = res.data.data.url;

                        // user info for database
                        const userInfo = {
                            email: data.email,
                            displayName: data.name,
                            photoUrl,
                            bloodGroup: data.bloodGroup,
                            district: data.recieverDistrict,
                            upazila: data.registerRegion,
                            role: 'donor',
                            status: 'active'
                        };

                        axiosSecure.post('/users', userInfo)
                            .then(() => {
                                updateUserProfile({
                                    displayName: data.name,
                                    photoUrl
                                }).then(() => {
                                    navigate(location?.state || '/');
                                });
                            });


                    });
            })
            .catch(error => {
                console.log(error);
            });
    };



    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleSubmit(handleRegister)} className="card-body">
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    <label className="label">Name</label>
                    <input type="text" {...register('name', { required: true })} className="input" placeholder="Name" />
                    <label className="label">Image</label>
                    <label>Blood Group</label>
                    <select {...register('bloodGroup', { required: true })} className="select">
                        <option value="">Select</option>
                        {bloodGroups.map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Reciever Region</legend>
                        <select {...register('registerRegion')} defaultValue="Pick a region" className="select">
                            <option disabled={true}>Pick a region</option>
                            {
                                regions.map((r, i) => <option key={i} value={r}>  {r}</option>)
                            }
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Reciever District</legend>
                        <select {...register('recieverDistrict')} defaultValue="Pick a district" className="select">
                            <option disabled={true}>Pick a district</option>
                            {
                                districtsByRegion(registerRegion).map((d, i) => <option key={i} value={d}>  {d}</option>)
                            }
                        </select>
                    </fieldset>
                    <input type="file" {...register('image', { required: true })} className="file-input" placeholder="Your Photo" />
                    {errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', {
                        required: true, minLength: 6, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]).+$/
                    })} className="input" placeholder="Password" />
                    <label className="label">Confirm Password</label>
                    <input
                        type="password"
                        {...register('confirmPassword', { required: true })}
                        className="input"
                        placeholder="Confirm Password"
                    />
                    {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
                    {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>}
                    {errors.password?.type === 'pattern' && <p className='text-red-500'>Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>}
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p>Already have an account? <Link state={location.state} className='text-blue-600 hover:underline' to={'/login'}>Login</Link></p>
            </form>
            <Social></Social>
        </div>
    );
};

export default Register;