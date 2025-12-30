
// import { useEffect, useState } from "react";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import axios from "axios";

// const Profile = () => {
//     const axiosSecure = useAxiosSecure();
//     const [user, setUser] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         role: "",
//         photo: "",
//     });

//     const [photoFile, setPhotoFile] = useState(null);
//     const [preview, setPreview] = useState("");

//     // Load current user
//     useEffect(() => {
//         axiosSecure
//             .get("/users/me")
//             .then((res) => {
//                 setUser(res.data);

//                 setFormData({
//                     name: res.data.name || "",
//                     email: res.data.email || "",
//                     role: res.data.role || "",
//                     photo: res.data.photo || res.data.photoURL || "",
//                 });

//                 setPreview(res.data.photo || res.data.photoURL || "");
//             })
//             .catch((err) => console.log("User fetch error:", err));
//     }, []);

//     if (!user) return <p className="text-center mt-10 text-[#0D5EA6]">Loading...</p>;

//     // Handle text input
//     const handleChange = (e) =>
//         setFormData({ ...formData, [e.target.name]: e.target.value });

//     // Handle image file
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setPhotoFile(file);

//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => setPreview(reader.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     // Save / Update Profile
//     const handleSave = async () => {
//         try {
//             let updatedPhoto = formData.photo;

//             // Upload to ImgBB if new file selected
//             if (photoFile) {
//                 const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;

//                 const imageData = new FormData();
//                 imageData.append("image", photoFile);

//                 const imgRes = await axios.post(
//                     `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
//                     imageData
//                 );

//                 updatedPhoto = imgRes.data.data.url;
//             }

//             const updatedData = { ...formData, photo: updatedPhoto };

//             // Update backend
//             await axiosSecure.patch(`/users/update/${user._id}`, updatedData);

//             // Update UI
//             setUser({ ...user, ...updatedData });
//             setFormData(updatedData);
//             setPreview(updatedPhoto);
//             setIsEditing(false);
//             setPhotoFile(null);

//         } catch (err) {
//             console.error("Update failed:", err);
//             alert("Profile update failed!");
//         }
//     };

//     return (
//         <>
//             {/* Profile Card */}
//             <div className="flex items-center justify-center p-4">
//                 <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
//                     <h3 className="text-2xl font-semibold mb-4 text-[#F04C2B]">My Profile</h3>

//                     {/* Photo */}
//                     <div className="flex justify-center mb-4 relative">
//                         <img
//                             src={preview || "https://i.ibb.co/ZYW3VTp/blood-drop.png"}
//                             alt="preview"
//                             className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
//                         />
//                     </div>

//                     {/* Name */}
//                     <label className="block font-medium mb-1">Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         disabled
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-100"
//                     />

//                     {/* Role */}
//                     <label className="block font-medium mb-1">Role</label>
//                     <input
//                         type="text"
//                         name="role"
//                         value={formData.role}
//                         disabled
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-100"
//                     />

//                     {/* Email */}
//                     <label className="block font-medium mb-1">Email</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         disabled
//                         className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100"
//                     />

