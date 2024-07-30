import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  let auth = sessionStorage.getItem("userToken");

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
