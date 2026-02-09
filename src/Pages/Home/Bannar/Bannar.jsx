import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import bannerImg1 from '../../../assets/blood1.jpg';
import bannerImg2 from '../../../assets/blood2.jpg';
import bannerImg3 from '../../../assets/blood3.jpg';
import { RiSendPlaneFill } from 'react-icons/ri';


const Bannar = () => {
    return (
        <Carousel className='mt-5' autoPlay={true} infiniteLoop={true}>
            <div>
                <img src={bannerImg1} />

            </div>
            <div>
                <img src={bannerImg2} />

            </div>
            <div>
                <img src={bannerImg3} />

            </div>
        </Carousel>
    );
};

export default Bannar;