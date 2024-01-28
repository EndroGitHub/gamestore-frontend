import { Navigate, Outlet } from "react-router-dom";

const GuestUserChecker = () => {
  let guestAuth = localStorage.getItem("guest");
  return guestAuth ? <Navigate to={"/home"} /> : <Outlet />;
};

export default GuestUserChecker;
