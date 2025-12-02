import React from 'react';
import logo from '../../../assets/logo.png'
import { Link } from 'react-router';

const ProFastLogo = () => {
    return (
        <Link to="/">
            <div className='flex items-start border-b-4 border-[#F04C2B] mb-4 '>
                <img className='mb-2 w-[200px]' src={logo} alt="" />
                {/* <p className='text-3xl -ml-2 font-extrabold'>ProFast</p> */}
            </div>
        </Link>
    );
};

export default ProFastLogo;