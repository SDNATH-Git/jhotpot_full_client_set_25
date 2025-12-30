// import { useQuery } from '@tanstack/react-query';
// import React from 'react';
// import useAuth from '../../../hooks/useAuth';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router';

// const MyParcels = () => {
//     const { user } = useAuth();
//     const axiosSecure = useAxiosSecure();
//     const navigate = useNavigate();

//     const { data: parcels = [], refetch } = useQuery({
//         queryKey: ['my-parcels', user.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/parcels?email=${user.email}`);
//             return res.data;
//         }
//     })

//     console.log(parcels);

//     const handleView = (id) => {
//         console.log("View parcel", id);
//         // You could open a modal or navigate to a detail page
//     };

//     const handlePay = (id) => {
//         console.log("Proceed to payment for", id);
//         navigate(`/dashboard/payment/${id}`)
//     };

//     const handleDelete = async (id) => {
//         const confirm = await Swal.fire({
//             title: "Are you sure?",
//             text: "This parcel will be permanently deleted!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes, delete it",
//             cancelButtonText: "Cancel",
//             confirmButtonColor: "#e11d48", // red-600
//             cancelButtonColor: "#6b7280",  // gray-500
//         });
//         if (confirm.isConfirmed) {
//             try {

//                 axiosSecure.delete(`/parcels/${id}`)
//                     .then(res => {
//                         console.log(res.data);
//                         if (res.data.deletedCount) {
//                             Swal.fire({
//                                 title: "Deleted!",
//                                 text: "Parcel has been deleted.",
//                                 icon: "success",
//                                 timer: 1500,
//                                 showConfirmButton: false,
//                             });
//                         }
//                         refetch();
//                     })


//             } catch (err) {
//                 Swal.fire("Error", err.message || "Failed to delete parcel", "error");
//             }
//         }
//     };

//     const formatDate = (iso) => {
//         return new Date(iso).toLocaleString(); // Format: "6/22/2025, 3:11:31 AM"
//     };

//     return (
//         <div className="overflow-x-auto shadow-md rounded-xl">
//             <table className="table table-zebra w-full">
//                 <thead className="bg-base-200 text-base font-semibold">
//                     <tr>
//                         <th>#</th>
//                         <th>Title</th>
//                         <th>Type</th>
//                         <th>Created At</th>
//                         <th>Cost</th>
//                         <th>Payment</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {parcels.map((parcel, index) => (
//                         <tr key={parcel._id}>
//                             <td>{index + 1}</td>
//                             <td className="max-w-[180px] truncate">{parcel.title}</td>
//                             <td className="capitalize">{parcel.type}</td>
//                             <td>{formatDate(parcel.creation_date)}</td>
//                             <td>৳{parcel.cost}</td>
//                             <td>
//                                 <span
//                                     className={`badge ${parcel.payment_status === "paid"
//                                         ? "badge-success"
//                                         : "badge-error"
//                                         }`}
//                                 >
//                                     {parcel.payment_status}
//                                 </span>
//                             </td>
//                             <td className="space-x-2">
//                                 <button
//                                     onClick={() => handleView(parcel._id)}
//                                     className="btn btn-xs btn-outline"
//                                 >
//                                     View
//                                 </button>
//                                 {parcel.payment_status === "unpaid" && (
//                                     <button
//                                         onClick={() => handlePay(parcel._id)}
//                                         className="btn btn-xs btn-primary text-black"
//                                     >
//                                         Pay
//                                     </button>
//                                 )}
//                                 <button
//                                     onClick={() => handleDelete(parcel._id)}
//                                     className="btn btn-xs btn-error"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                     {parcels.length === 0 && (
//                         <tr>
//                             <td colSpan="6" className="text-center text-gray-500 py-6">
//                                 No parcels found.
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default MyParcels;



import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { FaEye, FaCreditCard, FaEdit, FaTimesCircle, FaBoxOpen } from 'react-icons/fa';

// --- কাস্টম কালার ক্লাস ---
const PRIMARY_COLOR = '#F04C2B';
const SECONDARY_COLOR = '#0D5EA6';
const ACCENT_COLOR = '#03373D';

