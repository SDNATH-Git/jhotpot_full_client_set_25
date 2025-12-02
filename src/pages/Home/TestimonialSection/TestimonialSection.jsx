"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
    {
        id: 1,
        name: "SD Nath",
        title: "Senior Product Designer",
        text: "A posture corrector works by providing support and gentle alignment  encouraging you to maintain proper posture throughout the day.",
        image: "https://i.ibb.co.com/s9dv9ZLj/shuvo.png",
    },
    {
        id: 2,
        name: "Nasir Uddin",
        title: "CEO",
        text: "This product completely changed my comfort at work. Highly recommended for anyone spending long hours sitting.",
        image: "https://i.ibb.co.com/spWw1PXN/B.jpg",
    },
    {
        id: 3,
        name: "Rasel Ahamed",
        title: "CTO",
        text: "The design is sleek, the quality is superb, and the results are amazing. Great job team!",
        image: "https://i.ibb.co.com/JF20rcLT/A.jpg",
    },
    {
        id: 4,
        name: "Shuvo Dev Nath",
        title: "Project Manager",
        text: "I love how smooth and efficient this experience was. Definitely worth every penny!",
        image: "https://i.ibb.co.com/Cp3wff9C/shuvo-2.png",
    },
    {
        id: 5,
        name: "Ajoy Dev",
        title: "Project Manager",
        text: "I love how smooth and efficient this experience was. Definitely worth every penny!",
        image: "https://i.ibb.co.com/W4FvpVcL/18.jpg",
    },
];

export default function CenteredTestimonialSlider() {
    const [index, setIndex] = useState(0);

    const next = () =>
        setIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () =>
        setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full  py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D5EA6] mb-3">
                What our customers are saying
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                Enhance posture, mobility, and well-being effortlessly with Posture Pro.
                Achieve proper alignment, reduce pain, and strengthen your body with ease!
            </p>

            <div className="relative flex justify-center items-center overflow-hidden">
                {/* Left Arrow */}
                {/* Left Arrow */}
                <button
                    onClick={prev}
                    className="absolute  left-2 md:left-10 z-20 bg-[#F04C2B] text-white p-3  rounded-full hover:bg-[#03373D] transition-all duration-300 shadow-lg"
                >
                    <FaArrowLeft />
                </button>


                {/* Testimonial Cards */}
                <div className="flex items-center justify-center w-full  h-[380px] relative">
                    <AnimatePresence initial={false}>
                        {testimonials.map((item, i) => {
                            let position = (i - index + testimonials.length) % testimonials.length;
                            let isCenter = position === 0;
                            let isLeft = position === testimonials.length - 1;
                            let isRight = position === 1;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                                    animate={{
                                        opacity: isCenter ? 1 : 0.4,
                                        scale: isCenter ? 1 : 0.9,
                                        x: isCenter ? 0 : isLeft ? -250 : isRight ? 250 : 0,
                                        zIndex: isCenter ? 10 : 0,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, x: isLeft ? -300 : 300 }}
                                    transition={{ duration: 0.7 }}
                                    className={`absolute bg-white shadow-2xl border border-gray-100 rounded-3xl p-8 max-w-md w-[85%] md:w-[340px] mx-auto ${isCenter ? "cursor-default" : "blur-[1px]"
                                        }`}
                                >
                                    <FaQuoteLeft className="text-2xl text-[#03373D] mb-4 mx-auto" />
                                    <p className="text-gray-700 mb-6 text-sm md:text-base">{item.text}</p>
                                    <h1 className="border-b-2 border-dashed mb-1"></h1>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
                                        {/* Profile Image */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-full border-4 border-[#F04C2B] object-cover"
                                        />

                                        {/* Name & Title */}
                                        <div className="flex flex-col justify-center">
                                            <h3 className="text-[#03373D] font-semibold text-lg">{item.name}</h3>
                                            <span className="text-gray-500 text-sm">{item.title}</span>
                                        </div>
                                    </div>



                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={next}
                    className="absolute right-2 md:right-10 bg-[#F04C2B] text-white p-3 rounded-full hover:bg-[#03373D] transition"
                >
                    <FaArrowRight />
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === index ? "bg-[#F04C2B] w-6" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
