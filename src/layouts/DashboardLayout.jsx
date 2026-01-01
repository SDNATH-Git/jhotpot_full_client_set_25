// import React from 'react';
// import { Link, NavLink, Outlet } from 'react-router';
// // import ProFastLogo from '../pages/shared/ProFastLogo/ProFastLogo';
// import logo from '../assets/logoD.png'
// import { FaHome, FaBoxOpen, FaMoneyCheckAlt, FaUserEdit, FaSearchLocation, FaUserCheck, FaUserClock, FaUserShield, FaMotorcycle, FaTasks, FaCheckCircle, FaWallet } from 'react-icons/fa';
// import useUserRole from '../hooks/useUserRole';
// import ChatBoth from '../components/AIchatBoth/ChatBoth';
// import { BiSolidDashboard } from "react-icons/bi";

// const DashboardLayout = () => {

//     const { role, roleLoading } = useUserRole();

//     return (
//         <div className="drawer lg:drawer-open  ">
//             <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
//             <div className="drawer-content flex flex-col ">

//                 {/* Navbar */}
//                 <div className="navbar bg-[#03373D] w-full lg:hidden shadow-orange-500 ">
//                     <div className="flex-none text-white ">
//                         <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 className="inline-block h-6 w-6 stroke-current"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M4 6h16M4 12h16M4 18h16"
//                                 ></path>
//                             </svg>
//                         </label>
//                     </div>
//                     <div className="mx-2 font-bold text-white flex-1 px-2 lg:hidden">Dashboard</div>

//                 </div>
//                 {/* Page content here */}
//                 <Outlet></Outlet>
//                 {/* Page content here */}

//             </div>
//             <div className="drawer-side ">
//                 <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
//                 <ul className="menu bg-[#03373D] text-white min-h-full ">
//                     {/* Sidebar content here */}
//                     {/* <ProFastLogo></ProFastLogo> */}
//                     <Link to="/">
//                         <div className='flex items-start  border-b-4 border-[#F04C2B] mb-4 '>
//                             <img className='mb-2 w-[200px]' src={logo} alt="" />
//                             {/* <p className='text-3xl -ml-2 font-extrabold'>ProFast</p> */}
//                         </div>
//                     </Link>


//                     <li>
//                         <NavLink to="/dashboard">
//                             <FaHome className="inline-block mr-2" />
//                             Home
//                         </NavLink>
//                     </li>
//                     {/* <li>
//                         <NavLink to="/dashboard/adminDashboard">
//                             <FaHome className="inline-block mr-2" />
//                             Dashboard
//                         </NavLink>
//                     </li> */}
//                     <li>
//                         <NavLink to="/dashboard/myParcels">
//                             <FaBoxOpen className="inline-block mr-2" />
//                             My Parcels
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/dashboard/paymentHistory">
//                             <FaMoneyCheckAlt className="inline-block mr-2" />
//                             Payment History
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/dashboard/track">
//                             <FaSearchLocation className="inline-block mr-2" />
//                             Track a Package
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/dashboard/profile">
//                             <FaUserEdit className="inline-block mr-2" />
//                             Update Profile
//                         </NavLink>
//                     </li>
//                     {/* rider links */}
//                     {!roleLoading && role === 'rider' && <>
//                         <li>
//                             <NavLink to="/dashboard/pending-deliveries">
//                                 <FaTasks className="inline-block mr-2" />
//                                 Pending Deliveries
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to="/dashboard/completed-deliveries">
//                                 <FaCheckCircle className="inline-block mr-2" />
//                                 Completed Deliveries
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to="/dashboard/my-earnings">
//                                 <FaWallet className="inline-block mr-2" />
//                                 My Earnings
//                             </NavLink>
//                         </li>
//                     </>}


//                     {/* admin link */}
//                     {!roleLoading && role === 'admin' &&
//                         <>
//                             <li>
//                                 <NavLink to="/dashboard/adminDashboard">
//                                     {/* <FaHome className="inline-block mr-2" /> */}
//                                     <BiSolidDashboard className="inline-block mr-2" />
//                                     Dashboard
//                                 </NavLink>
//                             </li>

//                             <li>
//                                 <NavLink to="/dashboard/assign-rider">
//                                     <FaMotorcycle className="inline-block mr-2" />
//                                     Assign Rider
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/active-riders">
//                                     <FaUserCheck className="inline-block mr-2" />
//                                     Active Riders
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/pending-riders">
//                                     <FaUserClock className="inline-block mr-2" />
//                                     Pending Riders
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/makeAdmin">
//                                     <FaUserShield className="inline-block mr-2" />
//                                     Make Admin
//                                 </NavLink>
//                             </li>
//                         </>
//                     }
//                 </ul>
//             </div>



