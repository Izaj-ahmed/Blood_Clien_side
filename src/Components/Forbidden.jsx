import React from 'react';
import { Link } from 'react-router';

const Forbidden = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-xl">

                {/* 404 Illustration */}
                <div className="relative flex justify-center items-center mb-8">
                    <span className="text-[140px] md:text-[180px] font-extrabold text-purple-500">
                        4
                    </span>

                    <div className="relative">
                        <span className="text-[140px] md:text-[180px] font-extrabold text-purple-400">
                            0
                        </span>

                        {/* Magnifier */}
                        <div className="absolute right-[-30px] bottom-[10px] rotate-12">
                            <div className="w-20 h-20 rounded-full border-8 border-gray-300 flex items-center justify-center">
                                <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                            </div>
                            <div className="w-6 h-16 bg-gray-700 mx-auto rounded-b-full"></div>
                        </div>
                    </div>

                    <span className="text-[140px] md:text-[180px] font-extrabold text-purple-500">
                        4
                    </span>
                </div>

                {/* Text */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    Whoops!
                </h1>

                <p className="text-gray-600 mb-6">
                    Something went wrong. The page you’re looking for isn’t found,
                    we suggest you go back to home.
                </p>

                {/* Button */}
                <Link
                    to="/"
                    className="inline-block bg-purple-600 hover:bg-purple-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
                >
                    Back to home page
                </Link>
            </div>
        </div>
    );
};

export default Forbidden;