// import { useQuery } from "@tanstack/react-query";
// import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter } from "date-fns";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import useAuth from "../../../hooks/useAuth";

// const MyEarnings = () => {
//     const axiosSecure = useAxiosSecure();
//     const { user } = useAuth();
//     const email = user?.email;

//     const { data: parcels = [], isLoading } = useQuery({
//         queryKey: ["completedDeliveries", email],
//         enabled: !!email,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/rider/completed-parcels?email=${email}`);
//             return res.data;
//         },
//     });

//     const calculateEarning = (parcel) => {
//         const cost = Number(parcel.cost);
//         return parcel.sender_center === parcel.receiver_center ? cost * 0.8 : cost * 0.3;
//     };

//     // Filtered earnings
//     const now = new Date();
//     const todayStart = startOfDay(now);
//     const weekStart = startOfWeek(now, { weekStartsOn: 1 });
//     const monthStart = startOfMonth(now);
//     const yearStart = startOfYear(now);

//     let total = 0,
//         totalCashedOut = 0,
//         totalPending = 0,
//         today = 0,
//         week = 0,
//         month = 0,
//         year = 0;

//     parcels.forEach((p) => {
//         const earning = calculateEarning(p);
//         const deliveredAt = new Date(p.delivered_at);
//         total += earning;
//         if (p.cashout_status === "cashed_out") totalCashedOut += earning;
//         else totalPending += earning;

//         if (isAfter(deliveredAt, todayStart)) today += earning;
//         if (isAfter(deliveredAt, weekStart)) week += earning;
//         if (isAfter(deliveredAt, monthStart)) month += earning;
//         if (isAfter(deliveredAt, yearStart)) year += earning;
//     });

//     return (
//         <div className="p-6 space-y-6">
//             <h2 className="text-2xl font-bold">My Earnings</h2>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="bg-base-200 p-4 rounded-xl shadow">
//                             <p className="text-lg font-semibold">Total Earnings</p>
//                             <p className="text-2xl font-bold text-green-600">৳{total.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-base-200 p-4 rounded-xl shadow">
//                             <p className="text-lg font-semibold">Cashed Out</p>
//                             <p className="text-2xl font-bold text-blue-600">৳{totalCashedOut.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-base-200 p-4 rounded-xl shadow">
//                             <p className="text-lg font-semibold">Pending</p>
//                             <p className="text-2xl font-bold text-yellow-600">৳{totalPending.toFixed(2)}</p>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//                         <div className="bg-base-100 p-4 rounded-lg shadow">
//                             <p className="text-sm text-gray-500">Today</p>
//                             <p className="text-xl font-bold text-green-700">৳{today.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-base-100 p-4 rounded-lg shadow">
//                             <p className="text-sm text-gray-500">This Week</p>
//                             <p className="text-xl font-bold text-green-700">৳{week.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-base-100 p-4 rounded-lg shadow">
//                             <p className="text-sm text-gray-500">This Month</p>
//                             <p className="text-xl font-bold text-green-700">৳{month.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-base-100 p-4 rounded-lg shadow">
//                             <p className="text-sm text-gray-500">This Year</p>
//                             <p className="text-xl font-bold text-green-700">৳{year.toFixed(2)}</p>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default MyEarnings;


