import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
    const { userName,review:testimonial,user_photoURL} = review;
    return (
        <div className="max-w-xl rounded-2xl bg-white p-8 shadow-lg border border-gray-100">

            <FaQuoteLeft className="text-teal-200 text-5xl mb-4" />
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {testimonial}
            </p>

            {/* Divider */}
            <div className="border-t border-dashed border-teal-700 mb-6"></div>

            {/* Author */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <img  className="w-14 h-14 rounded-full  flex-shrink-0" src={user_photoURL} alt="" />

                {/* Name & Role */}
                <div>
                    <h4 className="text-xl font-bold text-teal-900">
                        {userName}
                    </h4>
                    <p className="text-gray-500 text-sm">
                        Senior Product Designer
                    </p>
                </div>
            </div>

        </div>
    );
};

export default ReviewCard;