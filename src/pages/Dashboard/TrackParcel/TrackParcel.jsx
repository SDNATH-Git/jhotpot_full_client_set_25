// TrackParcel
import React, { useState } from "react";
// সংশোধিত ইম্পোর্ট: FaBoxOpen এবং FaWeight যোগ করা হলো
import { FaTruck, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaBoxOpen, FaWeight } from "react-icons/fa";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_BRAND_COLOR = '#0D5EA6'; // গাঢ় নীল (Accent)
const SECONDARY_BRAND_COLOR = '#F04C2B'; // লাল/কমলা (Active/Action)
const DARK_TEXT_COLOR = '#03373D'; // গাঢ় ছায়া (Text/Headers)

// --- ডেমো ট্র্যাকিং ডেটা (ম্যাপের জন্য লোকেশন যুক্ত) ---
const demoTrackingData = {
    'PCL-20251230-AD3G2': {
        status: 'Out for Delivery',
        title: 'High-Performance Laptop',
        sender: 'Dhaka',
        receiver: 'Chattogram', // গন্তব্য
        weight: '3.5 kg',
        trackingHistory: [
            { date: 'Dec 30, 2025 10:00 AM', status: 'Parcel Created', location: 'Sender Confirmed' },
            { date: 'Dec 30, 2025 04:30 PM', status: 'Collected by Rider', location: 'Dhaka Service Center' },
            { date: 'Dec 30, 2025 08:00 PM', status: 'In Transit', location: 'Moving towards Chattogram Hub' },
            { date: 'Dec 31, 2025 08:30 AM', status: 'Arrived at Destination Hub', location: 'Chattogram Service Center' },
            { date: 'Dec 31, 2025 10:15 AM', status: 'Out for Delivery', location: 'Rider: Mr. Karim (017xxxxxx)' },
        ],
    },
    'PCL-20251228-BHT4P': {
        status: 'Delivered',
        title: 'Official Documents',
        sender: 'Rajshahi',
        receiver: 'Khulna', // গন্তব্য
        weight: '0.5 kg',
        trackingHistory: [
            { date: 'Dec 28, 2025 11:30 AM', status: 'Parcel Created', location: 'Sender Confirmed' },
            { date: 'Dec 28, 2025 03:00 PM', status: 'Collected by Rider', location: 'Rajshahi Service Center' },
            { date: 'Dec 29, 2025 09:00 AM', status: 'Delivered', location: 'Received by: Ms. Farzana' },
        ],
    },
    'INVALID-TRACKING-ID': null,
};

