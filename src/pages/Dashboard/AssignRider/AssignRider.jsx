// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { FaMotorcycle } from "react-icons/fa";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { useState } from "react";
// import Swal from "sweetalert2";
// import useTrackingLogger from "../../../hooks/useTrackingLogger";
// import useAuth from "../../../hooks/useAuth";

// const AssignRider = () => {
//     const axiosSecure = useAxiosSecure();
//     const [selectedParcel, setSelectedParcel] = useState(null);
//     const [selectedRider, setSelectedRider] = useState(null);
//     const [riders, setRiders] = useState([]);
//     const [loadingRiders, setLoadingRiders] = useState(false);
//     const queryClient = useQueryClient();
//     const { logTracking } = useTrackingLogger();
//     const { user } = useAuth();

//     const { data: parcels = [], isLoading } = useQuery({
//         queryKey: ["assignableParcels"],
//         queryFn: async () => {
//             const res = await axiosSecure.get(
//                 "/parcels?payment_status=paid&delivery_status=not_collected"
//             );
//             // Sort oldest first
//             return res.data.sort(
//                 (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
//             );
//         },
//     });

//     const { mutateAsync: assignRider } = useMutation({
//         mutationFn: async ({ parcelId, rider }) => {
//             setSelectedRider(rider);
//             const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
//                 riderId: rider._id,
//                 riderEmail: rider.email,
//                 riderName: rider.name,
//             });
//             return res.data;
//         },
//         onSuccess: async () => {
//             queryClient.invalidateQueries(["assignableParcels"]);
//             Swal.fire("Success", "Rider assigned successfully!", "success");

//             // track rider assigned
//             await logTracking({
//                 tracking_id: selectedParcel.tracking_id,
//                 status: "rider_assigned",
//                 details: `Assigned to ${selectedRider.name}`,
//                 updated_by: user.email,
//             });
//             document.getElementById("assignModal").close();
//         },
//         onError: () => {
//             Swal.fire("Error", "Failed to assign rider", "error");
//         },
//     });

//     // Step 2: Open modal and load matching riders
//     const openAssignModal = async (parcel) => {
//         setSelectedParcel(parcel);
//         setLoadingRiders(true);
//         setRiders([]);

//         try {
//             const res = await axiosSecure.get("/riders/available", {
//                 params: {
//                     district: parcel.sender_center, // match with rider.district
//                 },
//             });
//             setRiders(res.data);
//         } catch (error) {
//             console.error("Error fetching riders", error);
//             Swal.fire("Error", "Failed to load riders", "error");
//         } finally {
//             setLoadingRiders(false);
//             document.getElementById("assignModal").showModal();
//         }
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>

//             {isLoading ? (
//                 <p>Loading parcels...</p>
//             ) : parcels.length === 0 ? (
//                 <p className="text-gray-500">No parcels available for assignment.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="table table-zebra w-full">
//                         <thead>
//                             <tr>
//                                 <th>Tracking ID</th>
//                                 <th>Title</th>
//                                 <th>Type</th>
//                                 <th>Sender Center</th>
//                                 <th>Receiver Center</th>
//                                 <th>Cost</th>
//                                 <th>Created At</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {parcels.map((parcel) => (
//                                 <tr key={parcel._id}>
//                                     <td>{parcel.tracking_id}</td>
//                                     <td>{parcel.title}</td>
//                                     <td>{parcel.type}</td>
//                                     <td>{parcel.sender_center}</td>
//                                     <td>{parcel.receiver_center}</td>
//                                     <td>৳{parcel.cost}</td>
//                                     <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
//                                     <td>
//                                         <button
//                                             onClick={() => openAssignModal(parcel)}
//                                             className="btn btn-sm btn-primary text-black">
//                                             <FaMotorcycle className="inline-block mr-1" />
//                                             Assign Rider
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {/* 🛵 Assign Rider Modal */}
//                     <dialog id="assignModal" className="modal">
//                         <div className="modal-box max-w-2xl">
//                             <h3 className="text-lg font-bold mb-3">
//                                 Assign Rider for Parcel:{" "}
//                                 <span className="text-primary">{selectedParcel?.title}</span>
//                             </h3>

