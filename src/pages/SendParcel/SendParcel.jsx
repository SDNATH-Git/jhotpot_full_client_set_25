

import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useLoaderData, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useTrackingLogger from "../../hooks/useTrackingLogger";
import { FaBoxOpen, FaUser, FaMapMarkerAlt, FaWeight, FaMotorcycle, FaPaperPlane } from 'react-icons/fa';

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_BRAND_COLOR = '#0D5EA6'; // গাঢ় নীল (Accent)
const SECONDARY_BRAND_COLOR = '#F04C2B'; // লাল/কমলা (Action)
const DARK_TEXT_COLOR = '#03373D'; // গাঢ় ছায়া (Text/Headers)

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
};

const SendParcel = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { logTracking } = useTrackingLogger();

    const serviceCenters = useLoaderData();
    // Region and District Filtering Logic
    const uniqueRegions = [...new Set(serviceCenters?.map((w) => w.region) || [])];
    const getDistrictsByRegion = (region) =>
        serviceCenters?.filter((w) => w.region === region).map((w) => w.district) || [];

    const parcelType = watch("type");
    const senderRegion = watch("sender_region");
    const receiverRegion = watch("receiver_region");

    const onSubmit = (data) => {
        const weight = parseFloat(data.weight) || 0;
        const isSameDistrict = data.sender_center === data.receiver_center;

        let baseCost = 0;
        let extraCost = 0;
        let breakdown = "";

        // --- Cost Calculation Logic ---
        if (data.type === "document") {
            baseCost = isSameDistrict ? 60 : 80;
            breakdown = `Base cost for Document delivery ${isSameDistrict ? "within" : "outside"} the district.`;
        } else { // Non-document
            if (weight <= 3) {
                baseCost = isSameDistrict ? 110 : 150;
                breakdown = `Base cost for Non-document up to 3kg ${isSameDistrict ? "within" : "outside"} the district.`;
            } else {
                const extraKg = weight - 3;
                // Extra charge for weight over 3kg (৳40 per kg)
                const perKgCharge = extraKg * 40;
                // Extra charge for outside district delivery (Fixed ৳40)
                const districtExtra = isSameDistrict ? 0 : 40;

                baseCost = isSameDistrict ? 110 : 150; // Base cost for non-document
                extraCost = perKgCharge + districtExtra;

                breakdown = `
                    <p class="mt-2">Base rate: ৳${baseCost}</p>
                    <p>Extra Weight Charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge.toFixed(2)}</p>
                    ${districtExtra > 0 ? `<p>District Change Fee: ৳${districtExtra}</p>` : ""}
                `;
            }
        }

        const totalCost = baseCost + extraCost;

        // --- Swal Confirmation ---
        Swal.fire({
            title: "Delivery Cost Breakdown",
            icon: "info",
            html: `
                <div class="text-left text-base space-y-3 font-sans" style="color: ${DARK_TEXT_COLOR}">
                    <p><strong>Parcel Type:</strong> <span class="font-semibold">${data.type.toUpperCase()}</span></p>
                    <p><strong>Weight:</strong> <span class="font-semibold">${weight.toFixed(1)} kg</span></p>
                    <p><strong>Delivery Zone:</strong> <span class="font-semibold">${isSameDistrict ? "Within Same District" : "Outside District"}</span></p>
                    <hr class="my-3 border-gray-300"/>
                    <p><strong>Base Charge:</strong> <span class="float-right font-semibold">৳${baseCost.toFixed(2)}</span></p>
                    ${extraCost > 0 ? `<p><strong>Additional Charges:</strong> <span class="float-right font-semibold">৳${extraCost.toFixed(2)}</span></p>` : ""}
                    <div class="text-gray-500 text-sm mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">${breakdown}</div>
                    <hr class="my-3 border-gray-300"/>
                    <p class="text-xl font-extrabold" style="color: #10B981;">Total Payable: <span class="float-right">৳${totalCost.toFixed(2)}</span></p>
                </div>
            `,
            showDenyButton: true,
            confirmButtonText: "💳 Proceed to Payment",
            denyButtonText: "✏️ Continue Editing",
            confirmButtonColor: PRIMARY_BRAND_COLOR, // Changed to Primary Brand Color
            denyButtonColor: "#6B7280", // Gray
            customClass: {
                popup: "rounded-xl shadow-2xl px-6 py-6",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const tracking_id = generateTrackingID();
                const parcelData = {
                    ...data,
                    cost: totalCost,
                    created_by: user.email,
                    payment_status: "unpaid",
                    delivery_status: "not_collected",
                    creation_date: new Date().toISOString(),
                    tracking_id: tracking_id,
                    // Add default weight for document type for consistency
                    weight: data.type === "document" ? 0.5 : weight,
                };

                axiosSecure.post("/parcels", parcelData).then(async (res) => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            title: "Parcel Booked!",
                            text: `Tracking ID: ${tracking_id}. Proceeding to payment gateway.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            customClass: {
                                title: `text-[${DARK_TEXT_COLOR}]`,
                                popup: "rounded-xl shadow-2xl",
                            }
                        });

                        await logTracking({
                            tracking_id: parcelData.tracking_id,
                            status: "parcel_created",
                            details: `Created by ${user.displayName || user.email}`,
                            updated_by: user.email,
                        });

                        // Redirect to the payment page or My Parcels list
                        navigate("/dashboard/myParcels");
                    }
                }).catch(error => {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to save parcel data. Please try again.",
                        icon: "error",
                        confirmButtonColor: PRIMARY_BRAND_COLOR,
                    });
                });
            }
        });
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-10 lg:px-20 background: linear-gradient(135deg, #F04C2B33, #0D5EA633, #03373D33)">
            <div className="max-w-7xl mx-auto bg-white p-6 md:p-10 lg:p-12 rounded-3xl shadow-2xl border-t-8" style={{ borderTopColor: SECONDARY_BRAND_COLOR }}>

                {/* Header */}
                <div className="text-center mb-10 border-b pb-4">
                    <h2 className="text-2xl md:text-4xl font-extrabold flex items-center justify-center" style={{ color: PRIMARY_BRAND_COLOR }}>
                        <FaPaperPlane className="mr-3 text-4xl" style={{ color: SECONDARY_BRAND_COLOR }} />
                        Book a New Parcel
                    </h2>
                    <p className="text-lg text-gray-600 font-medium mt-2">Fill in the required details to calculate cost and book your delivery.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

                    {/* Parcel Info Section */}
                    <div className="border border-gray-200 rounded-2xl p-6 shadow-lg bg-white">
                        <h3 className="font-bold text-2xl mb-6 flex items-center" style={{ color: DARK_TEXT_COLOR, borderBottom: `2px solid ${PRIMARY_BRAND_COLOR}` }}>
                            <FaBoxOpen className="mr-3" style={{ color: SECONDARY_BRAND_COLOR }} />
                            Parcel Information
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Parcel Name */}
                            <div>
                                <label className="label font-medium" style={{ color: DARK_TEXT_COLOR }}>Parcel Name <span className="text-red-500">*</span></label>
                                <input
                                    {...register("title", { required: true })}
                                    className="input input-bordered w-full rounded-xl focus:border-[#0D5EA6] focus:ring-1 focus:ring-[#0D5EA6]"
                                    placeholder="e.g., Laptop, Documents, Clothes"
                                />
                                {errors.title && (<p className="text-red-500 text-sm mt-1">Parcel name is required</p>)}
                            </div>

                            {/* Type (Radio) */}
                            <div className="md:col-span-1">
                                <label className="label font-medium" style={{ color: DARK_TEXT_COLOR }}>Type <span className="text-red-500">*</span></label>
                                <div className="flex items-center gap-6 mt-3 p-2 bg-gray-50 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                        <input
                                            type="radio"
                                            value="document"
                                            {...register("type", { required: true })}
                                            className="radio checked:bg-[#0D5EA6]"
                                        />
                                        Document
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                        <input
                                            type="radio"
                                            value="non-document"
                                            {...register("type", { required: true })}
                                            className="radio checked:bg-[#0D5EA6]"
                                        />
                                        Non-Document
                                    </label>
                                </div>
                                {errors.type && (<p className="text-red-500 text-sm mt-1">Parcel type is required</p>)}
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="label font-medium flex items-center" style={{ color: DARK_TEXT_COLOR }}>
                                    <FaWeight className="mr-1 text-sm text-gray-500" />
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min={parcelType === "document" ? "0.5" : "0.1"}
                                    {...register("weight", {
                                        required: parcelType === "non-document",
                                        valueAsNumber: true,
                                    })}
                                    disabled={parcelType !== "non-document"}
                                    className={`input input-bordered w-full rounded-xl focus:border-[#0D5EA6] ${parcelType !== "non-document"
                                        ? "bg-gray-200 cursor-not-allowed text-gray-500"
                                        : ""
                                        }`}
                                    placeholder={parcelType === "document" ? "0.5 (Fixed)" : "Enter weight in kg"}
                                    defaultValue={parcelType === "document" ? 0.5 : ''}
                                />
                                {errors.weight?.type === 'required' && parcelType === 'non-document' && (<p className="text-red-500 text-sm mt-1">Weight is required for non-document parcel</p>)}
                            </div>
                        </div>
                    </div>

                    {/* Sender & Receiver Info Section */}
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Sender Info */}
                        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-lg">
                            <h3 className="font-bold text-xl mb-6 flex items-center" style={{ color: PRIMARY_BRAND_COLOR, borderBottom: `2px solid ${SECONDARY_BRAND_COLOR}` }}>
                                <FaUser className="mr-3 text-xl" />
                                Sender Information
                            </h3>
                            <div className="grid gap-4">

                                <input {...register("sender_name", { required: true })} className="input w-full input-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Full Name *" style={{ color: DARK_TEXT_COLOR }} />
                                <input {...register("sender_contact", { required: true })} className="input w-full input-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Contact Number *" style={{ color: DARK_TEXT_COLOR }} />

                                {/* Sender Region */}
                                <select {...register("sender_region", { required: true })} className="select w-full select-bordered rounded-xl focus:border-[#0D5EA6] text-gray-700">
                                    <option value="">Select Pickup Region *</option>
                                    {uniqueRegions.map((region) => (
                                        <option key={region} value={region} style={{ color: DARK_TEXT_COLOR }}>{region}</option>
                                    ))}
                                </select>

                                {/* Sender District (Center) */}
                                <select {...register("sender_center", { required: true })} className="select w-full select-bordered rounded-xl focus:border-[#0D5EA6] text-gray-700" disabled={!senderRegion}>
                                    <option value="">Select Pickup District *</option>
                                    {getDistrictsByRegion(senderRegion).map((district) => (
                                        <option key={district} value={district} style={{ color: DARK_TEXT_COLOR }}>{district}</option>
                                    ))}
                                </select>

                                <input {...register("sender_address", { required: true })} className="input w-full input-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Full Pickup Address *" style={{ color: DARK_TEXT_COLOR }} />
                                <textarea {...register("pickup_instruction", { required: true })} className="textarea w-full textarea-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Pickup Instruction (e.g., call 1 hour before arrival) *" style={{ color: DARK_TEXT_COLOR }} />
                            </div>
                        </div>

                        {/* Receiver Info */}
                        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-lg">
                            <h3 className="font-bold text-xl mb-6 flex items-center" style={{ color: PRIMARY_BRAND_COLOR, borderBottom: `2px solid ${SECONDARY_BRAND_COLOR}` }}>
                                <FaMotorcycle className="mr-3 text-xl" />
                                Receiver Information
                            </h3>
                            <div className="grid gap-4">
                                <input {...register("receiver_name", { required: true })} className="input w-full input-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Full Name *" style={{ color: DARK_TEXT_COLOR }} />
                                <input {...register("receiver_contact", { required: true })} className="input w-full input-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Contact Number *" style={{ color: DARK_TEXT_COLOR }} />

                                {/* Receiver Region */}
                                <select {...register("receiver_region", { required: true })} className="select w-full select-bordered rounded-xl focus:border-[#0D5EA6] text-gray-700">
                                    <option value="">Select Delivery Region *</option>
                                    {uniqueRegions.map((region) => (
                                        <option key={region} value={region} style={{ color: DARK_TEXT_COLOR }}>{region}</option>
                                    ))}
                                </select>

                                {/* Receiver District (Center) */}
                                <select {...register("receiver_center", { required: true })} className="select w-full select-bordered rounded-xl focus:border-[#0D5EA6] text-gray-700" disabled={!receiverRegion}>
                                    <option value="">Select Delivery District *</option>
                                    {getDistrictsByRegion(receiverRegion).map((district) => (
                                        <option key={district} value={district} style={{ color: DARK_TEXT_COLOR }}>{district}</option>
                                    ))}
                                </select>

                                <input {...register("receiver_address", { required: true })} className="input w-full input-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Full Delivery Address *" style={{ color: DARK_TEXT_COLOR }} />
                                <textarea {...register("delivery_instruction", { required: true })} className="textarea w-full textarea-bordered rounded-xl focus:border-[#0D5EA6]" placeholder="Delivery Instruction (e.g., drop at security desk) *" style={{ color: DARK_TEXT_COLOR }} />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
                            className="btn bg-[#F04C2B] text-white hover:bg-[#0D5EA6] px-10 py-3 rounded-full text-xl font-extrabold shadow-xl transition-all border-none"
                            style={{ backgroundColor: SECONDARY_BRAND_COLOR }}
                        >
                            <FaPaperPlane className="mr-2" /> Submit Parcel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendParcel;
