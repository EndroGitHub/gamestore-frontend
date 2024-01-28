import { Outlet, Navigate } from "react-router-dom";

const Private = () => {
  let authUser = localStorage.getItem("user");
  let authGuest = localStorage.getItem("guest");

  return authUser || authGuest ? <Outlet /> : <Navigate to={"/login"} />;
};

export default Private;
