import { FaBox, FaMotorcycle, FaCity, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const stats = [
    {
        id: 1,
        title: "Parcels Delivered",
        value: "10,000+",
        icon: <FaBox />,
        color: "#F04C2B",
    },
    {
        id: 2,
        title: "Active Riders",
        value: "500+",
        icon: <FaMotorcycle />,
        color: "#0D5EA6",
    },
    {
        id: 3,
        title: "Cities Covered",
        value: "20+",
        icon: <FaCity />,
        color: "#03373D",
    },
    {
        id: 4,
        title: "Customer Rating",
        value: "4.9★",
        icon: <FaStar />,
        color: "#F04C2B",
    },
];

export default function TrustStats() {
    return (
        <section className="relative py-16 px-4 md:px-8 bg-gradient-to-br from-[#03373D] via-[#0D5EA6]/20 to-[#03373D]">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Trusted by Thousands
                </h2>
                <p className="mt-3 text-gray-200 max-w-xl mx-auto">
                    Jhotpot is powering fast and reliable parcel delivery across cities
                </p>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.id}
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center shadow-lg"
                    >
                        {/* Icon */}
                        <div
                            className="w-14 h-14 mx-auto flex items-center justify-center rounded-full mb-4"
                            style={{
                                backgroundColor: `${stat.color}22`,
                                color: stat.color,
                            }}
                        >
                            <span className="text-2xl">{stat.icon}</span>
                        </div>

                        {/* Value */}
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                            {stat.value}
                        </h3>

                        {/* Title */}
                        <p className="mt-2 text-sm md:text-base text-gray-200">
                            {stat.title}
                        </p>

                        {/* Accent Line */}
                        <span
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full"
                            style={{ backgroundColor: stat.color }}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
