import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const PaymentSuccess = () => {
     
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({})
    const sessionId = searchParams.get('session_id');
    const axiosSecure = UseAxiosSecure();
    console.log(sessionId);
    
    useEffect(()=>{
        if(sessionId){
            axiosSecure.patch(`/funding-payment-success?session_id=${sessionId}`)
            .then(res=>{
                console.log(res.data);
                setPaymentInfo({
                    transectionId : res.data.transectionId,
                    trackingId: res.data.trackingId
                })
            })
        }
    },[sessionId, axiosSecure])


    return (
        <div>
            <h2 className="text-3xl font-bold">Payment successfull</h2>
            <p>Your transection id : {paymentInfo.transectionId}</p>
            <p>Your Parcel tracking id : {paymentInfo.trackingId}</p>
        </div>
    );
};

export default PaymentSuccess;