//                     <div className="text-center mt-6">
//                         <button
//                             onClick={() => setIsEditing(true)}
//                             className="bg-[#0D5EA6] hover:bg-blue-800 px-6 py-2 text-white rounded-lg shadow-md"
//                         >
//                             Edit Profile
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             {isEditing && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">

//                         <h3 className="text-2xl font-semibold mb-4 text-[#F04C2B]">
//                             Edit Profile
//                         </h3>

//                         {/* Photo Upload */}
//                         <div className="flex justify-center mb-4 relative">
//                             <img
//                                 src={preview || "https://i.ibb.co/ZYW3VTp/blood-drop.png"}
//                                 alt="preview"
//                                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
//                             />

//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="absolute bottom-0 right-0 w-10 h-10 opacity-0 cursor-pointer"
//                             />

//                             <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#0D5EA6] rounded-full flex items-center justify-center text-white text-lg">
//                                 ✎
//                             </div>
//                         </div>

//                         {/* Name */}
//                         <label className="block font-medium mb-1">Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="w-full border border-[#0D5EA6] rounded-lg px-3 py-2 mb-4 focus:ring-2"
//                         />

//                         {/* Role */}
//                         <label className="block font-medium mb-1">Role</label>
//                         <input
//                             type="text"
//                             name="role"
//                             value={formData.role}
//                             onChange={handleChange}
//                             className="w-full border border-[#F04C2B] rounded-lg px-3 py-2 mb-4 focus:ring-2"
//                         />

//                         {/* Email */}
//                         <label className="block font-medium mb-1">Email (locked)</label>
//                         <input
//                             type="email"
//                             value={formData.email}
//                             disabled
//                             className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100"
//                         />

//                         <div className="flex justify-end gap-3">
//                             <button
//                                 onClick={() => setIsEditing(false)}
//                                 className="px-5 py-2 bg-gray-300 rounded-lg"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 onClick={handleSave}
//                                 className="px-5 py-2 bg-[#0D5EA6] text-white rounded-lg hover:bg-blue-800"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Profile;





import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import { FaEdit, FaUserCircle, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import Swal from "sweetalert2";

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#0D5EA6'; // Primary Button, Blue accent
const ACCENT_COLOR = '#F04C2B'; // Highlight, Header, Red accent
const TEXT_SHADE = '#03373D'; // Dark Text/Border

const Profile = () => {
    const axiosSecure = useAxiosSecure();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        photo: "",
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [preview, setPreview] = useState("");

    // Load current user
    useEffect(() => {
        axiosSecure
            .get("/users/me")
            .then((res) => {
                const userData = res.data;
                setUser(userData);

                const defaultPhoto = userData.photo || userData.photoURL || 'https://i.ibb.co/ZYW3VTp/blood-drop.png'; // Default placeholder

                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    role: userData.role || "",
                    photo: defaultPhoto,
                });

                setPreview(defaultPhoto);
            })
            .catch((err) => {
                console.error("User fetch error:", err);
                // Optionally show error to user
                Swal.fire('Error', 'Failed to load profile data.', 'error');
            });
    }, [axiosSecure]);

    // --- হ্যান্ডলার্স ---

    // Handle text input
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle image file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPhotoFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Save / Update Profile
    const handleSave = async () => {
        setIsSaving(true);
        try {
            let updatedPhoto = formData.photo;

            // Upload to ImgBB if new file selected
            if (photoFile) {
                const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;

                const imageData = new FormData();
                imageData.append("image", photoFile);

                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
                    imageData
                );

                updatedPhoto = imgRes.data.data.url;
            }

            const updatedData = { ...formData, photo: updatedPhoto };

            // Update backend (assuming user._id is available)
            await axiosSecure.patch(`/users/update/${user._id}`, updatedData);

            // Update UI
            setUser({ ...user, ...updatedData });
            setFormData(updatedData);
            setPreview(updatedPhoto);
            setIsEditing(false);
            setPhotoFile(null);

            Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (err) {
            console.error("Update failed:", err);
            Swal.fire('Error', 'Profile update failed. Try again later.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel Editing
    const handleCancel = () => {
        // Reset form data to the original user data
        const defaultPhoto = user.photo || user.photoURL || 'https://i.ibb.co/ZYW3VTp/blood-drop.png';
        setFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "",
            photo: defaultPhoto,
        });
        setPreview(defaultPhoto);
        setPhotoFile(null);
        setIsEditing(false);
    };

    // --- রেন্ডারিং স্টেটস ---

    if (!user) return (
        <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
            <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
        </div>
    );

    // --- মেইন প্রোফাইল ভিউ ---

    const renderProfileField = (label, value) => (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-1" style={{ color: TEXT_SHADE }}>{label}</label>
            <p className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 select-all font-medium">
                {value}
            </p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-8 text-center" style={{ color: ACCENT_COLOR }}>
                <FaUserCircle className="inline-block mr-2" /> User Profile
            </h1>

            {/* ১. Profile Card (Read Only) */}
            <div className="flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl border-t-4" style={{ borderTopColor: ACCENT_COLOR }}>

                    {/* Photo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={preview || 'https://i.ibb.co/ZYW3VTp/blood-drop.png'}
                            alt="User Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-gray-200"
                        />
                    </div>

                    <h3 className="text-2xl font-bold text-center mb-6" style={{ color: TEXT_SHADE }}>
                        {user.name || 'User Name'}
                    </h3>

                    {renderProfileField("Full Name", user.name || 'N/A')}
                    {renderProfileField("Email Address", user.email || 'N/A')}
                    {renderProfileField("User Role", user.role ? user.role.toUpperCase() : 'N/A')}

                    {/* Edit Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center justify-center mx-auto bg-gradient-to-r from-[#0D5EA6] to-blue-600 hover:from-blue-600 hover:to-[#0D5EA6] px-8 py-3 text-white rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                        >
                            <FaEdit className="mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* ২. Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 border-t-4" style={{ borderTopColor: PRIMARY_COLOR }}>

                        <div className="flex justify-between items-center mb-6 border-b pb-3">
                            <h3 className="text-2xl font-bold" style={{ color: ACCENT_COLOR }}>
                                <FaEdit className="inline-block mr-2 text-xl" /> Update Profile
                            </h3>
                            <button onClick={handleCancel} className="text-gray-500 hover:text-red-500 transition">
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        {/* Photo Upload */}
                        <div className="flex justify-center mb-6 relative">
                            <img
                                src={preview || 'https://i.ibb.co/ZYW3VTp/blood-drop.png'}
                                alt="Profile Preview"
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-4 ring-gray-200"
                            />

                            {/* Custom File Input Trigger */}
                            <label htmlFor="photo-upload" className="absolute bottom-0 right-1/2 translate-x-[55px] w-8 h-8 cursor-pointer bg-white rounded-full flex items-center justify-center shadow-lg border-2" style={{ borderColor: PRIMARY_COLOR }}>
                                <FaCamera className="text-sm" style={{ color: PRIMARY_COLOR }} />
                            </label>

                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden" // Hiding the default input
                            />
                        </div>

                        {/* Name Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1" style={{ color: TEXT_SHADE }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0D5EA6] focus:border-transparent transition"
                                style={{ borderColor: PRIMARY_COLOR }}
                            />
                        </div>

                        {/* Role Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1" style={{ color: TEXT_SHADE }}>Role (Editable)</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#F04C2B] focus:border-transparent transition"
                                style={{ borderColor: ACCENT_COLOR }}
                            />
                        </div>

                        {/* Email Field (Locked) */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-1 text-gray-500">Email Address (Locked)</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCancel}
                                className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-200"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className={`flex items-center px-6 py-2 text-white rounded-full shadow-md transition duration-200 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D5EA6] hover:bg-blue-800'}`}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="loading loading-spinner mr-2"></span> Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;


