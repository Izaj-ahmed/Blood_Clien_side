import React from 'react';
import Logo from '../../Components/Logo';
import { Link, NavLink } from 'react-router';
import UseAuth from '../../Hooks/UseAuth';

const NavBar = () => {

    const { user, logOut } = UseAuth();

    const handleLogOut = () => {
        logOut()
            .then()
            .catch(error => {
                console.log(error);

            })
    }
    const links = <>
        <li><NavLink to={'/'}>Home</NavLink></li>
        <li><NavLink to={'/donation-requests'}>Donation Requests</NavLink></li>
        <li><NavLink to={'/fundings'}>Funding</NavLink></li>
        {/* <li><NavLink to={'/coverage'}> Coverage</NavLink></li> */}

        {
            user && <>
                
                <li><NavLink to={'/dashboard/be-volunteer'}>Be a Volunteer</NavLink></li>

            </>
        }

    </>

    return (
        <div>

            <div className="navbar rounded-2xl bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {links}
                        </ul>
                    </div>
                    <span className="text-xl"> <Logo></Logo></span>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>
                <div className="navbar-end gap-5 mr-5">
                    {
                        !user &&
                        <Link className='btn' to={'/login'}>Login</Link>
                    }
                    <Link className='btn btn-primary text-black' to={'/rider'}>Create Request</Link>
                </div>

                {
                    user && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-12 rounded-full">
                                    <img src={user.photoURL || "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"} alt="Profile" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><button onClick={handleLogOut}>Logout</button></li>
                            </ul>
                        </div>
                    ) 
                }
            </div>

        </div>
    );
};

export default NavBar;