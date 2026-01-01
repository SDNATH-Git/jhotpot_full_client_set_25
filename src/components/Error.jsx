import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import error from "../assets/error.json";

const Error = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center text-center">
            <div className="max-w-md w-full">
                <Lottie animationData={error} loop={true} className="w-full mx-auto" />

                <h1 className="text-4xl font-bold text-red-500 ">Route Not Found</h1>
                <p className="text-gray-500 mt-4">
                    It looks like the page or **tracking ID** you were looking for doesn't exist in our **Jhotpot** system.
                    The parcel might have been delivered, or the link is broken.
                </p>

                <Link
                    to="/"
                    className="inline-block mt-3 bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition duration-300"
                >
                    Back to Home
                </Link>

                <p className="text-sm text-gray-500 mt-4 mb-4">
                    If this keeps happening, contact our support or try refreshing.
                </p>
            </div>
        </div>
    );
};

export default Error;