const MyParcels = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: parcels = [], refetch, isLoading, isError } = useQuery({
        queryKey: ['my-parcels', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    // --- অ্যাকশন হ্যান্ডলার্স ---

    const handleView = (id) => {
        Swal.fire({
            title: "Parcel Details",
            text: `Navigating to detail page for ID: ${id}`,
            icon: "info",
            timer: 1500,
            showConfirmButton: false
        });
    };

    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`);
    };

    const handleEdit = (parcel) => {
        if (parcel.status === 'not_collected') {
            navigate(`/dashboard/update-parcel/${parcel._id}`);
        } else {
            Swal.fire("Restriction", "Only parcels with 'Not Collected' status can be edited.", "warning");
        }
    };

    const handleCancel = async (parcel) => {
        if (parcel.status !== 'not_collected') {
            Swal.fire("Restriction", "Only parcels with 'Not Collected' status can be cancelled.", "warning");
            return;
        }

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will cancel your parcel booking.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it",
            cancelButtonText: "No, keep it",
            confirmButtonColor: PRIMARY_COLOR,
            cancelButtonColor: '#6b7280',
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/parcels/cancel/${parcel._id}`);

                if (res.data.modifiedCount) {
                    Swal.fire({
                        title: "Cancelled!",
                        text: "Parcel booking has been cancelled.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    refetch();
                } else {
                    Swal.fire("Error", "Could not cancel the parcel. Status might have changed.", "error");
                }
            } catch (err) {
                Swal.fire("Error", err.message || "Failed to cancel parcel", "error");
            }
        }
    };

    const formatDate = (iso) => {
        if (!iso) return "N/A";
        return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // --- রেন্ডারিং স্টেটস ---

    if (loading || isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span></div>;
    }

    if (isError) {
        return <div className="text-center text-red-600 mt-10">Error loading parcels. Please try again.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: ACCENT_COLOR }}>
                📦 My Parcel Bookings ({parcels.length})
            </h1>

            <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100">
                <table className="table w-full">
                    <thead className="text-white text-base font-semibold" style={{ backgroundColor: ACCENT_COLOR }}>
                        <tr>
                            <th className="rounded-tl-xl">#</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Booking Date</th>
                            <th>Cost (৳)</th>
                            <th>Payment</th>
                            <th className="rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-6 text-lg">
                                    <FaBoxOpen className="inline-block text-3xl mr-2" /> You have no active parcel bookings.
                                </td>
                            </tr>
                        ) : (
                            parcels.map((parcel, index) => {

                                // ✅ সমাধান: parcel.status undefined হলে 'unknown_status' ব্যবহার করা
                                const currentStatus = parcel.status || 'unknown_status';
                                const status = currentStatus.replace(/_/g, ' ');

                                // ডেলিভারি স্ট্যাটাসের জন্য রং ও লেবেল
                                const statusColor = currentStatus === 'delivered' ? 'bg-emerald-500'
                                    : currentStatus === 'cancelled' ? 'bg-red-500'
                                        : currentStatus === 'not_collected' ? 'bg-gray-400'
                                            : 'bg-amber-500';

                                // অ্যাকশন ডিসেবলিং লজিক
                                const isActionDisabled = currentStatus !== 'not_collected';
                                const isPayDisabled = parcel.payment_status === 'paid';

                                return (
                                    <tr key={parcel._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="font-medium text-gray-600">{index + 1}</td>
                                        <td className="max-w-[200px] truncate font-medium text-gray-700">{parcel.title || 'N/A'}</td>
                                        <td>
                                            <span
                                                className={`badge badge-lg text-white font-semibold capitalize ${statusColor}`}
                                                style={{ boxShadow: `0 2px 4px rgba(0,0,0,0.1)` }}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                        <td>{formatDate(parcel.creation_date)}</td>
                                        <td className="font-extrabold" style={{ color: PRIMARY_COLOR }}>
                                            ৳{parcel.cost ? parcel.cost.toFixed(2) : '0.00'}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge badge-lg font-semibold ${isPayDisabled ? "text-white" : "text-black"}`}
                                                style={{
                                                    backgroundColor: isPayDisabled ? SECONDARY_COLOR : '#FCD34D',
                                                    color: isPayDisabled ? 'white' : ACCENT_COLOR
                                                }}
                                            >
                                                {parcel.payment_status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="space-x-1 flex items-center h-full">
                                            {/* View Button */}
                                            <button
                                                onClick={() => handleView(parcel._id)}
                                                className="btn btn-sm text-gray-700 bg-gray-200 hover:bg-gray-300 border-none transition duration-150 tooltip"
                                                data-tip="View Details"
                                            >
                                                <FaEye />
                                            </button>

                                            {/* Pay Button */}
                                            {!isPayDisabled && (
                                                <button
                                                    onClick={() => handlePay(parcel._id)}
                                                    className="btn btn-sm text-white border-none transition duration-150 tooltip"
                                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                                    data-tip="Proceed to Payment"
                                                >
                                                    <FaCreditCard />
                                                </button>
                                            )}

                                            {/* Edit Button (Only if not_collected) */}
                                            <button
                                                onClick={() => handleEdit(parcel)}
                                                disabled={isActionDisabled}
                                                className="btn btn-sm btn-warning text-white border-none transition duration-150 tooltip"
                                                data-tip={isActionDisabled ? "Cannot Edit (Status Changed)" : "Edit Booking"}
                                            >
                                                <FaEdit />
                                            </button>

                                            {/* Cancel Button (Only if not_collected) */}
                                            <button
                                                onClick={() => handleCancel(parcel)}
                                                disabled={isActionDisabled}
                                                className="btn btn-sm btn-error text-white border-none transition duration-150 tooltip"
                                                data-tip={isActionDisabled ? "Cannot Cancel (Status Changed)" : "Cancel Booking"}
                                            >
                                                <FaTimesCircle />
                                            </button>

                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyParcels;

