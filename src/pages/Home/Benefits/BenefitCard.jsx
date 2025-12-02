import React from "react";
import { motion } from "framer-motion";

const BenefitCard = ({ title, description, image, index }) => {
  const gradientBg =
    [0, 2].includes(index)
      ? "bg-[linear-gradient(270deg,#FFF9FC_0%,#FFEFF9_100%)]"
      : "bg-[linear-gradient(270deg,#F9FCFF_0%,#F0F7FF_100%)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`group flex flex-col items-center text-center p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#0D5EA6]/50 ${gradientBg}`}
    >
      <motion.img
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
        src={image}
        alt={title}
        className="w-20 h-20 object-contain mb-4 drop-shadow-md"
      />
      <h3 className="text-xl font-bold text-[#0D5EA6] mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default BenefitCard;
