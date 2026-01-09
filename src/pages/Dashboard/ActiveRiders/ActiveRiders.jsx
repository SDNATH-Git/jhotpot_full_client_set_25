

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash, FaMotorcycle, FaUsers } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Blue accent
const ACCENT_COLOR = '#F04C2B'; // Red/Orange accent
const TEXT_SHADE = '#03373D'; // Dark Text/Table Header

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  // 🟡 Load Active Riders with React Query
  const { data: riders = [], isLoading, refetch, error } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // 🔴 Handle Deactivation
  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Deactivate this rider?",
      text: "The rider's status will be set to 'Deactivated' and they will not receive new assignments.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: ACCENT_COLOR, // Using the custom accent color for confirmation
      cancelButtonColor: PRIMARY_COLOR,
      confirmButtonText: "Yes, Deactivate",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/${id}/status`, { status: "deactivated" });
      Swal.fire("Done", "Rider has been successfully deactivated.", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to deactivate rider. Please check server logs.", "error");
    }
  };

  // 🔎 Filtered List
  const filteredRiders = riders.filter((rider) =>
    rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4" style={{ borderBottomColor: PRIMARY_COLOR }}>
        <h1 className="text-2xl md:text-4xl font-extrabold flex items-center" style={{ color: TEXT_SHADE }}>
          <FaMotorcycle className="mr-3 text-4xl" style={{ color: ACCENT_COLOR }} />
          Active Delivery Riders
        </h1>
        <p className="text-gray-600 mt-1">
          Currently active riders available for new assignments: **{riders.length}**
        </p>
      </header>

      {/* 🔍 Search Field */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by Name, Email, or District..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D5EA6] focus:border-transparent transition shadow-sm"
            style={{ borderColor: PRIMARY_COLOR }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 🌀 Loading/Error/Empty State */}
      {isLoading && (
        <div className="text-center p-10">
          <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
          <p className="text-gray-600 mt-2">Loading active riders...</p>
        </div>
      )}
      {error && <p className="text-center text-red-600 p-6 bg-red-100 rounded-lg">Failed to load riders: {error.message}</p>}

      {!isLoading && !error && filteredRiders.length === 0 && (
        <div className="text-center p-10 bg-white rounded-xl shadow-md">
          <FaUsers className="text-6xl mx-auto mb-4" style={{ color: ACCENT_COLOR }} />
          <p className="text-xl font-semibold text-gray-600">
            {riders.length > 0 ? "No matching riders found." : "No active riders currently available."}
          </p>
        </div>
      )}

      {/* 📊 Rider Table */}
      {!isLoading && !error && filteredRiders.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
          <table className="table w-full text-gray-700">
            {/* Table Header */}
            <thead className="text-white text-base font-semibold uppercase tracking-wider" style={{ backgroundColor: TEXT_SHADE }}>
              <tr>
                <th className="rounded-tl-xl p-4">Name & Contact</th>
                <th className="p-4">Region/District</th>
                <th className="p-4">Bike Details</th>
                <th className="p-4">Status</th>
                <th className="rounded-tr-xl p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => (
                <tr
                  key={rider._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                >
                  {/* Name & Contact */}
                  <td>
                    <div className="font-bold" style={{ color: PRIMARY_COLOR }}>{rider.name}</div>
                    <div className="text-sm text-gray-500">{rider.email}</div>
                    <div className="text-xs text-gray-400">Phone: {rider.phone}</div>
                  </td>

                  {/* Region/District */}
                  <td>
                    <div className="font-medium text-gray-700">{rider.district}</div>
                    <div className="text-xs text-gray-500">{rider.region}</div>
                  </td>

                  {/* Bike Details */}
                  <td className="text-sm text-gray-600">
                    {rider.bike_brand}
                    <div className="text-xs font-mono text-gray-500">
                      Reg: {rider.bike_registration}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="badge text-white font-semibold" style={{ backgroundColor: PRIMARY_COLOR }}>
                      Active
                    </span>
                  </td>

                  {/* Action */}
                  <td>
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-sm text-white border-none shadow-md transition duration-150"
                      style={{ backgroundColor: ACCENT_COLOR, hover: { backgroundColor: '#C03A22' } }}
                    >
                      <FaUserSlash className="mr-1" /> Deactivate
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

export default ActiveRiders;