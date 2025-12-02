
import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../../assets/Logo.png";
import { toast } from "react-toastify";
import { Link as ScrollLink } from "react-scroll";
import { AuthContext } from "../../../contexts/AuthContext/AuthProvider";



const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");
            setIsMenuOpen(false);
        } catch (error) {
            toast.error("Logout failed!");
        }
    };

    // ✅ public vs protected routes
    // const navLinks = user
    //     ? [
    //         { name: "Home", path: "/" },
    //         { name: "Search", path: "/search" },
    //         { name: "Blog", path: "/blog" },
    //         { name: "Donation Requests", path: "/donationRequest" },
    //         { name: "Funding", path: "/funding" },
    //     ]
    //     : [
    //         { name: "Home", path: "/" },
    //         { name: "Search", path: "/search" },
    //         { name: "Blog", path: "/blog" },
    //     ];

    const navLinks = [
        { name: "Home", path: "/" },
        // { name: "Services", path: "/services" },
        { name: "Coverage", path: "/coverage" },
        { name: "About_Us", path: "/about_Us" },
        { name: "SendParcel", path: "/sendParcel" },
        { name: "Be a Rider", path: "/beARider" },
    ];

    const renderNavLinks = (onClickClose = null) =>
        navLinks.map((link) => (
            <NavLink
                key={link.name}
                to={link.path}
                onClick={() => onClickClose?.()}
                className={({ isActive }) =>
                    `px-4 py-2 rounded-md font-medium transition duration-300 ${isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                }
            >
                {link.name}
            </NavLink>
        ));

    return (
        <header
            className={`bg-white sticky top-0 z-50 transition-all duration-300 border-b-4 border-transparent shadow-xs ${isSticky ? "border-orange-500 shadow-lg" : ""
                }`}
        >
            <div className="container py-1 px-5 md:px-10 flex items-center justify-between ">
                {/* Logo */}
                <div className="flex items-center">
                    <div className=" py-">
                        <img className="w-25 h-15 " src={Logo} alt="Logo" />
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-4">
                    {renderNavLinks()}

                    {user ? (
                        <div className="relative">
                            <img
                                src={user.photoURL || "https://i.ibb.co/ZJcYB2g/default-user.png"}
                                alt="user avatar"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-red-600"
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-20 p-4 text-gray-800">
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <div className="block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                            Dashboard
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full mt-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <NavLink to="/login">
                                <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition btn">
                                    Login
                                </button>
                            </NavLink>
                            <NavLink to="/register">
                                <button className="px-4 py-2 bg-[#0D5EA6] text-white rounded-md hover:bg-[#073258] transition btn">
                                    Register
                                </button>
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile Burger */}
                <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white px-4 pb-4 shadow-md z-50">
                    <div className="flex flex-col space-y-2 text-base">
                        {renderNavLinks(() => setIsMenuOpen(false))}
                    </div>

                    {/* user avatar */}
                    <div className="mt-4 border-t pt-4 space-y-2">

                        {user && (
                            <img
                                src={user.photoURL || "/default-avatar.png"}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}

                        {user ? (
                            <div className="flex flex-col gap-3">
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    <button className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700">
                                        Dashboard
                                    </button>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <button className="w-full py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                                        Login
                                    </button>
                                </NavLink>
                                <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                                    <button className="w-full py-2 bg-[#0D5EA6] text-white rounded-md hover:bg-[#073258] transition">
                                        Register
                                    </button>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

