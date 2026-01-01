import { useEffect, useState, useContext } from "react";
import Lottie from "lottie-react";
import welcomeAnimation from "../../../assets/Welcome Animation.json";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../contexts/AuthContext/AuthProvider";
import { FaUserShield, FaMotorcycle, FaUser, FaEnvelope, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import Loading from "../../../components/Loading";


const PRIMARY_COLOR = '#0D5EA6';
const ACCENT_COLOR = '#F04C2B';
const TEXT_SHADE = '#03373D';

const Dashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user: authUser } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch logged-in user from backend
    useEffect(() => {
        axiosSecure
            .get("/users/me")
            .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log("User fetch failed:", err);
                setUser(authUser); // fallback to AuthContext user
                setLoading(false);
            });
    }, [authUser, axiosSecure]);

    const getDashboardTitle = (role) => {
        switch (role) {
            case "admin":
                return "Admin Control Panel";
            case "rider":
                return "Rider Operations Hub";
            case "user":
            default:
                return "User Profile Dashboard";
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin":
                return <FaUserShield className="text-2xl" style={{ color: ACCENT_COLOR }} />;
            case "rider":
                return <FaMotorcycle className="text-2xl" style={{ color: ACCENT_COLOR }} />;
            case "user":
            default:
                return <FaUser className="text-2xl" style={{ color: ACCENT_COLOR }} />;
        }
    };

    // Function to handle card styling based on role/status
    const getCardStyle = (role) => {
        const base = "rounded-xl p-5 text-center shadow-lg transition duration-300 transform hover:scale-[1.02] border-b-4";
        switch (role) {
            case "admin":
                return `${base} bg-[linear-gradient(270deg,#FFF9FC_0%,#FFEFF9_100%)] border-red-400`;
            case "rider":
                return `${base} bg-[linear-gradient(270deg,#FFF9FC_0%,#FFEFF9_100%)] border-yellow-400`;
            case "active":
            case "user":
                return `${base} bg-[linear-gradient(270deg,#F9FCFF_0%,#F0F7FF_100%)] border-blue-400`;
            case "deactivated":
            case "rejected":
                return `${base} bg-red-400 border-gray-400`;
            default:
                return `${base} bg-[linear-gradient(270deg,#FFF9FC_0%,#FFEFF9_100%)] border-gray-300`;
        }
    };


    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
                <p className="text-gray-600 ml-3">Loading.... </p>
            </div>
        );

    const userRole = user?.role || 'user';
    const userStatus = user?.status || 'active';

    return (
        <div className="py-8 px-4 sm:px-6 md:px-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">

                {/* Main Welcome Header Section */}
                <div className="bg-white rounded-xl p-6 sm:p-8 md:p-10 shadow-2xl mb-8 border-l-8" style={{ borderColor: ACCENT_COLOR }}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3" style={{ color: TEXT_SHADE }}>
                                {getDashboardTitle(userRole)}
                            </h1>
                            <p className="text-xl sm:text-2xl font-light text-gray-700">
                                Welcome back,{" "}
                                <span className="font-extrabold" style={{ color: ACCENT_COLOR }}>
                                    {user?.name || user?.displayName || "Valued User"}
                                </span>
                                ! 👋
                            </p>
                            <p className="text-md mt-2 text-gray-500">
                                Your central hub for all activities and settings.
                            </p>
                        </div>

                        <div className="w-48 sm:w-56 md:w-60 h-48 sm:h-56 md:h-60 flex-shrink-0">
                            <Lottie animationData={welcomeAnimation} loop={true} />
                        </div>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card 1: Role */}
                    <div className={getCardStyle(userRole)} style={{ borderColor: PRIMARY_COLOR }}>
                        <div className="flex items-center justify-center mb-3">
                            {getRoleIcon(userRole)}
                        </div>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: PRIMARY_COLOR }}>
                            Your Role
                        </h3>
                        <p className="capitalize text-2xl font-extrabold" style={{ color: TEXT_SHADE }}>
                            {userRole}
                        </p>
                    </div>

                    {/* Card 2: Status */}
                    <div className={getCardStyle(userStatus)} style={{ borderColor: userStatus === 'active' ? 'green' : ACCENT_COLOR }}>
                        <div className="flex items-center justify-center mb-3">
                            {userStatus === 'active' ? (
                                <FaCheckCircle className="text-2xl text-green-600" />
                            ) : (
                                <FaExclamationTriangle className="text-2xl" style={{ color: ACCENT_COLOR }} />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: userStatus === 'active' ? 'green' : ACCENT_COLOR }}>
                            Account Status
                        </h3>
                        <p className="capitalize text-2xl font-extrabold" style={{ color: TEXT_SHADE }}>
                            {userStatus}
                        </p>
                    </div>

                    {/* Card 3: Email */}
                    <div className={getCardStyle('default')} style={{ borderColor: PRIMARY_COLOR }}>
                        <div className="flex items-center justify-center mb-3">
                            <FaEnvelope className="text-2xl" style={{ color: PRIMARY_COLOR }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: PRIMARY_COLOR }}>
                            Primary Email
                        </h3>
                        <p className="text-lg font-medium break-words text-gray-700">
                            {user?.email}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
