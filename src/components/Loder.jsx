
import React from "react";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_BG_COLOR = '#03373D'; // গাঢ় নীল (Background)
const ACCENT_COLOR_1 = '#F04C2B'; // লাল/কমলা (Static Ring)
const ACCENT_COLOR_2 = '#03373D'; // গাঢ় ছায়া (Rotating Ring)

const Loader = () => { // কম্পোনেন্টের নাম "Loader" করা হলো
    // লোডারের আকার নিয়ন্ত্রণ করার জন্য কাস্টম সাইজ ব্যবহার করা হলো
    const loaderSizeClasses = "w-32 h-32 md:w-40 md:h-40";
    const logoSizeClasses = "w-24 h-24 md:w-32 md:h-32";

    return (
        // ব্যাকগ্রাউন্ডে পুরো স্ক্রিন জুড়ে গাঢ় নীল রঙ
        <div
            className="flex items-center justify-center h-screen w-screen bg-center bg-cover bg-no-repeat relative"
            style={{ backgroundColor: PRIMARY_BG_COLOR }}
        >

            {/* লোডার কন্টেইনার (স্পিনার ও লোগো) */}
            <div className={`relative flex items-center justify-center ${loaderSizeClasses}`}>

                {/* Static Ring (Base/Bottom Layer) */}
                <div
                    className={`absolute inset-0 rounded-full border-8 border-opacity-30`} // Opacity কমিয়ে ফেইড লুক দেওয়া হলো
                    style={{ borderColor: ACCENT_COLOR_1 }}
                />

                {/* Rotating Ring (Top Layer with Animation) */}
                <motion.div
                    className={`absolute inset-0 rounded-full border-8 border-transparent`}
                    style={{
                        borderTopColor: ACCENT_COLOR_2, // গাঢ় রঙ দিয়ে মোশন হাইলাইট করা হলো
                        borderLeftColor: ACCENT_COLOR_2,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5, // দ্রুত করা হলো
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Logo Container (Center) */}
                <div
                    className={`bg-white rounded-full flex items-center justify-center shadow-2xl p-2 z-10 ${logoSizeClasses}`}
                >
                    {/* লোগো ইমেজ */}
                    <img
                        src={Logo}
                        alt="Jhotpot Logo"
                        className="object-contain"
                    // লোগো যাতে পুরোপুরি ফিট হয় তার জন্য কোনো নির্দিষ্ট w/h ক্লাস না দিয়ে padding/object-contain ব্যবহার করা হলো
                    />
                </div>
            </div>

            {/* Loading Text (ঐচ্ছিক: লোডারের নিচে টেক্সট) */}
            <div className="absolute mt-16  translate-y-1/2">
                <p className="text-xl md:text-2xl font-semibold mt-10 text-white">
                    Jhotpot is preparing your delivery route...
                </p>
            </div>
        </div>
    );
};

export default Loader;