// --- Parcel Tracking Component ---
const TrackParcel = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = () => {
        if (!trackingId) {
            setResult(null);
            return;
        }

        setLoading(true);
        setResult(null);

        // Simulate API call delay
        setTimeout(() => {
            const data = demoTrackingData[trackingId.toUpperCase()];
            setResult(data === undefined ? 'not_found' : data);
            setLoading(false);
        }, 1000); // 1 second delay simulation
    };

    // Helper to determine icon based on status
    const getStatusIcon = (status) => {
        if (status.includes('Delivered')) return <FaCheckCircle className="text-green-500" />;
        if (status.includes('Out for Delivery') || status.includes('Collected')) return <FaTruck className="text-yellow-600" />;
        if (status.includes('In Transit') || status.includes('Arrived')) return <FaMapMarkerAlt className="text-blue-500" />;
        if (status.includes('Created')) return <FaHourglassHalf className="text-gray-500" />;
        return <FaHourglassHalf className="text-gray-400" />;
    };

    // ম্যাপ লিংক জেনারেটর
    const generateMapLink = (location) => {
        // একটি ডেমো Google Maps সার্চ লিংক তৈরি করা হচ্ছে
        const query = encodeURIComponent(`Parcel delivery to ${location}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    return (
        <section className="bg-gray-50 min-h-screen py-10 md:py-16 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8" style={{ borderTopColor: SECONDARY_BRAND_COLOR }}>

                {/* Header */}
                <div className="p-2 md:p-4 text-center border-b border-gray-100">
                    <h1 className="text-2xl md:text-4xl font-extrabold flex items-center justify-center" style={{ color: PRIMARY_BRAND_COLOR }}>
                        <FaTruck className="mr-3 text-4xl" style={{ color: SECONDARY_BRAND_COLOR }} />
                        Track Your Parcel
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">Enter your tracking ID to see the latest status.</p>
                </div>

                {/* Tracking Input Section */}
                <div className="px-6 md:px-10">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Enter 15-digit Tracking ID (e.g., PCL-20251230-AD3G2)"
                            className="flex-grow input input-bordered w-full py-3 px-4 rounded-xl text-lg focus:border-2 focus:ring-1 transition duration-200"
                            style={{ borderColor: PRIMARY_BRAND_COLOR, focusRingColor: PRIMARY_BRAND_COLOR }}
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                        />
                        <button
                            onClick={handleTrack}
                            disabled={loading || trackingId.length < 10}
                            className="btn w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundColor: SECONDARY_BRAND_COLOR, hoverBackgroundColor: PRIMARY_BRAND_COLOR }}
                        >
                            {loading ? 'Tracking...' : <><FaSearch className="mr-2" /> Track</>}
                        </button>
                    </div>
                </div>

                {/* Tracking Result Section */}
                <div className="p-6 md:p-10">
                    {loading && (
                        <div className="text-center py-8">
                            <span className="loading loading-spinner text-xl" style={{ color: PRIMARY_BRAND_COLOR }}></span>
                            <p className="mt-3 text-lg" style={{ color: DARK_TEXT_COLOR }}>Searching for your parcel...</p>
                        </div>
                    )}

                    {/* Result Found */}
                    {result && result !== 'not_found' && (
                        <div className="space-y-8">

                            {/* Current Status Box and Map Button */}
                            <div className="p-6 rounded-xl shadow-lg border-l-8" style={{ borderColor: SECONDARY_BRAND_COLOR, background: '#F9FAFB' }}>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-extrabold flex items-center" style={{ color: PRIMARY_BRAND_COLOR }}>
                                            Current Status:
                                        </h3>
                                        <span className={`inline-block text-2xl font-bold px-4 py-1 rounded-full text-white shadow-md mt-2`}
                                            style={{ backgroundColor: result.status === 'Delivered' ? '#10B981' : SECONDARY_BRAND_COLOR }}>
                                            {result.status}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-2">Last Updated: {result.trackingHistory[result.trackingHistory.length - 1].date}</p>
                                    </div>

                                    {/* Map Button (New Addition) */}
                                    <a
                                        href={generateMapLink(result.receiver)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn flex items-center px-6 py-2 rounded-xl text-white font-bold transition-all whitespace-nowrap"
                                        style={{ backgroundColor: PRIMARY_BRAND_COLOR, hoverBackgroundColor: SECONDARY_BRAND_COLOR }}
                                    >
                                        <FaMapMarkerAlt className="mr-2" /> View on Map
                                    </a>
                                </div>
                            </div>

                            {/* Parcel Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-gray-200 shadow-sm" style={{ color: DARK_TEXT_COLOR }}>
                                <DetailItem icon={<FaBoxOpen />} label="Parcel Title" value={result.title} />
                                <DetailItem icon={<FaWeight />} label="Weight" value={result.weight} />
                                <DetailItem icon={<FaMapMarkerAlt />} label="From" value={result.sender} />
                                <DetailItem icon={<FaMapMarkerAlt />} label="To" value={result.receiver} />
                            </div>

                            {/* Tracking Timeline */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4" style={{ color: DARK_TEXT_COLOR }}>
                                    Delivery History Timeline
                                </h3>
                                <div className="space-y-6">
                                    {result.trackingHistory.slice().reverse().map((item, index, arr) => (
                                        <div key={index} className="flex relative items-start">
                                            {/* Vertical Line */}
                                            {index < arr.length - 1 && (
                                                <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                                            )}

                                            {/* Dot and Icon */}
                                            <div className="flex items-center">
                                                <div className={`z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white border-2 ${item.status === result.status ? 'border-4 border-dashed' : ''
                                                    }`}
                                                    style={{ borderColor: item.status === result.status ? SECONDARY_BRAND_COLOR : PRIMARY_BRAND_COLOR }}>
                                                    {getStatusIcon(item.status)}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm text-gray-500 flex items-center">
                                                        <FaCalendarAlt className="mr-2" /> {item.date}
                                                    </p>
                                                    <p className="text-lg font-semibold mt-0.5" style={{ color: DARK_TEXT_COLOR }}>
                                                        {item.status}
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center">
                                                        <FaMapMarkerAlt className="mr-1" /> {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result Not Found */}
                    {result === 'not_found' && (
                        <div className="text-center py-10 bg-red-50 rounded-xl border-2 border-red-300">
                            <FaTimesCircle className="text-6xl mx-auto mb-4" style={{ color: SECONDARY_BRAND_COLOR }} />
                            <h3 className="text-2xl font-bold" style={{ color: DARK_TEXT_COLOR }}>Tracking ID Not Found</h3>
                            <p className="text-gray-600 mt-2">Please check the ID and try again, or contact support.</p>
                        </div>
                    )}

                    {!loading && !result && (
                        <div className="text-center py-10 bg-blue-50 rounded-xl border-2 border-blue-300">
                            <FaTruck className="text-6xl mx-auto mb-4" style={{ color: PRIMARY_BRAND_COLOR }} />
                            <h3 className="text-2xl font-bold" style={{ color: DARK_TEXT_COLOR }}>Ready to Track</h3>
                            <p className="text-gray-600 mt-2">Enter your tracking number above and click 'Track'.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

// --- Helper Component for Details Grid ---
const DetailItem = ({ icon, label, value }) => (
    <div className="flex flex-col space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500 flex items-center">
            {icon && React.cloneElement(icon, { className: "mr-1 text-sm text-gray-500" })}
            {label}
        </span>
        <span className="text-base font-bold" style={{ color: DARK_TEXT_COLOR }}>
            {value}
        </span>
    </div>
);

export default TrackParcel;