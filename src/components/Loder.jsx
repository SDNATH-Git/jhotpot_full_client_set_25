import React from "react";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";



const Loder = () => {
    return (

        <div
            className="flex items-center justify-center h-screen w-screen bg-center bg-cover bg-[#083257] bg-no-repeat relative"
        // style={{
        //     backgroundImage: "url('https://i.ibb.co.com/8nG7fgYZ/b-1.jpg')",

        // }}
        >

            <div className="relative w-50 h-50 flex items-center justify-center">
                {/* Static Border */}
                <div className="absolute inset-0 rounded-full border-8 border-[#F04C2B]"></div>

                {/* Rotating Border */}
                <motion.div
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{
                        borderTopColor: "#03373D",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Logo */}
                <div className="w-50 h-50 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <img src={Logo} alt="Logo" className="w-50 h-50 object-contain p-3" />
                </div>
            </div>
        </div>
    );
};

export default Loder;

