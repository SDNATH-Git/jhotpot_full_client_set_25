// import { useState } from "react";
// import Swal from "sweetalert2";
// import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { useQuery } from "@tanstack/react-query";

// const PendingRiders = () => {
//     const [selectedRider, setSelectedRider] = useState(null);
//     const axiosSecure = useAxiosSecure();

//     const { isPending, data: riders = [], refetch } = useQuery({
//         queryKey: ['pending-riders'],
//         queryFn: async () => {
//             const res = await axiosSecure.get("/riders/pending");
//             return res.data;
//         }
//     })

//     if (isPending) {
//         return '...loading'
//     }

//     const handleDecision = async (id, action, email) => {
//         const confirm = await Swal.fire({
//             title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes",
//             cancelButtonText: "Cancel",
//         });

//         if (!confirm.isConfirmed) return;

//         try {
//             const status = action === "approve" ? "active" : "rejected"
//             await axiosSecure.patch(`/riders/${id}/status`, {
//                 status,
//                 email
//             });

//             refetch();

//             Swal.fire("Success", `Rider ${action}d successfully`, "success");

//         } catch (err) {
//             Swal.fire("Error", "Could not update rider status", err);
//         }
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-semibold mb-4">Pending Rider Applications</h2>

//             <div className="overflow-x-auto">
//                 <table className="table table-zebra w-full">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Region</th>
//                             <th>District</th>
//                             <th>Phone</th>
//                             <th>Applied</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {riders.map((rider) => (
//                             <tr key={rider._id}>
//                                 <td>{rider.name}</td>
//                                 <td>{rider.email}</td>
//                                 <td>{rider.region}</td>
//                                 <td>{rider.district}</td>
//                                 <td>{rider.phone}</td>
//                                 <td>{new Date(rider.created_at).toLocaleDateString()}</td>
//                                 <td className="flex gap-2">
//                                     <button
//                                         onClick={() => setSelectedRider(rider)}
//                                         className="btn btn-sm btn-info"
//                                     >
//                                         <FaEye />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDecision(rider._id, "approve", rider.email)}
//                                         className="btn btn-sm btn-success"
//                                     >
//                                         <FaCheck />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDecision(rider._id, "reject", rider.email)}
//                                         className="btn btn-sm btn-error"
//                                     >
//                                         <FaTimes />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modal for viewing rider details */}
//             {selectedRider && (
//                 <dialog id="riderDetailsModal" className="modal modal-open">
//                     <div className="modal-box max-w-2xl">
//                         <h3 className="font-bold text-xl mb-2">Rider Details</h3>
//                         <div className="space-y-2">
//                             <p><strong>Name:</strong> {selectedRider.name}</p>
//                             <p><strong>Email:</strong> {selectedRider.email}</p>
//                             <p><strong>Phone:</strong> {selectedRider.phone}</p>
//                             <p><strong>Age:</strong> {selectedRider.age}</p>
//                             <p><strong>NID:</strong> {selectedRider.nid}</p>
//                             <p><strong>Bike Brand:</strong> {selectedRider.bike_brand}</p>
//                             <p><strong>Bike Registration:</strong> {selectedRider.bike_registration}</p>
//                             <p><strong>Region:</strong> {selectedRider.region}</p>
//                             <p><strong>District:</strong> {selectedRider.district}</p>
//                             <p><strong>Applied At:</strong> {new Date(selectedRider.created_at).toLocaleString()}</p>
//                             {selectedRider.note && <p><strong>Note:</strong> {selectedRider.note}</p>}
//                         </div>

//                         <div className="modal-action mt-4">
//                             <button
//                                 className="btn btn-outline"
//                                 onClick={() => setSelectedRider(null)}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </dialog>
//             )}
//         </div>
//     );
// };

// export default PendingRiders;



import { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes, FaUserClock, FaMotorcycle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Blue accent (Approve button, main accents)
const ACCENT_COLOR = '#F04C2B'; // Red/Orange accent (Reject button, highlights)
const TEXT_SHADE = '#03373D'; // Dark Text/Table Header

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();

    // Helper function to format date
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        }
    })

    const handleDecision = async (id, action, email) => {
        const titleText = action === "approve" ? "Approve Application?" : "Reject Application?";
        const confirmText = action === "approve" ? "Yes, Approve" : "Yes, Reject";
        const confirmButtonColor = action === "approve" ? PRIMARY_COLOR : ACCENT_COLOR;

        const confirm = await Swal.fire({
            title: titleText,
            text: `This will permanently ${action} the rider application.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: '#777',
            confirmButtonText: confirmText,
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status = action === "approve" ? "active" : "rejected"
            await axiosSecure.patch(`/riders/${id}/status`, {
                status,
                email
            });

            refetch();
            Swal.fire("Success", `Rider application successfully ${action}d.`, "success");

        } catch (err) {
            console.error("Rider Status Update Error:", err);
            Swal.fire("Error", "Could not update rider status. Please check connectivity or permissions.", "error");
        }
    };

    // Handler to open modal and attach close logic
    const openDetailsModal = (rider) => {
        setSelectedRider(rider);
        document.getElementById('riderDetailsModal').showModal();
    }
    // Handler to close modal
    const closeDetailsModal = () => {
        setSelectedRider(null);
        document.getElementById('riderDetailsModal').close();
    }


    // --- RENDER START ---

    if (isPending) {
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
                    <FaUserClock className="mr-3 text-4xl" style={{ color: ACCENT_COLOR }} />
                    Pending Rider Applications
                </h1>
                <p className="text-gray-600 mt-1">Review and manage all new rider applications awaiting approval.</p>
            </header>

            {riders.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <FaMotorcycle className="text-6xl mx-auto mb-4" style={{ color: PRIMARY_COLOR }} />
                    <p className="text-xl font-semibold text-gray-600">No pending rider applications at this moment.</p>
                    <p className="text-gray-500 mt-2">Check back later for new submissions.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
                    <table className="table w-full text-gray-700">
                        {/* Table Header */}
                        <thead className="text-white text-base font-semibold uppercase tracking-wider" style={{ backgroundColor: TEXT_SHADE }}>
                            <tr>
                                <th className="rounded-tl-xl p-4">Name</th>
                                <th className="p-4">Email / Phone</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Applied</th>
                                <th className="rounded-tr-xl p-4">Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {riders.map((rider) => (
                                <tr
                                    key={rider._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                >
                                    {/* Name */}
                                    <td className="font-bold" style={{ color: TEXT_SHADE }}>{rider.name}</td>

                                    {/* Email / Phone */}
                                    <td>
                                        <div className="text-sm">{rider.email}</div>
                                        <div className="text-xs text-gray-500">{rider.phone}</div>
                                    </td>

                                    {/* Location */}
                                    <td>
                                        <div className="font-medium text-gray-700">{rider.district}</div>
                                        <div className="text-xs text-gray-500">{rider.region}</div>
                                    </td>

                                    {/* Applied Date */}
                                    <td className="text-sm text-gray-600">{formatDate(rider.created_at)}</td>

                                    {/* Actions */}
                                    <td className="flex gap-2">
                                        {/* View Details Button */}
                                        <button
                                            onClick={() => openDetailsModal(rider)}
                                            className="btn btn-sm text-white border-none shadow-md"
                                            style={{ backgroundColor: PRIMARY_COLOR, hover: { backgroundColor: '#0A4A87' } }}
                                        >
                                            <FaEye />
                                        </button>
                                        {/* Approve Button */}
                                        <button
                                            onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                            className="btn btn-sm text-white border-none shadow-md bg-green-500 hover:bg-green-600"
                                        >
                                            <FaCheck />
                                        </button>
                                        {/* Reject Button */}
                                        <button
                                            onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                            className="btn btn-sm text-white border-none shadow-md"
                                            style={{ backgroundColor: ACCENT_COLOR, hover: { backgroundColor: '#C03A22' } }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Modal for viewing rider details */}
            <dialog id="riderDetailsModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl bg-white rounded-xl shadow-2xl">
                    <h3 className="font-bold text-2xl mb-4" style={{ color: ACCENT_COLOR }}>
                        <FaMotorcycle className="inline-block mr-2" /> Rider Full Application Details
                    </h3>

                    {selectedRider ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 border rounded-lg bg-gray-50">
                            <DetailItem label="Full Name" value={selectedRider.name} />
                            <DetailItem label="Email" value={selectedRider.email} />
                            <DetailItem label="Phone" value={selectedRider.phone} />
                            <DetailItem label="Age" value={selectedRider.age} />
                            <DetailItem label="NID/ID" value={selectedRider.nid} />
                            <DetailItem label="Applied On" value={new Date(selectedRider.created_at).toLocaleString()} />
                            <DetailItem label="Bike Brand" value={selectedRider.bike_brand} />
                            <DetailItem label="Bike Reg. No." value={selectedRider.bike_registration} />
                            <DetailItem label="Region" value={selectedRider.region} />
                            <DetailItem label="District" value={selectedRider.district} />

                            {selectedRider.note && (
                                <div className="col-span-2 mt-2 p-3 bg-blue-100 rounded-lg border-l-4 border-blue-500">
                                    <strong className="text-sm" style={{ color: PRIMARY_COLOR }}>Rider Note:</strong> {selectedRider.note}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Details loading...</p>
                    )}

                    <div className="modal-action mt-6">
                        <form method="dialog" onSubmit={(e) => { e.preventDefault(); closeDetailsModal(); }}>
                            <button
                                type="submit"
                                className="btn btn-outline border-gray-300 hover:bg-gray-100 flex items-center"
                                style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

// Helper Component for Modal Details
const DetailItem = ({ label, value }) => (
    <div>
        <strong className="text-xs uppercase text-gray-500">{label}:</strong>
        <p className="font-medium" style={{ color: TEXT_SHADE }}>{value}</p>
    </div>
);

export default PendingRiders;