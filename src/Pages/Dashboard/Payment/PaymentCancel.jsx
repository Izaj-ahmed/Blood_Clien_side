import React from 'react';
import { Link } from 'react-router';

const PaymentCancel = () => {
    return (
        <div>
            <h2>Payment is cancelled</h2>
            <Link className='btn btn-primary text-black' to={'/dashboard/my-parcels'}><button>Try Again</button></Link>
            
        </div>
    );
};

export default PaymentCancel;