import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const Private = () => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (data.length > 0) {
      setIsConnected(true);
    } else {
      getData();
    }
  }, [data]);

  const getData = async () => {
    await axios
      .get("https://gamestore-api-8t9b.onrender.com/get-new-releases")
      .then((res) => {
        setData(res.data);
      });
  };
  let authUser = localStorage.getItem("user");
  let authGuest = localStorage.getItem("guest");

  return !isConnected ? (
    <div style={{ color: "white", textAlign: "center", fontSize: "28px" }}>
      Connecting to the server...
    </div>
  ) : authUser || authGuest ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} />
  );
};

export default Private;
