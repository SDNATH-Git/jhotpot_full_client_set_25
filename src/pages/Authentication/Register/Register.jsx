
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnim from "../../../assets/register.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../contexts/AuthContext/AuthProvider";
import { toast } from "react-toastify";
import { getAuth, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import Logo from "../../../assets/Logo.png";
import app from "../../../firebase/firebase.config";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Register = () => {
    const { createUser, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const axiosSecure = useAxiosSecure();
    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    const inputStyle =
        "w-full px-6 py-4 border rounded-md text-lg bg-gray-50 border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none placeholder:text-gray-400";

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const isValidLength = password.length >= 6;

        if (!hasUppercase) {
            toast.error("Password must include at least one uppercase letter.");
            return false;
        }
        if (!hasLowercase) {
            toast.error("Password must include at least one lowercase letter.");
            return false;
        }
        if (!isValidLength) {
            toast.error("Password must be at least 6 characters long.");
            return false;
        }
        return true;
    };

    // Save user to backend
    const saveUserToDB = async (user) => {
        try {
            await axiosSecure.post("/users", {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL || "",
                role: "user",
            });
        } catch (error) {
            console.error("Error saving user to DB:", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!validatePassword(password)) return;

        setLoading(true);
        let imageUrl = "";

        try {
            // 1️⃣ Upload image to ImgBB
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const res = await fetch(
                    `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                const data = await res.json();
                imageUrl = data.data.display_url;
            }

            // 2️⃣ Create user in Firebase
            const result = await createUser(email, password);
            const user = result.user;

            // 3️⃣ Update profile
            await updateProfile(user, {
                displayName: username,
                photoURL: imageUrl,
            });

            setUser({ ...user, displayName: username, photoURL: imageUrl });

            // 4️⃣ Save to backend
            await saveUserToDB({ ...user, displayName: username, photoURL: imageUrl });

            toast.success("🎉 Registration successful!");
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            setUser(user);

            // Save Google user to backend
            await saveUserToDB(user);

            toast.success("Google sign-in successful!");
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 flex items-center justify-center">
            <div className="bg-white/70 backdrop-blur-md p-10 md:p-20 rounded-2xl shadow-2xl w-full">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <img className="w-44 h-25" src={Logo} alt="Logo" />
                </div>

                <h2 className="text-4xl font-bold text-center mb-10 text-orange-600">
                    Create Your Account !!
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Lottie Animation */}
                    <div className="w-full md:w-1/2">
                        <Lottie animationData={loginAnim} loop={true} />
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleRegister}
                        className="w-full md:w-1/2 bg-white/80 rounded-xl p-6 shadow-xs border-1 border-blue-200"
                    >
                        {/* Username */}
                        <div className="mb-5">
                            <label className="block mb-2 text-lg text-gray-600 font-semibold">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your name"
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-5">
                            <label className="block mb-2 text-lg text-gray-600 font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* Photo Upload */}
                        <div className="mb-5">
                            <label className="block mb-2 text-lg text-gray-600 font-semibold">
                                Upload Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="file-input file-input-bordered w-full border-gray-300"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative mb-5">
                            <label className="block mb-2 text-lg text-gray-600 font-semibold">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create password"
                                className={`${inputStyle} pr-10`}
                                required
                            />
                            <div
                                className="absolute right-4 top-[54px] text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative mb-5">
                            <label className="block mb-2 text-lg text-gray-600 font-semibold">
                                Confirm Password
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                className={`${inputStyle} pr-10`}
                                required
                            />
                            <div
                                className="absolute right-4 top-[54px] text-gray-500 cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-md text-xl font-semibold text-white transition-transform ${loading
                                ? "bg-orange-600 cursor-not-allowed"
                                : "bg-orange-600 hover:scale-105 hover:shadow-lg"
                                }`}
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mt-6">
                            <hr className="flex-grow border-t border-gray-300" />
                            <p className="text-gray-400 text-sm">or</p>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>

                        {/* Google Sign In */}
                        <div className="mt-6 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="flex items-center justify-center w-full gap-3 bg-white border border-gray-300 px-5 py-3 rounded-xl shadow hover:shadow-md transition text-lg font-medium"
                            >
                                <FcGoogle className="text-2xl" />
                                Continue with Google
                            </button>
                        </div>

                        {/* Redirect */}
                        <p className="text-center text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-orange-600 font-semibold hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
