// import React from 'react';
// import location from '../../../assets/location-merchant.png'

// const BeMerchant = () => {
//     return (
//         <div data-aos="zoom-in-up" className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] rounded-4xl p-20">
//             <div className="hero-content flex-col lg:flex-row-reverse">
//                 <img
//                     src={location}
//                     className="max-w-sm rounded-lg shadow-2xl"
//                 />
//                 <div>
//                     <h1 className="text-5xl font-bold">Merchant and Customer Satisfaction is Our First Priority</h1>
//                     <p className="py-6">
//                         We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
//                     </p>
//                     <button className="btn btn-primary text-black rounded-full">Become A Merchant</button>
//                     <button className="btn btn-primary text-primary btn-outline ms-4 rounded-full">Become A Merchant</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BeMerchant;




import React from 'react';
import location from '../../../assets/location-merchant.png'

const BeMerchant = () => {
    return (
        <div className='my-8'>
            <div data-aos="zoom-in-up" className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] rounded-4xl p-5">
                <div className="hero-content flex-col  lg:flex-row-reverse">
                    <img
                        src={location}
                        className=" rounded-lg shadow-2xl"
                    />
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-white" >Merchant and Customer Satisfaction is Our First Priority</h1>
                        <p className="py-4 text-white">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>
                        <div className='flex'>
                            <button className="btn  bg-[#F04C2B] text-white rounded-xl">Become A Merchant</button>
                            <button className="btn  bg-[#03373D] border-2 border-[#F04C2B] text-white btn-outline ms-4 rounded-xl">Earn with Courier</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BeMerchant;