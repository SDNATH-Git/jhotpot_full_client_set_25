
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";

// import { useState } from "react";
// import useAuth from "../../../hooks/useAuth";
// import { useLoaderData } from "react-router";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

// const BeARider = () => {
//     const { user } = useAuth();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();

//     const [selectedRegion, setSelectedRegion] = useState("");
//     const axiosSecure = useAxiosSecure();

//     const serviceCenters = useLoaderData();

//     const regions = [...new Set(serviceCenters.map((s) => s.region))];
//     const districts = serviceCenters
//         .filter((s) => s.region === selectedRegion)
//         .map((s) => s.district);

//     const onSubmit = async (data) => {
//         const riderData = {
//             ...data,
//             name: user?.displayName || "",
//             email: user?.email || "",
//             status: "pending",
//             created_at: new Date().toISOString(),
//         };

//         console.log("Rider Application:", riderData);

//         axiosSecure.post('/riders', riderData)
//             .then(res => {
//                 if (res.data.insertedId) {
//                     Swal.fire({
//                         icon: "success",
//                         title: "Application Submitted!",
//                         text: "Your application is pending approval.",
//                     });
//                 }
//             })



//         // Send to your backend here
//         reset();
//     };

//     return (
//         <section className="bg-[#F7F7F7] py-10">
//             <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-xl shadow">
//                 <h2 className="text-2xl font-bold mb-2">Become a Rider</h2>
//                 <p className="text-gray-500 mb-6">Fill out the form to apply as a delivery rider.</p>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                     <div className="grid grid-cols-1 gap-4">
//                         {/* Name (read-only) */}
//                         <input
//                             type="text"
//                             value={user?.displayName || ""}
//                             readOnly
//                             className="input input-bordered text-black w-full bg-gray-100"
//                         />

//                         {/* Email (read-only) */}
//                         <input
//                             type="email"
//                             value={user?.email || ""}
//                             readOnly
//                             className="input input-bordered text-black w-full bg-gray-100"
//                         />

//                         {/* Age */}
//                         <input
//                             type="number"
//                             placeholder="Your Age"
//                             className="input input-bordered w-full"
//                             {...register("age", { required: true, min: 18 })}
//                         />
//                         {errors.age && (
//                             <span className="text-red-500 text-sm">You must be 18 or older</span>
//                         )}

//                         {/* Phone */}
//                         <input
//                             type="tel"
//                             placeholder="Phone Number"
//                             className="input input-bordered w-full"
//                             {...register("phone", { required: true })}
//                         />
//                         {errors.phone && (
//                             <span className="text-red-500 text-sm">Phone number is required</span>
//                         )}

//                         {/* National ID */}
//                         <input
//                             type="text"
//                             placeholder="National ID Card Number"
//                             className="input input-bordered w-full"
//                             {...register("nid", { required: true })}
//                         />
//                         {errors.nid && (
//                             <span className="text-red-500 text-sm">NID is required</span>
//                         )}

//                         {/* Region */}
//                         <select
//                             className="select select-bordered w-full"
//                             {...register("region", { required: true })}
//                             onChange={(e) => setSelectedRegion(e.target.value)}
//                         >
//                             <option value="">Select Region</option>
//                             {regions.map((region, idx) => (
//                                 <option key={idx} value={region}>
//                                     {region}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.region && <span className="text-red-500 text-sm">Region is required</span>}

//                         {/* District */}
//                         <select
//                             className="select select-bordered w-full"
//                             {...register("district", { required: true })}
//                             disabled={!selectedRegion}
//                         >
//                             <option value="">Select District</option>
//                             {districts.map((district, idx) => (
//                                 <option key={idx} value={district}>
//                                     {district}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.district && <span className="text-red-500 text-sm">District is required</span>}

//                         {/* Bike Brand */}
//                         <input
//                             type="text"
//                             placeholder="Bike Brand (e.g., Yamaha FZ)"
//                             className="input input-bordered w-full"
//                             {...register("bike_brand", { required: true })}
//                         />
//                         {errors.bike_brand && (
//                             <span className="text-red-500 text-sm">Bike brand is required</span>
//                         )}

//                         {/* Bike Registration */}
//                         <input
//                             type="text"
//                             placeholder="Bike Registration Number"
//                             className="input input-bordered w-full"
//                             {...register("bike_registration", { required: true })}
//                         />
//                         {errors.bike_registration && (
//                             <span className="text-red-500 text-sm">Registration number is required</span>
//                         )}

//                         {/* Additional Info (optional) */}
//                         <textarea
//                             placeholder="Additional information (optional)"
//                             className="textarea textarea-bordered w-full"
//                             {...register("note")}
//                         ></textarea>
//                     </div>

