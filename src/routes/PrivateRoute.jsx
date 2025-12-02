


import React from 'react';
// import { AuthContext } from "../contexts/AuthContext/AuthContext";
import Loading from "../components/Loading";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from '../contexts/AuthContext/AuthProvider';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    if (user && user.email) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
