import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/shared/Navbar/Navbar';
import Footer from '../pages/shared/Footer/Footer';
import ChatBoth from '../components/AIchatBoth/ChatBoth';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <ChatBoth></ChatBoth>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;