import { useQuery } from "@tanstack/react-query";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter } from "date-fns";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { FaMoneyBillWave, FaWallet, FaHourglassHalf, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Blue (Cashed Out)
const ACCENT_COLOR = '#F04C2B'; // Red/Orange (Pending)
const TEXT_SHADE = '#03373D'; // Dark Text/Header

const MyEarnings = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const email = user?.email;

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["completedDeliveries", email],
        enabled: !!email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completed-parcels?email=${email}`);
            return res.data;
        },
    });

    const calculateEarning = (parcel) => {
        const cost = Number(parcel.cost);
        return parcel.sender_center === parcel.receiver_center ? cost * 0.8 : cost * 0.3;
    };

    // Filtered earnings calculation
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Week starts on Monday
    const monthStart = startOfMonth(now);
    const yearStart = startOfYear(now);

    let total = 0,
        totalCashedOut = 0,
        totalPending = 0,
        today = 0,
        week = 0,
        month = 0,
        year = 0;

    parcels.forEach((p) => {
        const earning = calculateEarning(p);
        const deliveredAt = new Date(p.delivered_at);

        total += earning;
        if (p.cashout_status === "cashed_out") totalCashedOut += earning;
        else totalPending += earning;

        // Ensure deliveredAt is valid before comparison
        if (p.delivered_at && isAfter(deliveredAt, todayStart)) today += earning;
        if (p.delivered_at && isAfter(deliveredAt, weekStart)) week += earning;
        if (p.delivered_at && isAfter(deliveredAt, monthStart)) month += earning;
        if (p.delivered_at && isAfter(deliveredAt, yearStart)) year += earning;
    });

    // Pie Chart Data
    const pieChartData = {
        labels: ['Cashed Out', 'Pending'],
        datasets: [
            {
                label: 'Earnings Status (৳)',
                data: [totalCashedOut, totalPending],
                backgroundColor: [PRIMARY_COLOR, ACCENT_COLOR],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2,
            },
        ],
    };

    // Card Component
    const EarningCard = ({ title, value, icon: Icon, bgColor, textColor }) => (
        <div className={`p-6 rounded-xl shadow-lg border-b-4 hover:shadow-xl transition duration-300 ${bgColor}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold uppercase text-gray-500">{title}</p>
                    <p className={`text-3xl font-extrabold mt-1`} style={{ color: textColor }}>
                        ৳{value.toFixed(2)}
                    </p>
                </div>
                <Icon className="text-4xl opacity-70" style={{ color: textColor }} />
            </div>
        </div>
    );

    // --- RENDER START ---

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
                <FaSpinner className="text-4xl animate-spin" style={{ color: ACCENT_COLOR }} />
                <p className="text-lg text-gray-600 ml-3">Loading earnings data...</p>
            </div>
        );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-l-8" style={{ borderColor: ACCENT_COLOR }}>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center" style={{ color: TEXT_SHADE }}>
                    <FaWallet className="mr-3 text-4xl" style={{ color: ACCENT_COLOR }} />
                    My Earnings Overview
                </h1>
                <p className="text-gray-600 mt-1">Detailed summary of your delivery income and cashout status.</p>
            </header>

            {/* Total Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <EarningCard
                    title="Total Lifetime Earnings"
                    value={total}
                    icon={FaMoneyBillWave}
                    bgColor="bg-green-100"
                    textColor="#10B981" // Tailwind green-500 equivalent
                />
                <EarningCard
                    title="Total Cashed Out"
                    value={totalCashedOut}
                    icon={FaCheckCircle}
                    bgColor="bg-blue-100"
                    textColor={PRIMARY_COLOR}
                />
                <EarningCard
                    title="Pending Cashout"
                    value={totalPending}
                    icon={FaHourglassHalf}
                    bgColor="bg-red-100"
                    textColor={ACCENT_COLOR}
                />
            </div>

            {/* Time Period Breakdown & Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Time Period Breakdown */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: TEXT_SHADE }}>Earnings by Period</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <EarningCard
                            title="Today's Earnings"
                            value={today}
                            icon={FaMoneyBillWave}
                            bgColor="bg-gray-50"
                            textColor={TEXT_SHADE}
                        />
                        <EarningCard
                            title="This Week"
                            value={week}
                            icon={FaMoneyBillWave}
                            bgColor="bg-gray-50"
                            textColor={TEXT_SHADE}
                        />
                        <EarningCard
                            title="This Month"
                            value={month}
                            icon={FaMoneyBillWave}
                            bgColor="bg-gray-50"
                            textColor={TEXT_SHADE}
                        />
                        <EarningCard
                            title="This Year"
                            value={year}
                            icon={FaMoneyBillWave}
                            bgColor="bg-gray-50"
                            textColor={TEXT_SHADE}
                        />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-6" style={{ color: TEXT_SHADE }}>Cashout Status Ratio</h3>
                    {total > 0 ? (
                        <div className="w-full max-w-xs h-auto">
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No earnings data to display the chart.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MyEarnings;