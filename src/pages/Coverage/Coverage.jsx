
import React, { useState } from "react";
import { useLoaderData } from "react-router";
import BangladeshMap from "./BangladeshMap";
import { FaSearch, FaMapMarkerAlt, FaGlobe, FaTimes } from "react-icons/fa";

const PRIMARY_BRAND_COLOR = '#0D5EA6';
const DARK_TEXT_COLOR = '#03373D';
const SECONDARY_BRAND_COLOR = '#F04C2B';

const Coverage = () => {
    const serviceCenters = useLoaderData();
    const [searchText, setSearchText] = useState(""); // controlled from here

    return (
        <section className=" background: linear-gradient(135deg, #F04C2B33, #0D5EA633, #03373D33) py-10 min-h-screen">
            <div className="mx-4 md:mx-8 lg:mx-20 bg-white rounded-3xl shadow-2xl border-t-8" style={{ borderTopColor: PRIMARY_BRAND_COLOR }}>
                <section className="p-4 md:p-4 flex flex-col items-center">

                    {/* Header */}
                    <div className="text-center ">
                        <h1 className="text-xl md:text-4xl font-extrabold flex items-center justify-center" style={{ color: DARK_TEXT_COLOR }}>
                            <FaGlobe className="mr-3 text-4xl" style={{ color: SECONDARY_BRAND_COLOR }} />
                            National Service Coverage
                        </h1>
                        <p className="text-lg md:text-xl font-medium mt-2 text-gray-600">
                            We are available in 64 districts and expanding.
                        </p>
                    </div>


                    {/* 🗺️ Pass searchText as prop */}
                    <BangladeshMap
                        serviceCenters={serviceCenters}
                        searchText={searchText}
                    />
                </section>
            </div>

        </section>

    );
};

export default Coverage;





