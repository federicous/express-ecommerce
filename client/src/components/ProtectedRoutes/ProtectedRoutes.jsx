import React from "react";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();


const ProtectedRoutes = () => {
  const location = useLocation();

  return  cookies.get("token")
    ? <Outlet />
    : <Navigate to="/" replace state={{ from: location }} />;
}

export default ProtectedRoutes