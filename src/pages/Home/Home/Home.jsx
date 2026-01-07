
import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientLogosMarquee from '../ClientLogosMarquee/ClientLogosMarquee';
import Benefits from '../Benefits/Benefits';
import BeMerchant from '../BeMerchant/BeMerchant';
import TestimonialSection from '../TestimonialSection/TestimonialSection';
import TrustStats from '../TrustStats';


const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Home = () => {
    return (

        // <div className='px-5 md:px-10  background: linear-gradient(135deg, #F04C2B33, #0D5EA633, #03373D33);'>
        <div className='px-5 md:px-10  ;'>
            {/* 🔶 Left Orange Glow */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-40 bg-gradient-to-r from-[#F04C2B]/15 to-transparent blur-2xl" />

            {/* 🔶 Right Orange Glow */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-40 bg-gradient-to-l from-[#F04C2B]/15 to-transparent blur-2xl" />



            {/* Banner Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <Banner />
            </motion.div>

            {/* TrustStats  */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <TrustStats></TrustStats>
            </motion.div>

            {/* Services Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <Services />
            </motion.div>

            {/* Client Logos Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <ClientLogosMarquee />
            </motion.div>

            {/* Benefits Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <Benefits />
            </motion.div>

            {/* Be a Merchant Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <BeMerchant />
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <TestimonialSection />
            </motion.div>
        </div>

    );
};

export default Home;


