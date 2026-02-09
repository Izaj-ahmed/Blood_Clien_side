import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';

const Section1 = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('/work.json')
      .then(res => {
        setServices(res.data);
      })
      .catch(error => {
        console.error('Error fetching services data:', error);
      });
  }, []);

  return (
    <div className='mx-10 mb-5'>
      <h3 className='text-2xl font-bold mb-6'>How it Works</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {services.map(service => (
          <div key={service.id} className="h-[200px] rounded-2xl shadow-2xl p-3">
            <TbTruckDelivery size={32} />
            <h4 className='font-bold text-xl'>{service.heading}</h4>
            <p>{service.paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section1;