//                     <button type="submit" className="btn bg-[#F04C2B] text-white hover:bg-[#0D5EA6] rounded-2xl font-bold w-full mt-4">
//                         Submit Rider Application
//                     </button>
//                 </form>
//             </div>
//         </section>

//     );
// };

// export default BeARider;



import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BeARider = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const serviceCenters = useLoaderData();

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors },
    } = useForm();

    const [step, setStep] = useState(1);
    const [selectedRegion, setSelectedRegion] = useState("");

    /* Region & District */
    const regions = [...new Set(serviceCenters.map(s => s.region))];
    const districts = serviceCenters
        .filter(s => s.region === selectedRegion)
        .map(s => s.district);

    /* STEP-1 VALIDATION */
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
                text: "Please fill all required fields to continue.",
            });
            return;
        }
        setStep(2);
    };

    const prevStep = () => setStep(1);

    /* SUBMIT */
    const onSubmit = async (data) => {
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
                Swal.fire("Success", "Rider application submitted", "success");
                reset();
                setStep(1);
                setSelectedRegion("");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong!", "error");
        }
    };

    return (
        <section className="bg-[#F7F7F7] min-h-screen flex items-center py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">

                {/* LEFT: FORM */}
                <div className="p-6 md:p-10">
                    <h2 className="text-3xl font-bold mb-1">Become a Rider</h2>
                    <p className="text-gray-500 mb-6">Step {step} of 2</p>

                    {/* Progress */}
                    <div className="flex gap-2 mb-6">
                        <div className={`h-2 w-full rounded ${step >= 1 ? "bg-[#F04C2B]" : "bg-gray-200"}`} />
                        <div className={`h-2 w-full rounded ${step === 2 ? "bg-[#F04C2B]" : "bg-gray-200"}`} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <>
                                <input
                                    value={user?.displayName || ""}
                                    readOnly
                                    className="input input-bordered bg-gray-100 w-full"
                                />

                                <input
                                    value={user?.email || ""}
                                    readOnly
                                    className="input input-bordered bg-gray-100 w-full"
                                />

                                <input
                                    type="number"
                                    placeholder="Age"
                                    className="input input-bordered w-full"
                                    {...register("age", { required: true, min: 18 })}
                                />
                                {errors.age && <p className="text-red-500 text-sm">Minimum age 18</p>}

                                <input
                                    placeholder="Phone Number"
                                    className="input input-bordered w-full"
                                    {...register("phone", { required: true })}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">Phone required</p>}

                                <input
                                    placeholder="National ID Number"
                                    className="input input-bordered w-full"
                                    {...register("nid", { required: true })}
                                />
                                {errors.nid && <p className="text-red-500 text-sm">NID required</p>}

                                <select
                                    className="select select-bordered w-full"
                                    {...register("region", { required: true })}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map((r, i) => (
                                        <option key={i} value={r}>{r}</option>
                                    ))}
                                </select>
                                {errors.region && <p className="text-red-500 text-sm">Region required</p>}

                                <select
                                    className="select select-bordered w-full"
                                    {...register("district", { required: true })}
                                    disabled={!selectedRegion}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((d, i) => (
                                        <option key={i} value={d}>{d}</option>
                                    ))}
                                </select>
                                {errors.district && <p className="text-red-500 text-sm">District required</p>}

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="btn w-full bg-[#F04C2B] text-white rounded-xl"
                                >
                                    Next →
                                </button>
                            </>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <>
                                <input
                                    placeholder="Bike Brand (e.g. Yamaha FZ)"
                                    className="input input-bordered w-full"
                                    {...register("bike_brand", { required: true })}
                                />
                                {errors.bike_brand && <p className="text-red-500 text-sm">Bike brand required</p>}

                                <input
                                    placeholder="Bike Registration Number"
                                    className="input input-bordered w-full"
                                    {...register("bike_registration", { required: true })}
                                />
                                {errors.bike_registration && <p className="text-red-500 text-sm">Registration required</p>}

                                <textarea
                                    placeholder="Additional notes (optional)"
                                    className="textarea textarea-bordered w-full"
                                    {...register("note")}
                                />

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="btn w-1/2 border rounded-xl"
                                    >
                                        ← Back
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn w-1/2 bg-[#0D5EA6] text-white rounded-xl"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* RIGHT: IMAGE */}
                <div className="hidden md:flex items-center justify-center bg-[#F04C2B]/10">
                    <img
                        src="https://i.ibb.co/7Yj7pP8/delivery-rider.png"
                        alt="Rider Illustration"
                        className="max-h-[420px] object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default BeARider;

