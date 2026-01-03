
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserShield, FaMotorcycle, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_BRAND_COLOR = '#0D5EA6'; // গাঢ় নীল (Submit)
const SECONDARY_BRAND_COLOR = '#F04C2B'; // লাল/কমলা (Next/Progress)
const DARK_TEXT_COLOR = '#03373D'; // গাঢ় ছায়া (Text/Headers)

const BeARider = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const serviceCenters = useLoaderData() || []; // Ensure it's an array

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors },
    } = useForm();

    const [step, setStep] = useState(1);
    const [selectedRegion, setSelectedRegion] = useState("");

    /* Region & District Logic */
    const regions = [...new Set(serviceCenters.map(s => s.region))];
    const districts = serviceCenters
        .filter(s => s.region === selectedRegion)
        .map(s => s.district);

    /* STEP-1 VALIDATION & Next Step */
    const nextStep = async () => {
        const isValid = await trigger([
            "age",
            "phone",
            "nid",
            "region",
            "district",
        ]);

        if (!isValid) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Information",
                text: "Please fill all required fields in Step 1 to continue.",
                confirmButtonColor: PRIMARY_BRAND_COLOR,
                customClass: {
                    popup: "rounded-xl shadow-md",
                }
            });
            return;
        }
        setStep(2);
    };

    const prevStep = () => setStep(1);

    /* SUBMIT */
    const onSubmit = async (data) => {
        // Step 2 validation check before submission
        const isValidStep2 = await trigger([
            "bike_brand",
            "bike_registration",
        ]);

        if (!isValidStep2) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Vehicle Info",
                text: "Please fill all required fields in Step 2.",
                confirmButtonColor: PRIMARY_BRAND_COLOR,
                customClass: {
                    popup: "rounded-xl shadow-md",
                }
            });
            return;
        }

        const riderData = {
            ...data,
            name: user?.displayName || "",
            email: user?.email || "",
            status: "pending",
            created_at: new Date().toISOString(),
        };

        try {
            const res = await axiosSecure.post("/riders", riderData);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Application Submitted!",
                    text: "Your rider application is now under review. We will contact you soon.",
                    icon: "success",
                    confirmButtonColor: PRIMARY_BRAND_COLOR,
                    customClass: {
                        popup: "rounded-xl shadow-md",
                    }
                });
                reset();
                setStep(1);
                setSelectedRegion("");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong! Please try again.", "error");
        }
    };

    return (
        <section className="background: linear-gradient(135deg, #F04C2B33, #0D5EA633, #03373D33) min-h-screen flex items-center justify-center py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8" style={{ borderTopColor: PRIMARY_BRAND_COLOR }}>

                {/* LEFT: FORM */}
                <div className="p-6 md:p-10 lg:p-12">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="md:text-4xl text-2xl font-extrabold flex items-center" style={{ color: PRIMARY_BRAND_COLOR }}>
                            <FaMotorcycle className="mr-3" style={{ color: SECONDARY_BRAND_COLOR }} />
                            Join Our Rider Team
                        </h2>
                        <p className="text-gray-600 mt-2 md:text-xl font-medium">Complete the 2-step application process.</p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex gap-4 items-center mb-8">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold transition-colors duration-300 ${step >= 1 ? 'bg-[#F04C2B]' : 'bg-gray-300'}`}>
                                {step > 1 ? <FaCheckCircle /> : '1'}
                            </div>
                            <span className={`text-sm mt-1 ${step === 1 ? 'font-bold' : 'text-gray-500'}`}>Personal & Area</span>
                        </div>
                        <div className="h-1 flex-grow rounded-full" style={{ background: step === 2 ? SECONDARY_BRAND_COLOR : '#E5E7EB' }} />
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold transition-colors duration-300 ${step === 2 ? 'bg-[#0D5EA6]' : 'bg-gray-300'}`}>
                                2
                            </div>
                            <span className={`text-sm mt-1 ${step === 2 ? 'font-bold' : 'text-gray-500'}`}>Vehicle Details</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* STEP 1: Personal & Area Information */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold pb-2" style={{ color: DARK_TEXT_COLOR, borderBottom: `2px solid ${SECONDARY_BRAND_COLOR}` }}>
                                    Step 1: Identity & Location
                                </h3>

                                {/* Read-only fields */}
                                <input
                                    value={user?.displayName || "User Name"}
                                    readOnly
                                    className="input input-bordered bg-gray-100 w-full rounded-xl cursor-not-allowed"
                                />
                                <input
                                    value={user?.email || "user@email.com"}
                                    readOnly
                                    className="input input-bordered bg-gray-100 w-full rounded-xl cursor-not-allowed"
                                />

                                {/* Age */}
                                <div className="space-y-1">
                                    <input
                                        type="number"
                                        placeholder="Age *"
                                        className={`input input-bordered w-full rounded-xl focus:border-[#0D5EA6]`}
                                        {...register("age", { required: true, min: 18 })}
                                    />
                                    {errors.age && <p className="text-red-500 text-sm">Minimum age is 18 years</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <input
                                        placeholder="Phone Number *"
                                        className={`input input-bordered w-full rounded-xl focus:border-[#0D5EA6]`}
                                        {...register("phone", { required: true, pattern: /^01[0-9]{9}$/ })}
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm">Valid 11-digit phone number required (e.g., 01xxxxxxxxx)</p>}
                                </div>

                                {/* NID */}
                                <div className="space-y-1">
                                    <input
                                        placeholder="National ID Number *"
                                        className={`input input-bordered w-full rounded-xl focus:border-[#0D5EA6]`}
                                        {...register("nid", { required: true })}
                                    />
                                    {errors.nid && <p className="text-red-500 text-sm">NID required</p>}
                                </div>

                                {/* Region & District */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {/* Region */}
                                    <div className="space-y-1">
                                        <select
                                            className={`select select-bordered w-full rounded-xl focus:border-[#0D5EA6]`}
                                            {...register("region", { required: true })}
                                            onChange={(e) => setSelectedRegion(e.target.value)}
                                        >
                                            <option value="">Select Region *</option>
                                            {regions.map((r, i) => (
                                                <option key={i} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        {errors.region && <p className="text-red-500 text-sm">Region required</p>}
                                    </div>

                                    {/* District */}
                                    <div className="space-y-1">
                                        <select
                                            className={`select select-bordered w-full rounded-xl focus:border-[#0D5EA6] ${!selectedRegion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            {...register("district", { required: true })}
                                            disabled={!selectedRegion}
                                        >
                                            <option value="">Select District *</option>
                                            {districts.map((d, i) => (
                                                <option key={i} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        {errors.district && <p className="text-red-500 text-sm">District required</p>}
                                    </div>
                                </div>

                                {/* Next Button */}
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="btn w-full bg-[#F04C2B] text-white hover:bg-[#0D5EA6] rounded-xl text-lg font-bold shadow-lg transition-all mt-6 border-none"
                                >
                                    Next: Vehicle Details <FaArrowRight className="ml-2" />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Vehicle Information */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold pb-2" style={{ color: DARK_TEXT_COLOR, borderBottom: `2px solid ${PRIMARY_BRAND_COLOR}` }}>
                                    Step 2: Vehicle Details
                                </h3>

                                {/* Bike Brand */}
                                <div className="space-y-1">
                                    <input
                                        placeholder="Bike Brand (e.g. Yamaha FZ) *"
                                        className={`input input-bordered w-full rounded-xl focus:border-[#0D5EA6]`}
                                        {...register("bike_brand", { required: true })}
                                    />
                                    {errors.bike_brand && <p className="text-red-500 text-sm">Bike brand required</p>}
                                </div>

                                {/* Bike Registration */}
                                <div className="space-y-1">
                                    <input
                                        placeholder="Bike Registration Number *"
                                        className={`input input-bordered w-full rounded-xl focus:border-[#0D5EA6]`}
                                        {...register("bike_registration", { required: true })}
                                    />
                                    {errors.bike_registration && <p className="text-red-500 text-sm">Registration required</p>}
                                </div>

                                {/* Additional Notes */}
                                <textarea
                                    placeholder="Additional notes (optional)"
                                    className="textarea textarea-bordered w-full rounded-xl focus:border-[#0D5EA6]"
                                    {...register("note")}
                                />

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="btn w-1/2 border border-gray-300 rounded-xl hover:bg-gray-100 text-gray-700 transition-all"
                                    >
                                        <FaArrowLeft className="mr-2" /> Back
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn w-1/2 bg-[#0D5EA6] text-white hover:bg-[#F04C2B] rounded-xl  font-bold shadow-lg transition-all border-none"
                                    >
                                        <FaUserShield className="mr-2" /> Submit Application
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* RIGHT: Visual/Motivational Section */}
                <div className="hidden lg:flex items-center justify-center p-12" style={{ background: `linear-gradient(135deg, ${PRIMARY_BRAND_COLOR} 0%, #03373D 100%)` }}>

                    <div className="hidden md:flex items-center justify-center ">
                        <img
                            src="https://i.ibb.co.com/jkLWNnjn/rider-1.png"
                            alt="Rider Illustration"
                            className="max-h-[420px] object-contain"
                        />
                    </div>


                </div>
            </div>
        </section>
    );
};

export default BeARider;


