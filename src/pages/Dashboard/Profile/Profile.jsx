// import { useEffect, useState } from "react";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

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

//     // Fetch current user
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

//     const handleChange = (e) =>
//         setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setPhotoFile(file);
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => setPreview(reader.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSave = async () => {
//         try {
//             let updatedPhoto = formData.photo;

//             // Upload new photo if selected
//             if (photoFile) {
//                 const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;
//                 const imageData = new FormData();
//                 imageData.append("image", photoFile);
//                 const imgRes = await axiosSecure.post(
//                     `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
//                     imageData
//                 );
//                 updatedPhoto = imgRes.data.data.url;
//             }

//             const updatedData = { ...formData, photo: updatedPhoto };

//             // Update backend
//             await axiosSecure.patch(`/users/update/${user._id}`, updatedData);

//             setUser({ ...user, ...updatedData });
//             setIsEditing(false);
//             setPhotoFile(null);
//             setPreview(updatedPhoto);
//         } catch (err) {
//             console.error("Update failed:", err);
//             alert("Profile update failed!");
//         }
//     };



//     return (
//         <>
//             {/* Profile Card */}

//             <div className=" flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
//                     <h3 className="text-2xl font-semibold mb-4 text-[#F04C2B]">My Profile</h3>

//                     {/* Photo Upload */}
//                     <div className="flex justify-center mb-4 relative">
//                         <img
//                             src={preview || "https://i.ibb.co/ZYW3VTp/blood-drop.png"}
//                             alt="preview"
//                             className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
//                         />
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             className="absolute bottom-0 right-0 w-10 h-10 opacity-0 cursor-pointer"
//                         />
//                         <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#0D5EA6] rounded-full flex items-center justify-center text-white text-lg cursor-pointer">
//                             ✎
//                         </div>
//                     </div>

//                     {/* Name */}
//                     <label className="block font-medium mb-1">Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full border border-[#0D5EA6] rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0D5EA6]"
//                     />

//                     {/* Role */}
//                     <label className="block font-medium mb-1">Role</label>
//                     <input
//                         type="text"
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         className="w-full border border-[#F04C2B] rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#F04C2B]"
//                     />

//                     {/* Email */}
//                     <label className="block font-medium mb-1">Email (not editable)</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         disabled
//                         className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100 cursor-not-allowed"
//                     />

//                     {/* Buttons */}
//                     <div className="text-center mt-6">
//                         <button
//                             onClick={() => setIsEditing(true)}
//                             className="bg-[#0D5EA6] hover:bg-blue-800 px-6 py-2 text-white rounded-lg shadow-md transition"
//                         >
//                             Edit Profile
//                         </button>
//                     </div>



//                 </div>
//             </div>



//             {/* Edit Modal */}
//             {isEditing && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
//                         <h3 className="text-2xl font-semibold mb-4 text-[#F04C2B]">Edit Profile</h3>

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
//                             <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#0D5EA6] rounded-full flex items-center justify-center text-white text-lg cursor-pointer">
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
//                             className="w-full border border-[#0D5EA6] rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0D5EA6]"
//                         />

//                         {/* Role */}
//                         <label className="block font-medium mb-1">Role</label>
//                         <input
//                             type="text"
//                             name="role"
//                             value={formData.role}
//                             onChange={handleChange}
//                             className="w-full border border-[#F04C2B] rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#F04C2B]"
//                         />

//                         {/* Email */}
//                         <label className="block font-medium mb-1">Email (not editable)</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             disabled
//                             className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100 cursor-not-allowed"
//                         />

//                         {/* Buttons */}
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

const Profile = () => {
    const axiosSecure = useAxiosSecure();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
                setUser(res.data);

                setFormData({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    role: res.data.role || "",
                    photo: res.data.photo || res.data.photoURL || "",
                });

                setPreview(res.data.photo || res.data.photoURL || "");
            })
            .catch((err) => console.log("User fetch error:", err));
    }, []);

    if (!user) return <p className="text-center mt-10 text-[#0D5EA6]">Loading...</p>;

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

            // Update backend
            await axiosSecure.patch(`/users/update/${user._id}`, updatedData);

            // Update UI
            setUser({ ...user, ...updatedData });
            setFormData(updatedData);
            setPreview(updatedPhoto);
            setIsEditing(false);
            setPhotoFile(null);

        } catch (err) {
            console.error("Update failed:", err);
            alert("Profile update failed!");
        }
    };

    return (
        <>
            {/* Profile Card */}
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-2xl font-semibold mb-4 text-[#F04C2B]">My Profile</h3>

                    {/* Photo */}
                    <div className="flex justify-center mb-4 relative">
                        <img
                            src={preview || "https://i.ibb.co/ZYW3VTp/blood-drop.png"}
                            alt="preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                    </div>

                    {/* Name */}
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-100"
                    />

                    {/* Role */}
                    <label className="block font-medium mb-1">Role</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-100"
                    />

                    {/* Email */}
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100"
                    />

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-[#0D5EA6] hover:bg-blue-800 px-6 py-2 text-white rounded-lg shadow-md"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">

                        <h3 className="text-2xl font-semibold mb-4 text-[#F04C2B]">
                            Edit Profile
                        </h3>

                        {/* Photo Upload */}
                        <div className="flex justify-center mb-4 relative">
                            <img
                                src={preview || "https://i.ibb.co/ZYW3VTp/blood-drop.png"}
                                alt="preview"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute bottom-0 right-0 w-10 h-10 opacity-0 cursor-pointer"
                            />

                            <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#0D5EA6] rounded-full flex items-center justify-center text-white text-lg">
                                ✎
                            </div>
                        </div>

                        {/* Name */}
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-[#0D5EA6] rounded-lg px-3 py-2 mb-4 focus:ring-2"
                        />

                        {/* Role */}
                        <label className="block font-medium mb-1">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-[#F04C2B] rounded-lg px-3 py-2 mb-4 focus:ring-2"
                        />

                        {/* Email */}
                        <label className="block font-medium mb-1">Email (locked)</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-[#0D5EA6] text-white rounded-lg hover:bg-blue-800"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
