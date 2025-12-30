// import React from 'react';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import useAuth from '../../../hooks/useAuth';
// import Swal from 'sweetalert2';
// import useTrackingLogger from '../../../hooks/useTrackingLogger';

// const PendingDeliveries = () => {
//     const axiosSecure = useAxiosSecure();
//     const queryClient = useQueryClient();
//     const { logTracking } = useTrackingLogger();
//     const { user } = useAuth();

//     // Load parcels assigned to the current rider
//     const { data: parcels = [], isLoading } = useQuery({
//         queryKey: ["riderParcels"],
//         enabled: !!user?.email,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
//             return res.data;
//         },
//     });

//     // Mutation for updating parcel status
//     const { mutateAsync: updateStatus } = useMutation({
//         mutationFn: async ({ parcel, status }) => {
//             const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
//                 status,
//             });
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(["riderParcels"]);
//         },
//     });

//     const handleStatusUpdate = (parcel, newStatus) => {
//         Swal.fire({
//             title: "Are you sure?",
//             text: `Mark parcel as ${newStatus.replace("_", " ")}?`,
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonText: "Yes, update",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 updateStatus({ parcel, status: newStatus })
//                     .then( async() => {
//                         Swal.fire("Updated!", "Parcel status updated.", "success");

//                         // log tracking
//                         let trackDetails = `Picked up by ${user.displayName}`
//                         if (newStatus === 'delivered') {
//                             trackDetails = `Delivered by ${user.displayName}`
//                         }
//                         await logTracking({
//                                 tracking_id: parcel.tracking_id,
//                                 status: newStatus,
//                                 details: trackDetails,
//                                 updated_by: user.email,
//                             });

