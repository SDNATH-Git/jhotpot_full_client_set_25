// import { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FaSearch, FaUserShield, FaUserTimes } from "react-icons/fa";
// import Swal from "sweetalert2";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

// const MakeAdmin = () => {
//     const axiosSecure = useAxiosSecure();
//     const [emailQuery, setEmailQuery] = useState("");

//     const {
//         data: users = [],
//         refetch,
//         isFetching,
//     } = useQuery({
//         queryKey: ["searchedUsers", emailQuery],
//         enabled: !!emailQuery,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/users/search?email=${emailQuery}`);
//             return res.data;
//         },
//     });

//     const { mutateAsync: updateRole } = useMutation({
//         mutationFn: async ({ id, role }) =>
//             await axiosSecure.patch(`/users/${id}/role`, { role }),
//         onSuccess: () => {
//             refetch();
//         },
//     });

//     const handleRoleChange = async (id, currentRole) => {
//         const action = currentRole === "admin" ? "Remove admin" : "Make admin";
//         const newRole = currentRole === "admin" ? "user" : "admin";

//         const confirm = await Swal.fire({
//             title: `${action}?`,
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonText: "Yes",
//             cancelButtonText: "Cancel",
//         });

//         if (!confirm.isConfirmed) return;

//         try {
//             await updateRole({ id, role: newRole });
//             Swal.fire("Success", `${action} successful`, "success");
//         } catch (error) {
//             console.log(error);
//             Swal.fire("Error", "Failed to update user role", "error");
//         }
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-semibold mb-4">Make Admin</h2>

//             <div className="flex gap-2 mb-6 items-center">
//                 <FaSearch />
//                 <input
//                     type="text"
//                     className="input input-bordered w-full max-w-md"
//                     placeholder="Search user by email"
//                     value={emailQuery}
//                     onChange={(e) => setEmailQuery(e.target.value)}
//                 />
//             </div>

//             {isFetching && <p>Loading users...</p>}

//             {!isFetching && users.length === 0 && emailQuery && (
//                 <p className="text-gray-500">No users found.</p>
//             )}

//             {users.length > 0 && (
//                 <div className="overflow-x-auto">
//                     <table className="table w-full table-zebra">
//                         <thead>
//                             <tr>
//                                 <th>Email</th>
//                                 <th>Created At</th>
//                                 <th>Role</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((u) => (
//                                 <tr key={u._id}>
//                                     <td>{u.email}</td>
//                                     <td>{new Date(u.created_at).toLocaleDateString()}</td>
//                                     <td>
//                                         <span
//                                             className={`badge ${u.role === "admin" ? "badge-success" : "badge-ghost"
//                                                 }`}
//                                         >
//                                             {u.role || "user"}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <button
//                                             onClick={() => handleRoleChange(u._id, u.role || "user")}
//                                             className={`btn btn-sm text-black ${u.role === "admin" ? "btn-error" : "btn-primary"
//                                                 }`}
//                                         >
//                                             {u.role === "admin" ? (
//                                                 <>
//                                                     <FaUserTimes className="mr-1" />
//                                                     Remove Admin
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <FaUserShield className="mr-1" />
//                                                     Make Admin
//                                                 </>
//                                             )}
//                                         </button>
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

// export default MakeAdmin;





