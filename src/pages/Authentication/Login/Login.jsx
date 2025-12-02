import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnim from "../../../assets/login.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Logo from "../../../assets/Logo.png";
import app from "../../../firebase/firebase.config";
import { AuthContext } from "../../../contexts/AuthContext/AuthProvider";



const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
    const { signIn, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const inputStyle =
        "w-full px-6 py-4 border rounded-md text-lg bg-gray-50 border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none placeholder:text-gray-400";

    const handleLogin = async (e) => {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.email.value.trim();
        const password = form.password.value;

        setLoading(true);
        try {
            const result = await signIn(emailInput, password);
            const user = result.user;
            setUser(user);
            toast.success("Login successful!");
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setUser(user);
                toast.success("Google sign-in successful!");
                navigate(from, { replace: true });
            })
            .catch((error) => {
                toast.error(error.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className=" bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 flex items-center justify-center ">
            <div className="bg-white/70 backdrop-blur-md p-10 md:p-20 rounded-2xl shadow-2xl w-full ">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <div className=" py-">
                        <img className="w-44 h-25 " src={Logo} alt="Logo" />
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-center mb-10 text-orange-600">
                    Login You Account !!
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Lottie Animation */}
                    <div className="w-full md:w-1/2">
                        <Lottie animationData={loginAnim} loop={true} />
                    </div>

                    {/* Login Form */}
                    <form
                        onSubmit={handleLogin}
                        className="w-full md:w-1/2 bg-white/80 rounded-xl p-6 shadow-xs border-1 border-blue-200"
                    >
                        {/* Email */}
                        <div className="mb-5">
                            <label className="block mb-2 text-lg text-gray-600 font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyle}
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
                                placeholder="Enter your password"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-md text-xl font-semibold text-white transition-transform ${loading
                                ? "bg-orange-600 cursor-not-allowed"
                                : "bg-orange-600 hover:scale-105 hover:shadow-lg"
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
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
                                className="flex items-center justify-center gap-3 w-full  bg-white border border-gray-300 px-5 py-3 rounded-xl shadow hover:shadow-md transition text-lg font-medium"
                            >
                                <FcGoogle className="text-2xl" />
                                Continue with Google
                            </button>
                        </div>

                        {/* Redirect */}
                        <p className="text-center text-gray-600 mt-6">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-orange-600 font-semibold hover:underline"
                            >
                                Register Now!
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
