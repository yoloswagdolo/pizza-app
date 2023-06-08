import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./home/Home";
import Login from "./auth/Login";
import { useIsAuthenticated } from "react-auth-kit";

// Setup Private Route function due to Require auth bug on redirect
const PrivateRoute = ({ Component }) => {
    const isAuthenticated = useIsAuthenticated();
    const auth = isAuthenticated();
    return auth ? <Component /> : <Navigate to="/login" />;
};

const RouteComponent = () => {
    return (
    <Routes>
        <Route path="/" element ={ <PrivateRoute Component={Home}/>}></Route>
        <Route path="/login" element ={<Login/>}></Route>
    </Routes>
    )

}

export default RouteComponent