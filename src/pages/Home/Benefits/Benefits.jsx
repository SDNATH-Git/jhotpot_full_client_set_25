import React from "react";
import BenefitCard from './BenefitCard';
import tracking from '../../../assets/benefits/tracking.png';
import call from '../../../assets/benefits/call.png';
import support from '../../../assets/benefits/support.png';

const benefits = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates.",
    image: tracking,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination without any damage.",
    image: call,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Need help? Our support team is available 24/7 to assist with your delivery queries anytime.",
    image: support,
  },
];

const Benefits = () => {
  return (
    <div className="py-16 bg-base-200">
      <h2 className="text-3xl font-bold text-[#0D5EA6] text-center mb-12">
        Why Choose Us
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
        {benefits.map((benefit, idx) => (
          <BenefitCard key={benefit.id} {...benefit} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default Benefits;