import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield, FaUserTimes, FaUserCog } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Blue accent (Make Admin, search border)
const ACCENT_COLOR = '#F04C2B'; // Red/Orange accent (Remove Admin, highlights)
const TEXT_SHADE = '#03373D'; // Dark Text/Table Header

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [emailQuery, setEmailQuery] = useState("");

    // Helper function for date formatting
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // Query to fetch user based on emailQuery
    const {
        data: users = [],
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["searchedUsers", emailQuery],
        // Only run the query if emailQuery is not empty
        enabled: !!emailQuery.trim(),
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/search?email=${emailQuery.trim()}`);
            return res.data;
        },
    });

    // Mutation to update user role
    const { mutateAsync: updateRole, isPending: isUpdatingRole } = useMutation({
        mutationFn: async ({ id, role }) =>
            await axiosSecure.patch(`/users/${id}/role`, { role }),
        onSuccess: () => {
            refetch();
        },
    });

    // Handle role change (Make Admin / Remove Admin)
    const handleRoleChange = async (id, currentRole) => {
        const isCurrentlyAdmin = currentRole === "admin";
        const action = isCurrentlyAdmin ? "Remove Admin" : "Make Admin";
        const newRole = isCurrentlyAdmin ? "user" : "admin";
        const buttonColor = isCurrentlyAdmin ? ACCENT_COLOR : PRIMARY_COLOR;

        const confirm = await Swal.fire({
            title: `${action}?`,
            text: `Are you sure you want to ${action.toLowerCase()} this user?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: buttonColor,
            cancelButtonColor: '#777',
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await updateRole({ id, role: newRole });
            Swal.fire("Success", `${action} successful. Role updated to **${newRole}**`, "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update user role. Check server permissions.", "error");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4" style={{ borderBottomColor: PRIMARY_COLOR }}>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center" style={{ color: TEXT_SHADE }}>
                    <FaUserCog className="mr-3 text-4xl" style={{ color: PRIMARY_COLOR }} />
                    Manage User Roles
                </h1>
                <p className="text-gray-600 mt-1">Search users by email to grant or revoke administrative privileges.</p>
            </header>


            {/* 🔍 Search Field */}
            <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D5EA6] focus:border-transparent transition shadow-sm"
                        style={{ borderColor: PRIMARY_COLOR }}
                        placeholder="Enter user email to search..."
                        value={emailQuery}
                        onChange={(e) => setEmailQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* 🌀 Loading/Empty State */}
            {isFetching && (
                <div className="text-center p-10">
                    <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
                    <p className="text-gray-600 mt-2">Searching for user...</p>
                </div>
            )}

            {!isFetching && emailQuery.trim() && users.length === 0 && (
                <div className="text-center p-10 bg-white rounded-xl shadow-md border-l-4 border-gray-400">
                    <p className="text-xl font-semibold text-gray-600">
                        No user found with the email: **{emailQuery.trim()}**
                    </p>
                    <p className="text-gray-500 mt-2">Please check the spelling and try again.</p>
                </div>
            )}

            {/* 📊 User Table */}
            {users.length > 0 && (
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
                    <table className="table w-full text-gray-700">
                        {/* Table Header */}
                        <thead className="text-white text-base font-semibold uppercase tracking-wider" style={{ backgroundColor: TEXT_SHADE }}>
                            <tr>
                                <th className="rounded-tl-xl p-4">Email</th>
                                <th className="p-4">Account Created</th>
                                <th className="p-4">Current Role</th>
                                <th className="rounded-tr-xl p-4">Action</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                >
                                    {/* Email */}
                                    <td className="font-mono text-sm" style={{ color: PRIMARY_COLOR }}>{u.email}</td>

                                    {/* Created At */}
                                    <td className="text-sm text-gray-600">
                                        {formatDate(u.created_at)}
                                    </td>

                                    {/* Role */}
                                    <td>
                                        <span
                                            className={`badge text-white font-semibold ${u.role === "admin" ? "bg-green-500" : "bg-gray-400"}`}
                                            style={u.role === "admin" ? {} : { backgroundColor: TEXT_SHADE, color: '#fff' }}
                                        >
                                            {u.role || "user"}
                                        </span>
                                    </td>

                                    {/* Action Button */}
                                    <td>
                                        <button
                                            onClick={() => handleRoleChange(u._id, u.role || "user")}
                                            className={`btn btn-sm text-white border-none shadow-md transition duration-150 ${u.role === "admin" ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
                                            style={{ backgroundColor: u.role === "admin" ? ACCENT_COLOR : PRIMARY_COLOR }}
                                            disabled={isUpdatingRole}
                                        >
                                            {u.role === "admin" ? (
                                                <>
                                                    <FaUserTimes className="mr-1" />
                                                    Remove Admin
                                                </>
                                            ) : (
                                                <>
                                                    <FaUserShield className="mr-1" />
                                                    Make Admin
                                                </>
                                            )}
                                        </button>
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

export default MakeAdmin;



