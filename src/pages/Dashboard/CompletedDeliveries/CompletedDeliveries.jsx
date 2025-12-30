// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import useAuth from "../../../hooks/useAuth";
// import Swal from "sweetalert2";


// const CompletedDeliveries = () => {
//     const axiosSecure = useAxiosSecure();
//     const queryClient = useQueryClient();
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
//         if (parcel.sender_center === parcel.receiver_center) {
//             return cost * 0.8;
//         } else {
//             return cost * 0.3;
//         }
//     };

//     // Mutation for cashout
//     const { mutateAsync: cashout } = useMutation({
//         mutationFn: async (parcelId) => {
//             const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(["completedDeliveries"]);
//         },
//     });

//     const handleCashout = (parcelId) => {
//         Swal.fire({
//             title: "Confirm Cashout",
//             text: "You are about to cash out this delivery.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes, Cash Out",
//             cancelButtonText: "Cancel",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 cashout(parcelId)
//                     .then(() => {
//                         Swal.fire("Success", "Cashout completed.", "success");
//                     })
//                     .catch(() => {
//                         Swal.fire("Error", "Failed to cash out. Try again.", "error");
//                     });
//             }
//         });
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : parcels.length === 0 ? (
//                 <p className="text-gray-500">No deliveries yet.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="table table-zebra w-full">
//                         <thead>
//                             <tr>
//                                 <th>Tracking ID</th>
//                                 <th>Title</th>
//                                 <th>From</th>
//                                 <th>To</th>
//                                 <th>Picked At</th>
//                                 <th>Delivered At</th>
//                                 <th>Fee (৳)</th>
//                                 <th>Your Earning (৳)</th>
//                                 <th>Cashout</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {parcels.map((parcel) => (
//                                 <tr key={parcel._id}>
//                                     <td>{parcel.tracking_id}</td>
//                                     <td>{parcel.title}</td>
//                                     <td>{parcel.sender_center}</td>
//                                     <td>{parcel.receiver_center}</td>
//                                     <td>{parcel.picked_at ? new Date(parcel.picked_at).toLocaleString() : "N/A"}</td>
//                                     <td>{parcel.delivered_at ? new Date(parcel.delivered_at).toLocaleString() : "N/A"}</td>
//                                     <td>৳{parcel.cost}</td>
//                                     <td className="font-semibold text-green-600">৳{calculateEarning(parcel).toFixed(2)}</td>
//                                     <td>
//                                         {parcel.cashout_status === "cashed_out" ? (
//                                             <span className="badge badge-success text-xs px-2 py-1 whitespace-nowrap">
//                                                 Cashed Out
//                                             </span>
//                                         ) : (
//                                             <button
//                                                 className="btn btn-sm btn-warning"
//                                                 onClick={() => handleCashout(parcel._id)}
//                                             >
//                                                 Cashout
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CompletedDeliveries;



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaCheckDouble, FaMoneyBillWave, FaRupeeSign, FaSpinner } from "react-icons/fa";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Blue accent (Cashout button, main accents)
const ACCENT_COLOR = '#F04C2B'; // Red/Orange accent (Earning highlight)
const TEXT_SHADE = '#03373D'; // Dark Text/Table Header

// Helper function to format date
const formatDateTime = (iso) =>
    iso ? new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : "N/A";

const CompletedDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
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
        if (parcel.sender_center === parcel.receiver_center) {
            // 80% for same center delivery
            return cost * 0.8;
        } else {
            // 30% for different center delivery
            return cost * 0.3;
        }
    };

    // Mutation for cashout
    const { mutateAsync: cashout, isPending: isCashoutPending } = useMutation({
        mutationFn: async (parcelId) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["completedDeliveries"]);
        },
    });

    const handleCashout = (parcelId) => {
        Swal.fire({
            title: "Confirm Cashout",
            text: "Are you sure you want to request cash out for this delivery's earnings?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: PRIMARY_COLOR,
            cancelButtonColor: '#777',
            confirmButtonText: "Yes, Cash Out",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                cashout(parcelId)
                    .then(() => {
                        Swal.fire("Success", "Cashout request submitted successfully.", "success");
                    })
                    .catch(() => {
                        Swal.fire("Error", "Failed to submit cash out request. Try again.", "error");
                    });
            }
        });
    };

    // --- RENDER START ---

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
                <p className="text-gray-600 ml-3">Loading completed deliveries...</p>
            </div>
        );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4" style={{ borderBottomColor: PRIMARY_COLOR }}>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center" style={{ color: TEXT_SHADE }}>
                    <FaCheckDouble className="mr-3 text-4xl" style={{ color: PRIMARY_COLOR }} />
                    Completed Deliveries
                </h1>
                <p className="text-gray-600 mt-1">Review your successful deliveries and manage your cashout requests.</p>
            </header>

            {parcels.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <FaMoneyBillWave className="text-6xl mx-auto mb-4" style={{ color: ACCENT_COLOR }} />
                    <p className="text-xl font-semibold text-gray-600">You have no completed deliveries yet.</p>
                    <p className="text-gray-500 mt-2">Get back on the road to start earning!</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
                    <table className="table w-full text-gray-700">
                        {/* Table Header */}
                        <thead className="text-white text-base font-semibold uppercase tracking-wider" style={{ backgroundColor: TEXT_SHADE }}>
                            <tr>
                                <th className="rounded-tl-xl p-4">Tracking ID / Title</th>
                                <th className="p-4">Delivery Route</th>
                                <th className="p-4">Picked/Delivered</th>
                                <th className="p-4">Fee (৳)</th>
                                <th className="p-4">Your Earning (৳)</th>
                                <th className="rounded-tr-xl p-4">Cashout</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {parcels.map((parcel) => (
                                <tr
                                    key={parcel._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                >
                                    {/* Tracking ID / Title */}
                                    <td>
                                        <div className="font-bold text-sm" style={{ color: PRIMARY_COLOR }}>{parcel.tracking_id}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{parcel.title}</div>
                                    </td>

                                    {/* Delivery Route */}
                                    <td>
                                        <div className="text-sm font-medium">{parcel.sender_center} </div>
                                        <div className="text-xs font-semibold" style={{ color: ACCENT_COLOR }}>→ {parcel.receiver_center}</div>
                                    </td>

                                    {/* Picked/Delivered Time */}
                                    <td>
                                        <div className="text-xs text-gray-700">Picked: {formatDateTime(parcel.picked_at)}</div>
                                        <div className="text-xs text-gray-700">Delivered: {formatDateTime(parcel.delivered_at)}</div>
                                    </td>

                                    {/* Fee */}
                                    <td>৳{Number(parcel.cost).toFixed(2)}</td>

                                    {/* Your Earning */}
                                    <td className="font-bold text-lg" style={{ color: ACCENT_COLOR }}>
                                        ৳{calculateEarning(parcel).toFixed(2)}
                                    </td>

                                    {/* Cashout */}
                                    <td>
                                        {parcel.cashout_status === "cashed_out" ? (
                                            <span className="badge badge-success text-xs px-3 py-2 font-semibold text-white whitespace-nowrap bg-green-500">
                                                <FaCheckDouble className="mr-1" /> Cashed Out
                                            </span>
                                        ) : (
                                            <button
                                                className="btn btn-sm text-white border-none shadow-md"
                                                style={{ backgroundColor: PRIMARY_COLOR, hover: { backgroundColor: '#0A4A87' } }}
                                                onClick={() => handleCashout(parcel._id)}
                                                disabled={isCashoutPending}
                                            >
                                                {isCashoutPending ? (
                                                    <>
                                                        <FaSpinner className="animate-spin mr-1" /> Processing
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaMoneyBillWave className="mr-1" /> Request Cashout
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveries;

