

import React from 'react';
import { Outlet } from 'react-router';
import authImg from '../assets/authImage.png'

const AuthLayout = () => {
    return (
        <div className="">

            <div className='flex-1'>
                <Outlet></Outlet>
            </div>


        </div>
    );
};

export default AuthLayout;