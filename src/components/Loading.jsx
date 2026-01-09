// components/Loading.jsx
// import { MdDeliveryDining } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-base-100 text-center px-4">

            {/* Animated truck icon */}
            <div className="text-6xl mb-4 animate-truck">
                <MdDeliveryDining style={{ color: "#F04C2B" }} aria-label="Loading icon" />
            </div>


            {/* Main message */}
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Please wait a moment — fetching your parcel details...
            </h2>

            {/* Sub message */}
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-2">
                We're preparing your delivery information. This won’t take long.
            </p>

            {/* DaisyUI spinner for extra visual feedback */}
            {/* <span className="loading loading-spinner loading-lg text-[#F04C2B] mt-6"></span> */}
            <div className="flex justify-center items-center  mt-6">
                <FaSpinner className="text-4xl animate-spin text-[#0D5EA6]" />
                <p className="text-lg text-gray-600 ml-3">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
