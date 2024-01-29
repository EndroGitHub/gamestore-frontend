import { useEffect, useState } from "react";
import "./EntryStyles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../custom components/modal/Modal";

type EntryPropsType = {
  headingText: string;
  buttonText: string;
  navigateMsg: string;
  navigateText: string;
  route: string;
};

const Entry = (props: EntryPropsType) => {
  //using react-router-dom hooks
  const location = useLocation();
  const navigate = useNavigate();

  //User states
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Input styles state
  const [usernameInpStyle, setUsernameInpStyle] = useState<object>({});
  const [passwordInpStyle, setPasswordInpStyle] = useState<object>({});
  const [usernameActive, setUsernameActive] = useState<boolean>(false);
  const [passwordActive, setPasswordActive] = useState<boolean>(false);

  //Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => {
    let authUser = localStorage.getItem("user");
    let authGuest = localStorage.getItem("guest");
    if (authUser || authGuest) {
      navigate("/");
    }

    if (!usernameActive && !passwordActive) {
      setUsernameInpStyle({ height: 0, padding: 0 });
      setPasswordInpStyle({ height: 0, padding: 0 });
    }
    if (usernameActive && !password) {
      setPasswordInpStyle({ height: 0, padding: 0 });
    }
    if (passwordActive && !username) {
      setUsernameInpStyle({ height: 0, padding: 0 });
    }
  }, [usernameActive, passwordActive, username, password]);

  const usernameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(event.target.value);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  //modalHandler functions
  const modalHandler = () => {
    setShowModal(false);
    setShowGuestModal(false);
  };

  //guestHandler function
  const guestHandler = () => {
    setModalMessage(
      "You will be able to view but not buy games if you continue"
    );
    setShowGuestModal(true);
  };

  //modalChoiceHandler function
  const modalChoiceHandler = (value: boolean) => {
    if (value) {
      localStorage.setItem("guest", "Guest Account");
      localStorage.removeItem("pathname");
      navigate("/");
    }
  };

  //submitHandler function
  const submitHandler = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameActive(false);
    setPasswordActive(false);

    //for login
    if (location.pathname === "/login") {
      await axios
        .post("https://gamestore-api-8t9b.onrender.com/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          if (res.data.username) {
            localStorage.setItem("user", username);
            if (localStorage.getItem("pathname")) {
              navigate(localStorage.getItem("pathname")!);
              localStorage.removeItem("pathname");
            } else {
              navigate("/");
            }
          } else {
            setModalMessage("!!! Wrong Credentials !!!");
            setShowModal(true);
            setUsername("");
            setPassword("");
          }
        })
        .catch((err) => console.log(err));
    }

    //for signup
    if (location.pathname === "/signup") {
      let balance = 0;
      await axios
        .post("https://gamestore-api-8t9b.onrender.com/signup", {
          username: username,
          password: password,
          balance: balance,
        })
        .then((res) => {
          if (res.data.username) {
            setModalMessage("User created successfully");
            setShowModal(true);
            setUsername("");
            setPassword("");
            navigate("/login");
          } else {
            setModalMessage("Username already exists");
            setShowModal(true);
            setUsername("");
            setPassword("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {showModal && <Modal msg={modalMessage} func={modalHandler} />}
      {showGuestModal && (
        <Modal
          msg={modalMessage}
          func={modalHandler}
          options={true}
          func2={modalChoiceHandler}
        />
      )}

      <img
        className="entry-bg-image"
        src="/images/bgr1.jpg"
        alt="background image"
      />

      <main className="entry-outer-main">
        <div className="entry-outer">
          <section className="entry-section-1">
            <form onSubmit={submitHandler}>
              <h1>{props.headingText}</h1>
              <header className="entry-input-header">
                <label
                  onClick={() => {
                    setUsernameInpStyle({ height: "20px", padding: "5px 3px" });
                    setUsernameActive(true);
                    setPasswordActive(false);
                  }}
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  style={usernameInpStyle}
                  value={username}
                  onChange={usernameChangeHandler}
                  required
                  autoComplete="off"
                  id="username"
                  type="text"
                />
              </header>
              <header className="entry-input-header">
                <label
                  onClick={() => {
                    setPasswordInpStyle({ height: "20px", padding: "5px 3px" });
                    setPasswordActive(true);
                    setUsernameActive(false);
                  }}
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  style={passwordInpStyle}
                  value={password}
                  onChange={passwordChangeHandler}
                  required
                  autoComplete="off"
                  id="password"
                  type="password"
                />
              </header>
              <header>
                <button type="submit">{props.buttonText}</button>
              </header>
              <header>
                <p>
                  {props.navigateMsg}{" "}
                  <Link to={props.route}>{props.navigateText}</Link>
                </p>
              </header>
            </form>
            <button onClick={guestHandler}>Continue without login</button>
          </section>
        </div>
      </main>
    </>
  );
};

export default Entry;
