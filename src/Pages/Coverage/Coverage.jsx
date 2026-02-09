import React, { useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const position = [23.6850, 90.3563]
    const serviceCenter = useLoaderData();
    // console.log(serviceCenter);
    const mapRef = useRef();

    const handleSearch = e => {
        e.preventDefault();
        const location = e.target.location.value;
        const district = serviceCenter.find(c=> c.district.toLowerCase().includes(location.toLowerCase()));
        if (district){
            const coord = [district.latitude, district.longitude];
            console.log(district,coord);
            mapRef.current.flyTo(coord,15);
        }
    }


    return (

        <div className='shadow-md my-20 rounded-xl p-10'>

            <h3 className='text-3xl font-bold '>We are available in 64 district</h3>
            <form onSubmit={handleSearch}>
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" name='location' className="grow" placeholder="Search" />
                </label>
            </form>
            <div>

            </div>
            <div className='border w-full h-[800px]'>
                <MapContainer ref={mapRef} center={position} zoom={8} scrollWheelZoom={false} className='h-[800px]'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        serviceCenter.map((center, index) => <Marker key={index} position={[center.latitude, center.longitude]}>
                            <Popup>
                                <strong>{center.district}</strong> <br /> Service Area: {center.covered_area.join(', ')}.
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;