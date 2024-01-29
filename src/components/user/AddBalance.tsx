import { useState } from "react";
import "./AddBalance.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavBar from "./UserNavBar";
import Modal from "../custom components/modal/Modal";
import TransactionLoader from "../custom components/transaction loader/TransactionLoader";

const AddBalance = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //balance state
  const [addCustom, setAddCustom] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  //modal state
  const [showModalInitiate, setShowModalInitiate] = useState<boolean>(false);
  const [showModalFinish, setShowModalFinish] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);

  const [showPaymentProcess, setShowPaymentProcess] = useState<boolean>(false);

  const redirectPath = location.state ? location.state.path : "/home";

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addBalance = async () => {
    let response = await axios.get(
      `https://gamestore-api-8t9b.onrender.com/get-user-data/${localStorage.getItem(
        "user"
      )}`
    );
    let newBalance = response.data.balance + balance;
    await axios
      .put(
        `https://gamestore-api-8t9b.onrender.com/update-users/${localStorage.getItem(
          "user"
        )}`,
        { balance: newBalance }
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          setModalMessage("Balance added successfully");
          setShowPaymentProcess(false);
          setShowModalFinish(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const balanceHandler = (value: number) => {
    setBalance(value);
    setModalMessage(`Add ₹${value} in your account`);
    setShowModalInitiate(true);
  };

  const modalInitialCancelHandler = () => {
    setShowModalInitiate(false);
  };

  const modalInitialContinueHandler = (value: boolean) => {
    if (value) {
      addBalance();
      setShowModalInitiate(false);
      setShowPaymentProcess(true);
    }
  };

  const modalFinishCancelHandler = () => {
    setShowModalFinish(false);
    navigate(redirectPath);
  };

  return (
    <>
      <UserNavBar />
      {showPaymentProcess && <TransactionLoader displayText={true} />}

      {showModalInitiate && (
        <Modal
          msg={modalMessage}
          func={modalInitialCancelHandler}
          options={true}
          func2={modalInitialContinueHandler}
        />
      )}

      {showModalFinish && (
        <Modal msg={modalMessage} func={modalFinishCancelHandler} />
      )}
      <div className="add-balance-outer">
        <div className="add-balance-inner">
          <h1>ADD BALANCE</h1>
          <div className="add-balance-normal">
            <button
              onClick={() => {
                balanceHandler(1000);
              }}
            >
              Add ₹1000
            </button>
            <button
              onClick={() => {
                balanceHandler(3000);
              }}
            >
              Add ₹3000
            </button>
            <button
              onClick={() => {
                balanceHandler(5000);
              }}
            >
              Add ₹5000
            </button>
          </div>
          <div className="add-balance-custom">
            <header>
              <button
                onClick={() => {
                  setAddCustom(!addCustom);
                }}
              >
                Add custom balance
              </button>
            </header>
            {addCustom && (
              <div>
                <input
                  value={inputValue}
                  onChange={inputChangeHandler}
                  placeholder="Amount"
                  type="number"
                />
                <button
                  disabled={inputValue ? false : true}
                  onClick={() => {
                    balanceHandler(Number(inputValue));
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBalance;
