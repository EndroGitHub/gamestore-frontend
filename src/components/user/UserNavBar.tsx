import { Link, Outlet } from "react-router-dom";
import "./UserNavBar.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from "../custom components/tooltip/Tooltip";
import axios from "axios";
import Modal from "../custom components/modal/Modal";

type searchResultsType = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  offerPercentage?: number;
  category?: string[];
  dateAddedMil?: number;
  result?: string;
}[];

const UserNavBar = (props: { reRender?: boolean }) => {
  const [reRender, setReRender] = useState(false);
  if (props.reRender) {
    setReRender(true);
  }

  const navigate = useNavigate();
  const location = useLocation();

  //guest user states
  const [isGuest, setIsGuest] = useState<boolean>(false);

  //user states
  const [userName, setUserName] = useState<string>("");
  const [balance, setBalance] = useState<number | string>("");

  //search state
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<searchResultsType>([]);

  //modal state
  const [showModal, setShowModal] = useState(false);

  //initial useEffect
  useEffect(() => {
    window.addEventListener("click", () => {
      setSearchText("");
    });
    let guestAuth = localStorage.getItem("guest");
    if (guestAuth) {
      setIsGuest(true);
      setUserName("Guest User");
      setBalance("No balance");
    } else {
      getUserData();
      setReRender(false);
    }
  }, [reRender]);

  //search related useEffect
  useEffect(() => {
    if (searchText) {
      getSearchResult();
    } else {
      setIsSearching(false);
    }
  }, [searchText]);

  const getUserData = async () => {
    await axios
      .get(
        `https://gamestore-api-8t9b.onrender.com/get-user-data/${localStorage.getItem(
          "user"
        )}`
      )
      .then((res) => {
        setUserName(res.data.username);
        setBalance(res.data.balance);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSearchResult = async () => {
    await axios
      .get(`https://gamestore-api-8t9b.onrender.com/search-game/${searchText}`)
      .then((res) => {
        if (!res.data.result) {
          setSearchResults(res.data);
        } else {
          setSearchResults([{ result: "No result found" }]);
        }
        setIsSearching(true);
      })
      .catch((err) => console.log(err));
  };

  const authHandler = () => {
    if (isGuest) {
      localStorage.removeItem("guest");
    } else {
      localStorage.removeItem("user");
    }
    navigate("/login");
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const modalHandler = () => {
    if (localStorage.getItem("guest")) {
      setShowModal(true);
    }
  };

  const modalCancelHandler = () => {
    setShowModal(false);
  };

  const modalContinueHandler = (value: boolean) => {
    if (value) {
      localStorage.removeItem("guest");
      navigate("/login");
    }
  };

  const balanceHandler = () => {
    if (localStorage.getItem("user")) {
      navigate("/add-balance");
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          msg="You need to login to access this route, click continue to login"
          func={modalCancelHandler}
          options={true}
          func2={modalContinueHandler}
        />
      )}
      <div className="user-navbar-outer">
        <div className="user-navbar-div1">
          <p onClick={authHandler}>{isGuest ? "login" : "logout"}</p>
        </div>

        <nav className="user-navbar-nav">
          <section className="user-navbar-nav-sec1">
            <h1>Game-Shop</h1>
          </section>
          <section className="user-navbar-nav-sec2">
            <Link
              className={
                localStorage.getItem("guest") && location.pathname === "/home"
                  ? "active-home"
                  : location.pathname === "/home"
                  ? "active-home"
                  : ""
              }
              to={"/home"}
            >
              HOME
            </Link>
            <Link
              onClick={modalHandler}
              className={
                localStorage.getItem("guest")
                  ? ""
                  : location.pathname === "/cart"
                  ? "active-cart"
                  : ""
              }
              to={localStorage.getItem("guest") ? location.pathname : "/cart"}
            >
              CART
            </Link>
            <Link
              onClick={modalHandler}
              className={
                localStorage.getItem("guest")
                  ? ""
                  : location.pathname === "/your-games"
                  ? "active-your-games"
                  : ""
              }
              to={
                localStorage.getItem("guest")
                  ? location.pathname
                  : "/your-games"
              }
            >
              YOUR-GAMES
            </Link>
          </section>
          <section className="user-navbar-nav-sec3">
            <div>
              <input
                value={searchText}
                onChange={inputChangeHandler}
                placeholder="search for games"
                type="text"
              ></input>
              {isSearching && (
                <span className="search-span-tag">
                  {searchResults[0].title
                    ? searchResults.map((ins) => (
                        <section
                          onClick={() => {
                            navigate(`/buy-game/${ins.title}`);
                          }}
                          key={ins.title}
                        >
                          <img src={`/images/${ins.image}`} alt="game image" />
                          <div>
                            <h2>{ins.title}</h2>
                            <p>
                              {ins.offerPercentage! > 0
                                ? `₹${Math.floor(
                                    ins.price! -
                                      (ins.price! / 100) * ins.offerPercentage!
                                  )}`
                                : ins.price! > 0
                                ? `₹ ${ins.price}`
                                : "Free"}
                            </p>
                          </div>
                        </section>
                      ))
                    : searchResults.map((ins, index) => (
                        <p style={{ padding: "12px" }} key={index}>
                          {ins.result}
                        </p>
                      ))}
                </span>
              )}
              <button
                onClick={() => {
                  isSearching ? navigate(`/search/${searchText}`) : "";
                }}
              >
                search
              </button>
            </div>
          </section>
        </nav>

        <div className="user-navbar-div2">
          <section>Welcome {userName}</section>
          <section onClick={balanceHandler}>
            Balance: {isGuest ? balance : `₹ ${balance}`}
            {isGuest && (
              <span>
                <Tooltip
                  text="Guest user, login to have balance"
                  position="bottom"
                />
              </span>
            )}
          </section>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default UserNavBar;
