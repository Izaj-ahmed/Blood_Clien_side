import React, { useEffect, useState } from 'react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

const Reviwes = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch("/reviews.json")
            .then(res => res.json())
            .then(data => setReviews(data));
    }, []);
    console.log(reviews);


    return (
        <div>
            <Swiper
                loop={true}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                coverflowEffect={{
                    rotate: 30,
                    stretch: '50%',
                    depth: 200,
                    modifier: 1,
                    scale: 0.75,
                    slideShadows: true,
                }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
            >
                {
                    reviews.map(review => <SwiperSlide>
                        <ReviewCard review={review}></ReviewCard>
                    </SwiperSlide>
                    )
                }
            </Swiper>
        </div>
    );
};

export default Reviwes;