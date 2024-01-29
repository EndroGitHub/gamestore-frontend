import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useParams, Navigate } from "react-router-dom";

const PaymentChecker = () => {
  const param = useParams();

  const [checked, setChecked] = useState<boolean>(false);
  const [isNotPuchased, setIsNotPuchased] = useState<boolean | string>("");

  useEffect(() => {
    if (isNotPuchased !== "") {
      setChecked(true);
    } else {
      checkFunction();
    }
  }, [isNotPuchased]);

  const checkFunction = async () => {
    await axios
      .get(
        `https://gamestore-api-8t9b.onrender.com/check-game-in-your-games/${localStorage.getItem(
          "user"
        )}/${param.game_title}`
      )
      .then((res) => {
        if (res.data.username) {
          setIsNotPuchased(false);
        } else {
          setIsNotPuchased(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return checked ? (
    localStorage.getItem("user") && isNotPuchased ? (
      <Outlet />
    ) : (
      <Navigate to={"/home"} />
    )
  ) : (
    <div style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
      Checking...
    </div>
  );
};

export default PaymentChecker;
