// import React from 'react';
// import BangladeshMap from './BangladeshMap';
// import { useLoaderData } from 'react-router';


// const Coverage = () => {
//     const serviceCenters = useLoaderData();

//     return (
//         <div className="max-w-4xl mx-auto px-4 py-10">
//             <h1 className="text-3xl font-bold text-center mb-6">We are available in 64 districts</h1>

//             {/* Later you can add your search box here */}
//             {/* <SearchDistrictBox /> */}

//             <BangladeshMap serviceCenters={serviceCenters} />
//         </div>
//     );
// };

// export default Coverage;





import React, { useState } from "react";
import { useLoaderData } from "react-router";
import BangladeshMap from "./BangladeshMap";

const Coverage = () => {
    const serviceCenters = useLoaderData();
    const [searchText, setSearchText] = useState(""); // controlled from here

    return (
        <div className="mx-5 md:mx-10 my-10 rounded-3xl shadow-2xl bg-white">
            <section className=" px-5  py-10 flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl font-bold text-center mt-4">
                    We are available in 64 districts
                </h1>


                {/* 🗺️ Pass searchText as prop */}
                <BangladeshMap
                    serviceCenters={serviceCenters}
                    searchText={searchText}
                />
            </section>
        </div>
    );
};

export default Coverage;