//             {/* Ai chat ChatBoth */}
//             <ChatBoth></ChatBoth>

//         </div>
//     );
// };

// export default DashboardLayout;




import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import logo from '../assets/logoD.png';

import {
    FaHome,
    FaBoxOpen,
    FaMoneyCheckAlt,
    FaUserEdit,
    FaSearchLocation,
    FaUserCheck,
    FaUserClock,
    FaUserShield,
    FaMotorcycle,
    FaTasks,
    FaCheckCircle,
    FaWallet,
} from 'react-icons/fa';

import { BiSolidDashboard } from "react-icons/bi";
import useUserRole from '../hooks/useUserRole';
import ChatBoth from '../components/AIchatBoth/ChatBoth';

const DashboardLayout = () => {
    const { role, roleLoading } = useUserRole();

    /* 🔹 Active NavLink Style */
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "bg-[#F04C2B] text-white font-semibold rounded-lg border-l-4 border-white"
            : "hover:bg-[#044A52] text-white rounded-lg";

    /* 🔹 Mobile drawer close */
    const closeDrawer = () => {
        const drawer = document.getElementById("my-drawer-2");
        if (drawer) drawer.checked = false;
    };

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* ================= CONTENT ================= */}
            <div className="drawer-content flex flex-col">

                {/* 🔹 Mobile Navbar */}
                <div className="navbar bg-[#03373D] w-full lg:hidden">
                    <div className="flex-none text-white">
                        <label
                            htmlFor="my-drawer-2"
                            className="btn btn-square btn-ghost"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 font-bold text-white flex-1 px-2">
                        Dashboard
                    </div>
                </div>

                {/* 🔹 Page Content */}
                <Outlet />
            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

                <ul className="menu bg-[#03373D] text-white min-h-full w-72 p-4">

                    {/* 🔹 Logo */}
                    <Link to="/" onClick={closeDrawer}>
                        <div className="border-b-4 border-[#F04C2B] mb-4 pb-2">
                            <img className="w-[200px]" src={logo} alt="Logo" />
                        </div>
                    </Link>

                    {/* 🔹 Common Routes */}
                    <li>
                        <NavLink
                            to="/dashboard"
                            end
                            className={navLinkClass}
                            onClick={closeDrawer}
                        >
                            <FaHome className="mr-2" />
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/myParcels"
                            className={navLinkClass}
                            onClick={closeDrawer}
                        >
                            <FaBoxOpen className="mr-2" />
                            My Parcels
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/paymentHistory"
                            className={navLinkClass}
                            onClick={closeDrawer}
                        >
                            <FaMoneyCheckAlt className="mr-2" />
                            Payment History
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/track"
                            className={navLinkClass}
                            onClick={closeDrawer}
                        >
                            <FaSearchLocation className="mr-2" />
                            Track a Package
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/profile"
                            className={navLinkClass}
                            onClick={closeDrawer}
                        >
                            <FaUserEdit className="mr-2" />
                            Update Profile
                        </NavLink>
                    </li>

                    {/* ================= RIDER ================= */}
                    {!roleLoading && role === 'rider' && (
                        <>
                            <div className="divider text-white font-extrabold bg-[#0D5EA6] border-l-4 border-white rounded-xl">RIDER</div>

                            <li>
                                <NavLink
                                    to="/dashboard/pending-deliveries"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaTasks className="mr-2" />
                                    Pending Deliveries
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/completed-deliveries"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Completed Deliveries
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/my-earnings"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaWallet className="mr-2" />
                                    My Earnings
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* ================= ADMIN ================= */}
                    {!roleLoading && role === 'admin' && (
                        <>
                            <div className="divider text-white font-extrabold bg-[#0D5EA6] border-l-4 border-white rounded-xl">ADMIN</div>

                            <li>
                                <NavLink
                                    to="/dashboard/adminDashboard"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <BiSolidDashboard className="mr-2" />
                                    Dashboard
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/assign-rider"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaMotorcycle className="mr-2" />
                                    Assign Rider
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/active-riders"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaUserCheck className="mr-2" />
                                    Active Riders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/pending-riders"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaUserClock className="mr-2" />
                                    Pending Riders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/makeAdmin"
                                    className={navLinkClass}
                                    onClick={closeDrawer}
                                >
                                    <FaUserShield className="mr-2" />
                                    Make Admin
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* 🔹 AI Chat Bot */}
            <ChatBoth />
        </div>
    );
};

export default DashboardLayout;