//                             {loadingRiders ? (
//                                 <p>Loading riders...</p>
//                             ) : riders.length === 0 ? (
//                                 <p className="text-error">No available riders in this district.</p>
//                             ) : (
//                                 <div className="overflow-x-auto max-h-80 overflow-y-auto">
//                                     <table className="table table-sm">
//                                         <thead>
//                                             <tr>
//                                                 <th>Name</th>
//                                                 <th>Phone</th>
//                                                 <th>Bike Info</th>
//                                                 <th>Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {riders.map((rider) => (
//                                                 <tr key={rider._id}>
//                                                     <td>{rider.name}</td>
//                                                     <td>{rider.phone}</td>
//                                                     <td>
//                                                         {rider.bike_brand} - {rider.bike_registration}
//                                                     </td>
//                                                     <td>
//                                                         <button
//                                                             onClick={() =>
//                                                                 assignRider({
//                                                                     parcelId: selectedParcel._id,
//                                                                     rider,
//                                                                 })
//                                                             }
//                                                             className="btn btn-xs btn-success">
//                                                             Assign
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}

//                             <div className="modal-action">
//                                 <form method="dialog">
//                                     <button className="btn">Close</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </dialog>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AssignRider;


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaMotorcycle, FaTimes, FaUserCheck, FaSortAlphaDown, FaListUl, FaDollarSign } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Primary Button, Blue accent
const ACCENT_COLOR = '#F04C2B'; // Highlight, Header, Red accent
const TEXT_SHADE = '#03373D'; // Dark Text/Table Header

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [selectedRider, setSelectedRider] = useState(null);
    const [riders, setRiders] = useState([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const queryClient = useQueryClient();
    const { logTracking } = useTrackingLogger();
    const { user } = useAuth();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["assignableParcels"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/parcels?payment_status=paid&delivery_status=not_collected"
            );
            // Sort oldest first (FIFO - First In, First Out logic)
            return res.data.sort(
                (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
            );
        },
    });

    const { mutateAsync: assignRider, isPending: isAssigning } = useMutation({
        mutationFn: async ({ parcelId, rider }) => {
            // This is needed for the tracking log in onSuccess
            setSelectedRider(rider);
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId: rider._id,
                riderEmail: rider.email,
                riderName: rider.name,
            });
            return res.data;
        },
        onSuccess: async () => {
            // Log Tracking: use the *currently* assigned rider info from state
            if (selectedParcel && selectedRider) {
                await logTracking({
                    tracking_id: selectedParcel.tracking_id,
                    status: "rider_assigned",
                    details: `Assigned to ${selectedRider.name} (${selectedRider.email})`,
                    updated_by: user.email,
                });
            }

            queryClient.invalidateQueries(["assignableParcels"]);
            Swal.fire("Success", "Rider assigned successfully!", "success");

            // Close the modal and clear states
            document.getElementById("assignModal").close();
            setSelectedParcel(null);
            setSelectedRider(null);
            setRiders([]); // Clear rider list for the next time
        },
        onError: (error) => {
            console.error("Assignment Error:", error);
            Swal.fire("Error", error.response?.data?.message || "Failed to assign rider. Please try again.", "error");
        },
    });

    // Step 1: Define the missing handleCancel function
    const handleCancel = () => {
        // Clear the temporary states used in the modal
        setSelectedParcel(null);
        setSelectedRider(null);
        setRiders([]);
        // The dialog automatically closes via the 'form method="dialog"' but we ensure state is clean
    };


    // Step 2: Open modal and load matching riders
    const openAssignModal = async (parcel) => {
        setSelectedParcel(parcel);
        setLoadingRiders(true);
        setRiders([]);

        try {
            const res = await axiosSecure.get("/riders/available", {
                params: {
                    district: parcel.sender_center, // Match riders with the parcel's source district
                },
            });
            setRiders(res.data);
        } catch (error) {
            console.error("Error fetching riders", error);
            Swal.fire("Error", "Failed to load riders for this district.", "error");
        } finally {
            setLoadingRiders(false);
            // Show modal after data fetch attempts are complete
            document.getElementById("assignModal").showModal();
        }
    };

    // Helper function for date formatting
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // --- RENDER START ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4" style={{ borderBottomColor: ACCENT_COLOR }}>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center" style={{ color: TEXT_SHADE }}>
                    <FaMotorcycle className="mr-3 text-4xl" style={{ color: PRIMARY_COLOR }} />
                    Assign Parcel Delivery Riders
                </h1>
                <p className="text-gray-600 mt-1">Review and assign the oldest paid and uncollected parcels to available riders.</p>
            </header>

            {parcels.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <FaListUl className="text-6xl mx-auto mb-4" style={{ color: ACCENT_COLOR }} />
                    <p className="text-xl font-semibold text-gray-600">No assignable parcels available.</p>
                    <p className="text-gray-500 mt-2">All paid parcels have either been assigned or collected.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
                    <table className="table w-full text-gray-700">
                        {/* Table Header */}
                        <thead className="text-white text-base font-semibold uppercase tracking-wider" style={{ backgroundColor: TEXT_SHADE }}>
                            <tr>
                                <th className="rounded-tl-xl p-4">#</th>
                                <th className="p-4">Tracking ID</th>
                                <th className="p-4">Title / Type</th>
                                <th className="p-4">Source Center</th>
                                <th className="p-4">Destination Center</th>
                                <th className="p-4">Cost</th>
                                <th className="p-4 flex items-center">
                                    <FaSortAlphaDown className="mr-1" /> Booked Date
                                </th>
                                <th className="rounded-tr-xl p-4">Action</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {parcels.map((parcel, index) => (
                                <tr
                                    key={parcel._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="font-medium text-gray-600">{index + 1}</td>
                                    <td className="font-mono text-sm">{parcel.tracking_id}</td>
                                    <td>
                                        <div className="font-semibold" style={{ color: ACCENT_COLOR }}>
                                            {parcel.title}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">{parcel.type}</div>
                                    </td>
                                    <td>{parcel.sender_center}</td>
                                    <td>{parcel.receiver_center}</td>
                                    <td className="font-bold flex items-center" style={{ color: PRIMARY_COLOR }}>
                                        <FaDollarSign className="w-3 h-3 mr-1" />{parcel.cost ? parcel.cost.toFixed(2) : 'N/A'}
                                    </td>
                                    <td className="text-sm text-gray-600">{formatDate(parcel.creation_date)}</td>
                                    <td>
                                        <button
                                            onClick={() => openAssignModal(parcel)}
                                            className="btn btn-sm text-white border-none transition duration-150 shadow-lg"
                                            style={{ backgroundColor: PRIMARY_COLOR, hover: { backgroundColor: '#0A4A87' } }}
                                        >
                                            <FaMotorcycle className="inline-block mr-1" />
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 🛵 Assign Rider Modal */}
            <dialog id="assignModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-3xl bg-white rounded-xl shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: ACCENT_COLOR }}>
                        <FaUserCheck className="inline-block mr-2" />
                        Assign Rider
                    </h3>
                    <p className="mb-4 text-gray-600">
                        **Parcel:** <span className="font-semibold" style={{ color: TEXT_SHADE }}>{selectedParcel?.title}</span> (Source: {selectedParcel?.sender_center})
                    </p>

                    {/* Rider List Area */}
                    {loadingRiders ? (
                        <div className="text-center p-8">
                            <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
                            <p className="text-gray-500 mt-2">Loading available riders...</p>
                        </div>
                    ) : riders.length === 0 ? (
                        <div className="text-center p-8 bg-red-50 border-l-4 border-red-400 rounded-lg">
                            <p className="text-red-600 font-semibold">
                                No available riders found in the **{selectedParcel?.sender_center}** district.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg shadow-inner">
                            <table className="table w-full table-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr style={{ color: TEXT_SHADE }}>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Bike Info</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riders.map((rider) => (
                                        <tr key={rider._id} className="hover:bg-blue-50/50 transition duration-150">
                                            <td className="font-medium">{rider.name}</td>
                                            <td className="text-sm text-gray-600">{rider.phone}</td>
                                            <td className="text-xs text-gray-500">
                                                {rider.bike_brand} - <span className="font-mono">{rider.bike_registration}</span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        assignRider({
                                                            parcelId: selectedParcel._id,
                                                            rider,
                                                        })
                                                    }
                                                    className={`btn btn-xs text-white border-none ${isAssigning ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                                                    disabled={isAssigning}
                                                >
                                                    {isAssigning ? 'Assigning...' : 'Assign'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Modal Close Action */}
                    <div className="modal-action mt-6">
                        <form method="dialog">
                            {/* 🎯 Updated button to use the new handleCancel */}
                            <button
                                onClick={handleCancel}
                                className="btn btn-outline border-gray-300 hover:bg-gray-100 flex items-center"
                                style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                                disabled={isAssigning}
                            >
                                <FaTimes className="mr-1" /> Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignRider;