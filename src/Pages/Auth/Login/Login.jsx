import React from 'react';
import { useForm } from 'react-hook-form';
import UseAuth from '../../../Hooks/UseAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import Social from '../Social/Social';


const Login = () => {

    const {register, handleSubmit, formState: { errors }} = useForm();

    const {signInUser} = UseAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) =>{
        console.log(data);
        signInUser(data.email, data.password)
        .then(result=>{
            console.log(result.user);
            navigate(location?.state || '/')
            
        })
        .catch(error=>{
            console.log(error);
            
        })
    }

    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <h3 className='text-3xl text-center'>Welcome Back</h3>
            <form onSubmit={handleSubmit(handleLogin)} className="card-body">
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input {...register('email', {required: true})} type="email" className="input" placeholder="Email" />
                    {
                        errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
                    }
                    <label className="label">Password</label>
                    <input type="password" {...register('password', {
                        required: true, minLength: 6, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]).+$/
                    })} className="input" placeholder="Password" />
                    {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
                    {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>}
                    {errors.password?.type === 'pattern' && <p className='text-red-500'>Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>}
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
                <p>New to Zapshipt? <Link state={location.state} className='text-blue-600 hover:underline' to={'/register'}>register</Link></p>
            </form>
            <Social></Social>
        </div>
    );
};

export default Login;