//                     })
//                     .catch(() => {
//                         Swal.fire("Error!", "Failed to update status.", "error");
//                     });
//             }
//         });
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Pending Deliveries</h2>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : parcels.length === 0 ? (
//                 <p className="text-gray-500">No assigned deliveries.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="table table-zebra w-full">
//                         <thead>
//                             <tr>
//                                 <th>Tracking ID</th>
//                                 <th>Title</th>
//                                 <th>Type</th>
//                                 <th>Receiver</th>
//                                 <th>Receiver Center</th>
//                                 <th>Cost</th>
//                                 <th>Status</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {parcels.map((parcel) => (
//                                 <tr key={parcel._id}>
//                                     <td>{parcel.tracking_id}</td>
//                                     <td>{parcel.title}</td>
//                                     <td>{parcel.type}</td>
//                                     <td>{parcel.receiver_name}</td>
//                                     <td>{parcel.receiver_center}</td>
//                                     <td>৳{parcel.cost}</td>
//                                     <td className="capitalize">{parcel.delivery_status.replace("_", " ")}</td>
//                                     <td>
//                                         {parcel.delivery_status === "rider_assigned" && (
//                                             <button
//                                                 className="btn btn-sm btn-primary text-black"
//                                                 onClick={() =>
//                                                     handleStatusUpdate(parcel, "in_transit")
//                                                 }
//                                             >
//                                                 Mark Picked Up
//                                             </button>
//                                         )}
//                                         {parcel.delivery_status === "in_transit" && (
//                                             <button
//                                                 className="btn btn-sm btn-success text-black"
//                                                 onClick={() =>
//                                                     handleStatusUpdate(parcel, "delivered")
//                                                 }
//                                             >
//                                                 Mark Delivered
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

// export default PendingDeliveries;




import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';
import { FaMotorcycle, FaTasks, FaSpinner, FaMapMarkerAlt, FaTruckLoading } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Blue accent (Picked Up button, main accents)
const ACCENT_COLOR = '#F04C2B'; // Red/Orange accent (Delivered button, header icon)
const TEXT_SHADE = '#03373D'; // Dark Text/Table Header

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { logTracking } = useTrackingLogger();
    const { user } = useAuth();

    // Load parcels assigned to the current rider
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["riderParcels"],
        enabled: !!user?.email,
        queryFn: async () => {
            // Fetch parcels that are either 'rider_assigned' or 'in_transit' for the current rider
            const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
            return res.data;
        },
    });

    // Mutation for updating parcel status
    const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: async ({ parcel, status }) => {
            const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
                status,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["riderParcels"]);
        },
    });

    const handleStatusUpdate = (parcel, newStatus) => {
        const statusText = newStatus.replace("_", " ");

        Swal.fire({
            title: "Confirm Action",
            text: `Are you sure you want to mark this parcel as "${statusText.toUpperCase()}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `Yes, Mark ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
            confirmButtonColor: newStatus === 'in_transit' ? PRIMARY_COLOR : ACCENT_COLOR,
            cancelButtonColor: '#777',
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus({ parcel, status: newStatus })
                    .then(async () => {
                        Swal.fire("Success!", `Parcel status updated to ${statusText}.`, "success");

                        // Log tracking
                        let trackDetails = `Item picked up by ${user.displayName}`;
                        if (newStatus === 'delivered') {
                            trackDetails = `Item successfully delivered by ${user.displayName}`;
                        }

                        await logTracking({
                            tracking_id: parcel.tracking_id,
                            status: newStatus,
                            details: trackDetails,
                            updated_by: user.email,
                        });

                    })
                    .catch(() => {
                        Swal.fire("Error!", "Failed to update status. Please try again.", "error");
                    });
            }
        });
    };

    // --- RENDER START ---

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
                <FaSpinner className="text-4xl animate-spin" style={{ color: PRIMARY_COLOR }} />
                <p className="text-lg text-gray-600 ml-3">Loading assigned deliveries...</p>
            </div>
        );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-l-8" style={{ borderColor: ACCENT_COLOR }}>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center" style={{ color: TEXT_SHADE }}>
                    <FaTasks className="mr-3 text-4xl" style={{ color: ACCENT_COLOR }} />
                    Pending Deliveries
                </h1>
                <p className="text-gray-600 mt-1">Update the status of parcels currently assigned to you.</p>
            </header>

            {parcels.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <FaMotorcycle className="text-6xl mx-auto mb-4" style={{ color: PRIMARY_COLOR }} />
                    <p className="text-xl font-semibold text-gray-600">You currently have no pending deliveries assigned.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
                    <table className="table w-full text-gray-700">
                        {/* Table Header */}
                        <thead className="text-white text-sm font-semibold uppercase tracking-wider" style={{ backgroundColor: TEXT_SHADE }}>
                            <tr>
                                <th className="rounded-tl-xl p-4">Tracking ID</th>
                                <th className="p-4">Title / Type</th>
                                <th className="p-4">Receiver & Center</th>
                                <th className="p-4">Cost (৳)</th>
                                <th className="p-4">Status</th>
                                <th className="rounded-tr-xl p-4">Action</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {parcels.map((parcel) => (
                                <tr
                                    key={parcel._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                >
                                    {/* Tracking ID */}
                                    <td>
                                        <div className="font-bold text-sm" style={{ color: TEXT_SHADE }}>{parcel.tracking_id}</div>
                                    </td>

                                    {/* Title / Type */}
                                    <td>
                                        <div className="text-sm font-medium">{parcel.title}</div>
                                        <div className="badge text-xs" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>{parcel.type}</div>
                                    </td>

                                    {/* Receiver & Center */}
                                    <td>
                                        <div className="text-sm font-semibold">{parcel.receiver_name}</div>
                                        <div className="text-xs flex items-center text-gray-500">
                                            <FaMapMarkerAlt className="mr-1" style={{ color: ACCENT_COLOR }} />
                                            {parcel.receiver_center}
                                        </div>
                                    </td>

                                    {/* Cost */}
                                    <td className="font-semibold" style={{ color: ACCENT_COLOR }}>৳{Number(parcel.cost).toFixed(2)}</td>

                                    {/* Status */}
                                    <td>
                                        <span
                                            className={`badge badge-lg text-xs font-bold capitalize text-white`}
                                            style={{ backgroundColor: parcel.delivery_status === 'rider_assigned' ? PRIMARY_COLOR : ACCENT_COLOR }}
                                        >
                                            {parcel.delivery_status.replace("_", " ")}
                                        </span>
                                    </td>

                                    {/* Action Button */}
                                    <td>
                                        {parcel.delivery_status === "rider_assigned" && (
                                            <button
                                                className="btn btn-sm text-white border-none shadow-md"
                                                style={{ backgroundColor: PRIMARY_COLOR }}
                                                onClick={() => handleStatusUpdate(parcel, "in_transit")}
                                                disabled={isUpdating}
                                            >
                                                <FaTruckLoading className="mr-1" /> Picked Up
                                            </button>
                                        )}
                                        {parcel.delivery_status === "in_transit" && (
                                            <button
                                                className="btn btn-sm text-white border-none shadow-md"
                                                style={{ backgroundColor: ACCENT_COLOR }}
                                                onClick={() => handleStatusUpdate(parcel, "delivered")}
                                                disabled={isUpdating}
                                            >
                                                <BsCheckCircleFill className="mr-1" /> Delivered
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

export default PendingDeliveries;