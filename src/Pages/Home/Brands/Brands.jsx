import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AmazonVector from '../../../assets/brands/amazon_vector.png';
import Amazon from '../../../assets/brands/amazon.png';
import Casio from '../../../assets/brands/casio.png';
import Monster from '../../../assets/brands/moonstar.png';
import Randstad from '../../../assets/brands/randstad.png';
import Star from '../../../assets/brands/star.png';
import StartPeople from '../../../assets/brands/start_people.png';


const brandsLogo = [AmazonVector, Amazon, Casio, Monster, Randstad, Star, StartPeople];

const Brands = () => {
    return (
        <div className='my-20'>
            <Swiper
                slidesPerView={4}
                centeredSlides={true}
                spaceBetween={30}
                grabCursor={true}
                modules={[Autoplay]}
                autoplay={{
                    delay: 500,
                    disableOnInteraction: false,
                }}
                className="mySwiper"
            >
                {
                    brandsLogo.map((logo, index) => (
                        <SwiperSlide key={index}><img src={logo} alt="" /></SwiperSlide>
                    ))
                }


            </Swiper>
        </div>
    );
};

export default Brands;