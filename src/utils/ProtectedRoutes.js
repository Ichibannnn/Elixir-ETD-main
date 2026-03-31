import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  let auth = sessionStorage.getItem("userToken");

  return auth ? <Outlet /> : (window.location.href = "https://one.rdfmis.com/login");
};

export default ProtectedRoutes;
