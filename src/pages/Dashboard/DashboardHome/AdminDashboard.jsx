// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//     FaMotorcycle,
//     FaCheckCircle,
//     FaShippingFast,
//     FaBoxOpen,
// } from "react-icons/fa";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from 'recharts';


// const COLORS = {
//     not_collected: '#F87171',      // red-400
//     in_transit: '#FBBF24',         // yellow-400
//     rider_assigned: '#60A5FA',     // blue-400
//     delivered: '#34D399',          // green-400
// };

// const statusIcons = {
//     rider_assigned: <FaMotorcycle className="text-4xl text-info" />,
//     delivered: <FaCheckCircle className="text-4xl text-success" />,
//     in_transit: <FaShippingFast className="text-4xl text-warning" />,
//     not_collected: <FaBoxOpen className="text-4xl text-error" />,
// };

// const statusLabels = {
//     rider_assigned: "Assigned to Rider",
//     delivered: "Delivered",
//     in_transit: "In Transit",
//     not_collected: "Not Collected",
// };



// export default function AdminDashboard() {
//     const axiosSecure = useAxiosSecure();
//     const { data: deliveryStatus = [], isLoading, isError, error } = useQuery({
//         queryKey: ["parcelStatusCount"],
//         queryFn: async () => {
//             const res = await axiosSecure.get("/parcels/delivery/status-count");
//             return res.data;
//         },
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         retry: 1,
//     });

//     const processedPieData = deliveryStatus.map((item) => ({
//         name: statusLabels[item.status] || item.status,
//         value: item.count,
//         status: item.status
//     }))

//     if (isLoading)
//         return (
//             <div className="flex justify-center items-center min-h-[70vh]">
//                 <span className="loading loading-spinner loading-lg text-primary"></span>
//             </div>
//         );

//     if (isError)
//         return (
//             <div className="text-center text-red-600 mt-10">
//                 Error loading data: {error.message}
//             </div>
//         );

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-6">Parcel Delivery Summary</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {deliveryStatus.map(({ count, status }) => (
//                     <div
//                         key={status}
//                         className="card bg-base-100 shadow-md border border-base-200 flex flex-col items-center justify-center p-6"
//                     >
//                         {statusIcons[status] || <FaBoxOpen className="text-4xl" />}
//                         <h2 className="text-lg font-semibold mt-3 text-center">
//                             {statusLabels[status] || status}
//                         </h2>
//                         <p className="text-4xl font-extrabold text-primary mt-2">{count}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* pie chart */}
//             <div className="card bg-base-100 shadow-md p-4">
//                 <h2 className="text-xl font-bold mb-4">Delivery Status Breakdown</h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                         <Pie
//                             data={processedPieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={100}
//                             label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                         >
//                             {processedPieData.map((entry) => (
//                                 <Cell
//                                     key={`cell-${entry.status}`}
//                                     fill={COLORS[entry.status] || '#A78BFA'}
//                                 />
//                             ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend verticalAlign="bottom" height={36} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// }



import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaMotorcycle,
    FaCheckCircle,
    FaShippingFast,
    FaBoxOpen,
    FaRedoAlt,
    FaBoxes,
    FaDollarSign,
    FaChartLine,
    FaUsers, // নতুন: ব্যবহারকারীর জন্য আইকন
    FaUserTie, // নতুন: রাইডারের জন্য আইকন
} from "react-icons/fa";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Bar,
} from 'recharts';
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// --- কনফিগারেশন ---
// ১. স্ট্যাটাস কনফিগারেশন: আধুনিক রঙের প্যালেট এবং শ্যাডো
const STATUS_CONFIG = {
    not_collected: {
        label: "Not Collected",
        color: '#EF4444', // Red-500
        icon: <FaBoxOpen className="text-4xl text-white" />,
        gradient: "from-red-500 to-red-400",
    },
    in_transit: {
        label: "In Transit",
        color: '#F59E0B', // Amber-500
        icon: <FaShippingFast className="text-4xl text-white" />,
        gradient: "from-amber-500 to-amber-400",
    },
    rider_assigned: {
        label: "Assigned to Rider",
        color: '#3B82F6', // Blue-500
        icon: <FaMotorcycle className="text-4xl text-white" />,
        gradient: "from-blue-500 to-blue-400",
    },
    delivered: {
        label: "Delivered",
        color: '#10B981', // Emerald-500
        icon: <FaCheckCircle className="text-4xl text-white" />,
        gradient: "from-emerald-500 to-emerald-400",
    },
};

const UNKNOWN_STATUS = {
    label: "Unknown Status",
    color: '#6B7280', // Gray-500
    icon: <FaBoxOpen className="text-4xl text-white" />,
    gradient: "from-gray-500 to-gray-400",
};

