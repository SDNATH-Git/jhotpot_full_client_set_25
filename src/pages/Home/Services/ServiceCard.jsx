import React from 'react';

const ServiceCard = ({ service, index }) => {
  const { icon: Icon, title, description } = service;

  const gradientBg =
    [0, 2, 4].includes(index)
      ? "bg-[linear-gradient(270deg,#FFF9FC_0%,#FFEFF9_100%)]"
      : "bg-[linear-gradient(270deg,#F9FCFF_0%,#F0F7FF_100%)]";

  return (
    <div className={`shadow-lg rounded-3xl p-6 hover:shadow-2xl border-l-2 border-r-2 border-[#F04C2B] transition-all duration-300 ${gradientBg}`}>
      <div className="text-4xl bg-[#0D5EA6] p-2 w-[55px] rounded-xl text-white mb-4">
        <Icon />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#0D5EA6]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;

