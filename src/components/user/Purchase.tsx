import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Purchase.css";
import UserNavBar from "./UserNavBar";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../custom components/modal/Modal";
import TransactionLoader from "../custom components/transaction loader/TransactionLoader";

type gameDataType = {
  image?: string;
  gameName?: string;
  price?: number;
};

const Purchase = () => {
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<gameDataType>({});

  const [showFailModal, setShowFailModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showPaymentProcess, setShowPaymentProcess] = useState<boolean>(false);

  useEffect(() => {
    if (gameData.image) {
      setIsLoading(false);
    } else {
      getGameData();
    }
  }, [gameData]);

  const getGameData = async () => {
    await axios
      .get(`http://localhost:5000/get-game-data/${param.game_title}`)
      .then((res) => {
        if (res.data.title) {
          let price;
          if (res.data.offerPercentage > 0) {
            price = Math.floor(
              res.data.price - (res.data.price / 100) * res.data.offerPercentage
            );
          } else {
            price = res.data.price;
          }
          let data = {
            image: res.data.image,
            gameName: res.data.title,
            price: price,
          };
          setGameData(data);
        } else {
          setGameData({});
        }
      })
      .catch();
  };

  const paymentHandler = async () => {
    setShowPaymentProcess(true);
    let response = await axios.get(
      `http://localhost:5000/get-user-data/${localStorage.getItem("user")}`
    );

    if (gameData.price! > response.data.balance) {
      setModalMessage(
        "Not enough balance in account, click continue to add balance"
      );
      setShowPaymentProcess(false);
      setShowFailModal(true);
    } else {
      await axios.delete(
        `http://localhost:5000/remove-from-cart/${localStorage.getItem(
          "user"
        )}/${gameData.gameName}`
      );

      await axios.put(
        `http://localhost:5000/update-users/${localStorage.getItem("user")}`,
        { balance: response.data.balance - gameData.price! }
      );

      await axios.post("http://localhost:5000/buy-game", {
        username: localStorage.getItem("user"),
        gameName: gameData.gameName,
      });

      setModalMessage("Game purchased successfully");
      setShowPaymentProcess(false);
      setShowSuccessModal(true);
    }
  };

  const modalFailCancelHandler = () => {
    setShowFailModal(false);
  };

  const modalFailContinueHandler = (value: boolean) => {
    if (value) {
      setShowFailModal(false);
      navigate("/add-balance", { state: { path: location.pathname } });
    }
  };

  const modalSuccessCancelHandler = () => {
    setShowSuccessModal(false);
    let directedPath = location.state ? location.state.path : "/home";
    navigate(directedPath);
  };

  return (
    <>
      <UserNavBar />

      {showPaymentProcess && <TransactionLoader displayText={true} />}

      {showFailModal && (
        <Modal
          msg={modalMessage}
          func={modalFailCancelHandler}
          options={true}
          func2={modalFailContinueHandler}
        />
      )}

      {showSuccessModal && (
        <Modal msg={modalMessage} func={modalSuccessCancelHandler} />
      )}

      <div className="purchase-outer">
        {isLoading ? (
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
            Loading...
          </div>
        ) : (
          <div className="purchase-inner">
            <span className="purchase-heading">
              <h1>PAYMENT</h1>
            </span>
            {gameData.gameName ? (
              <div className="purchase-data">
                <img src={`/images/${gameData.image}`} />
                <h1>{gameData.gameName}</h1>
                <p>₹{gameData.price}</p>
                <button onClick={paymentHandler}>Proceed Payment</button>
              </div>
            ) : (
              <h1 className="purchase-empty">No game with this name</h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Purchase;