// ২. প্রধান মেট্রিক্স কনফিগারেশন
const MAIN_METRICS_CONFIG = {
    totalParcels: {
        title: "Total Parcels",
        icon: FaBoxes,
        apiPath: "/parcels/count",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    totalRevenue: {
        title: "Total Revenue",
        icon: FaDollarSign,
        apiPath: "/parcels/revenue-sum",
        color: "text-teal-600",
        bg: "bg-teal-50",
    },
    totalUsers: { // নতুন মেট্রিক
        title: "Total Users",
        icon: FaUsers,
        apiPath: "/users/count",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    totalRiders: { // নতুন মেট্রিক
        title: "Total Riders",
        icon: FaUserTie,
        apiPath: "/riders/count",
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
    successRate: {
        title: "Delivery Success Rate",
        icon: FaChartLine,
        apiPath: null,
        color: "text-green-600",
        bg: "bg-green-50",
    },
};

// --- ডেটা ফেচিং হুকস ---

// ৩. useAdminMetrics হুক: ডেমো ডেটা সহ
const useAdminMetrics = () => {
    // এই হুকটি এখন ডেমো ডেটা ব্যবহার করবে
    const DEMO_METRICS = {
        statusCountData: [
            { status: 'delivered', count: 185 },
            { status: 'rider_assigned', count: 42 },
            { status: 'in_transit', count: 10 },
            { status: 'not_collected', count: 58 },
        ],
        totalParcels: 295, // 185+42+10+58
        totalRevenue: 45780.50,
        totalUsers: 1200,
        totalRiders: 45,
    };

    // রিয়েল API কলকে বাইপাস
    const isLoading = false;
    const isError = false;

    // এখানে আপনি চাইলে useQuery ব্যবহার করে আলাদা আলাদা API কল করতে পারতেন:
    // const axiosSecure = useAxiosSecure(); 
    // const { data: totalUsers = 0, isLoading: isUserLoading } = useQuery({ ... });

    return {
        statusCountData: DEMO_METRICS.statusCountData,
        totalParcels: DEMO_METRICS.totalParcels,
        totalRevenue: DEMO_METRICS.totalRevenue,
        totalUsers: DEMO_METRICS.totalUsers, // নতুন
        totalRiders: DEMO_METRICS.totalRiders, // নতুন
        isLoading,
        refetchAll: () => console.log("Demo Refetch Triggered"),
        isError
    };
};

// ৪. useDeliveryTrends হুক: ডেমো ডেটা সহ
const useDeliveryTrends = () => {
    // ডেমো ডেটা: গত ৭ দিনের জন্য
    const DEMO_TRENDS_DATA = [
        { date: '2025-12-25', delivered: 18, cancelled: 3 },
        { date: '2025-12-26', delivered: 25, cancelled: 5 },
        { date: '2025-12-27', delivered: 20, cancelled: 2 },
        { date: '2025-12-28', delivered: 30, cancelled: 7 },
        { date: '2025-12-29', delivered: 22, cancelled: 4 },
        { date: '2025-12-30', delivered: 15, cancelled: 1 },
        { date: '2025-12-31', delivered: 28, cancelled: 6 },
    ];

    const isLoading = false;
    const isError = false;
    const trendsData = DEMO_TRENDS_DATA;

    return { trendsData, isLoading, isError };
};

// --- চার্ট কম্পোনেন্ট ---

const DeliveryTrends = ({ trendsData, isLoading, isError }) => {
    if (isLoading) return <div className="text-center py-10 text-gray-500">Loading trends...</div>;

    // ত্রুটি বা ডেটা না থাকলে
    if (isError || !trendsData || trendsData.length === 0) return (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FaChartLine className="inline-block text-3xl mb-2" />
            <p>No delivery trends data available or error occurred.</p>
        </div>
    );

    // Bar Chart রেন্ডারিং
    return (
        <div className="card bg-white shadow-xl shadow-gray-200 p-6 rounded-xl col-span-full border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center border-b pb-3">
                <FaChartLine className="mr-3 text-indigo-500" /> Delivery Trends (Last 7 Days)
            </h2>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Bar dataKey="delivered" fill="#10B981" name="Delivered" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// --- মেইন ড্যাশবোর্ড কম্পোনেন্ট ---
export default function AdminDashboard() {
    const {
        statusCountData,
        totalParcels,
        totalRevenue,
        totalUsers,
        totalRiders,
        isLoading,
        refetchAll,
        isError
    } = useAdminMetrics();
    const { trendsData, isLoading: isTrendsLoading, isError: isTrendsError } = useDeliveryTrends();

    // সাফল্যের হার গণনা
    const deliveredCount = statusCountData.find(item => item.status === 'delivered')?.count || 0;
    const successRate = totalParcels > 0 ? ((deliveredCount / totalParcels) * 100).toFixed(1) : '0.0';

    // পাই চার্টের জন্য ডেটা প্রস্তুত করা
    const processedPieData = statusCountData.map((item) => {
        const config = STATUS_CONFIG[item.status] || UNKNOWN_STATUS;
        return {
            name: config.label,
            value: item.count,
            status: item.status,
        }
    });

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );

    // ত্রুটি ব্যবস্থাপনা (যদিও ডেমো ডেটার জন্য এটি ট্রিগার হবে না)
    if (isError)
        return (
            <div className="text-center bg-red-50 p-10 rounded-xl mx-auto max-w-lg mt-10 shadow-lg border border-red-300">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                    ⚠️ Data Fetching Error
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                    Failed to load core dashboard metrics.
                </p>
                <button
                    onClick={refetchAll}
                    className="btn bg-red-600 text-white hover:bg-red-700 border-none transition duration-300"
                >
                    <FaRedoAlt className="mr-2" /> Try Again
                </button>
            </div>
        );

    // মোট মেট্রিক্সের জন্য ডেটা অ্যারে
    const mainMetrics = [
        { ...MAIN_METRICS_CONFIG.totalParcels, value: totalParcels, format: 'number' },
        { ...MAIN_METRICS_CONFIG.totalRevenue, value: totalRevenue, format: 'currency' },
        { ...MAIN_METRICS_CONFIG.totalUsers, value: totalUsers, format: 'number' },
        { ...MAIN_METRICS_CONFIG.totalRiders, value: totalRiders, format: 'number' },
        { ...MAIN_METRICS_CONFIG.successRate, value: successRate, format: 'percent' },
    ];

    const formatValue = (value, format) => {
        if (format === 'currency') return `৳${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (format === 'percent') return `${value}%`;
        return value.toLocaleString();
    };

    return (
        <div className="p-4 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 border-b-4 border-indigo-500 pb-3">
                🚀 Admin Dashboard Overview
            </h1>

            {/* ১. প্রধান মেট্রিক্স কার্ড সেকশন */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                {mainMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index}
                            // আধুনিক কার্ড স্টাইল: bg-white, rounded-xl, shadow-lg, hover effect
                            className={`card ${metric.bg} bg-white rounded-xl shadow-lg p-6 border-l-4 border-r-2 border-transparent hover:border-indigo-400 transition duration-300 ease-in-out transform hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase text-gray-500 tracking-wider">{metric.title}</p>
                                <Icon className={`text-4xl ${metric.color}`} />
                            </div>
                            <p className="text-4xl font-extrabold mt-3 text-gray-800">
                                {formatValue(metric.value, metric.format)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* ২. ডেলিভারি স্ট্যাটাস এবং চার্ট সেকশন */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* স্ট্যাটাস কাউন্ট কার্ড (Gradient Style) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {statusCountData.map(({ count, status }) => {
                        const config = STATUS_CONFIG[status] || UNKNOWN_STATUS;
                        return (
                            <div
                                key={status}
                                // Gradient Background এবং White Text
                                className={`card bg-gradient-to-br ${config.gradient} shadow-2xl p-6 flex flex-col items-center justify-center rounded-xl transition duration-300 hover:shadow-3xl transform hover:translate-y-[-3px]`}
                            >
                                {config.icon}
                                <h2 className="text-xl font-semibold mt-4 text-white text-center tracking-wide">
                                    {config.label}
                                </h2>
                                <p className="text-6xl font-extrabold mt-3 text-white">
                                    {count.toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* পাই চার্ট */}
                <div className="card bg-white shadow-xl shadow-gray-200 p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-4 border-b pb-2">📦 Status Distribution</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={processedPieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110} // চার্টের আকার বাড়ানো হলো
                                    innerRadius={40} // ডোনার্ট চার্ট করা হলো
                                    paddingAngle={3} // সেগমেন্টের মধ্যে ব্যবধান
                                    labelLine={false}
                                    label={({ percent }) => (percent * 100).toFixed(1) + '%'}
                                >
                                    {processedPieData.map((entry) => {
                                        const config = STATUS_CONFIG[entry.status] || UNKNOWN_STATUS;
                                        return (
                                            <Cell
                                                key={`cell-${entry.status}`}
                                                fill={config.color}
                                                // হালকা শ্যাডো এফেক্ট যোগ
                                                style={{ filter: `drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))` }}
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`Count: ${value.toLocaleString()}`, 'Parcels']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}
                                />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '15px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ৩. ডেলিভারি ট্রেন্ডস বার চার্ট */}
            <div className="mt-8">
                <DeliveryTrends trendsData={trendsData} isLoading={isTrendsLoading} isError={isTrendsError} />
            </div>

        </div>
    );
}






