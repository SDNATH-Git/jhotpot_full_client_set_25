import { FaBox, FaMotorcycle, FaCity, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
    {
        id: 1,
        title: "Parcels Delivered",
        value: 100,
        suffix: "+",
        icon: <FaBox />,
        color: "#F04C2B",
    },
    {
        id: 2,
        title: "Active Riders",
        value: 50,
        suffix: "+",
        icon: <FaMotorcycle />,
        color: "#0D5EA6",
    },
    {
        id: 3,
        title: "Cities Covered",
        value: 10,
        suffix: "+",
        icon: <FaCity />,
        color: "#03373D",
    },
    {
        id: 4,
        title: "Customer Rating",
        value: 4.9,
        suffix: "★",
        decimals: 1,
        icon: <FaStar />,
        color: "#F04C2B",
    },
];

export default function TrustStats() {
    return (
        <section className="relative overflow-hidden   py-16 sm:py-20">
            {/* 🌙 Top Semi-Moon Orange Glow */}
            <div
                className="
          pointer-events-none absolute
          -top-32 sm:-top-36 lg:-top-40
          left-1/2 -translate-x-1/2
          w-[320px] h-[160px]
          sm:w-[450px] sm:h-[220px]
          md:w-[550px] md:h-[260px]
          lg:w-[700px] lg:h-[350px]
          rounded-b-full
          bg-[#F04C2B]/25
          blur-3xl
        "
            />


            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <h2 className="text-3xl font-extrabold text-[#0D5EA6] sm:text-4xl">
                        Trusted by Thousands
                    </h2>
                    <p className="mt-4 text-gray-600 sm:text-lg">
                        Powering fast, secure and reliable parcel delivery across cities
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 180 }}
                            className="
                group relative rounded-2xl bg-white
                p-6 sm:p-7 text-center
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                transition
              "
                        >
                            {/* Icon */}
                            <div
                                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: `${stat.color}20`,
                                    color: stat.color,
                                }}
                            >
                                <span className="text-2xl">{stat.icon}</span>
                            </div>

                            {/* Count Number */}
                            <h3 className="text-2xl font-extrabold text-[#03373D] sm:text-3xl">
                                <CountUp
                                    end={stat.value}
                                    duration={2.2}
                                    decimals={stat.decimals || 0}
                                    separator=","
                                    suffix={stat.suffix}
                                />
                            </h3>

                            {/* Title */}
                            <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                                {stat.title}
                            </p>

                            {/* Accent */}
                            <span
                                className="absolute inset-x-6 bottom-0 h-1 scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100"
                                style={{ backgroundColor: stat.color }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
