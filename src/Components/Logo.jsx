import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to={'/'}>
            <div className='flex items-end'>
                <h3 className='text-3xl text-red-400 font-bold'>bloodDonation</h3>
            </div>
        </Link>
    );
};

export default Logo;