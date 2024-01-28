import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./BuyGame.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../custom components/modal/Modal";
import UserNavBar from "./UserNavBar";
import Loader from "../custom components/loader/Loader";

type gameDataType = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  offerPercentage?: number;
  category?: string[];
  dateAddedMil?: number;
};

const BuyGame = () => {
  //Browser-Router hooks
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  //Game data state
  const [gameData, setGameData] = useState<gameDataType>({});
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isInCart, setIsInCart] = useState<boolean | "">("");
  const [isInYourGames, setIsInYourGames] = useState<boolean | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //modal state
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  useEffect(() => {
    getGameData();
  }, [param.game_title]);

  useEffect(() => {
    if (gameData.image && isInCart !== "" && isInYourGames !== "") {
      setIsLoading(false);
    }
    if (gameData.image && localStorage.getItem("guest")) {
      setIsLoading(false);
    }
  }, [isInCart, gameData, isInYourGames]);

  const getGameData = async () => {
    await axios
      .get(
        `https://gamestore-api-3gln.onrender.com/get-game-data/${param.game_title}`
      )
      .then((res) => {
        setGameData(res.data);
        let date = new Date(res.data.dateAddedMil);
        setReleaseDate(
          `${date.getDate()} ${date.toLocaleString("default", {
            month: "long",
          })}, ${date.getFullYear()}`
        );
        setCategories(res.data.category);
      })
      .catch((err) => console.log(err));

    if (!localStorage.getItem("guest")) {
      await axios
        .get(
          `https://gamestore-api-3gln.onrender.com/check-game-in-cart/${localStorage.getItem(
            "user"
          )}/${param.game_title}`
        )
        .then((res) => {
          if (res.data.username) {
            setIsInCart(true);
          } else {
            setIsInCart(false);
          }
        })
        .catch((err) => console.log(err));

      await axios
        .get(
          `https://gamestore-api-3gln.onrender.com/check-game-in-your-games/${localStorage.getItem(
            "user"
          )}/${param.game_title}`
        )
        .then((res) => {
          if (res.data.username) {
            setIsInYourGames(true);
          } else {
            setIsInYourGames(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const cartHandler = async () => {
    if (localStorage.getItem("guest")) {
      setShowGuestModal(true);
    } else {
      await axios
        .post("https://gamestore-api-3gln.onrender.com/add-to-cart", {
          username: localStorage.getItem("user"),
          gameName: param.game_title,
        })
        .then((res) => {
          if (res.data.username) {
            setIsInCart(true);
            setModalMessage(`${param.game_title} added to cart`);
            setShowUserModal(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const purchaseHandler = () => {
    if (localStorage.getItem("guest")) {
      setShowGuestModal(true);
    } else {
      navigate(`/payment/${param.game_title}`, {
        state: { path: location.pathname },
      });
    }
  };

  const modalCancelHandler = () => {
    setShowGuestModal(false);
    setShowUserModal(false);
  };

  const modalContinueHandler = (value: boolean) => {
    if (value) {
      localStorage.removeItem("guest");
      localStorage.setItem("pathname", location.pathname);
      navigate("/login");
    }
  };

  return (
    <>
      <UserNavBar />
      {showGuestModal && (
        <Modal
          msg="You need to login to access this feature, click continue to login"
          func={modalCancelHandler}
          options={true}
          func2={modalContinueHandler}
        />
      )}

      {showUserModal && <Modal msg={modalMessage} func={modalCancelHandler} />}

      <div className="buy-game-outer">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="buy-game-div1">
              <section className="buy-game-container">
                <img src={`/images/${gameData.image}`} />

                <span className="buy-game-heading">
                  <h1>{gameData.title}</h1>
                </span>

                <div className="buy-game-data">
                  <div className="buy-game-data-des">
                    <h1>ABOUT GAME</h1>
                    <p>{gameData.description}</p>
                  </div>
                  <div className="buy-game-data-date">
                    RELEASE DATE: <span>{releaseDate}</span>
                  </div>
                  <div className="buy-game-data-category">
                    {categories.map((ins, index) => (
                      <p
                        onClick={() => {
                          navigate(`/category/${ins}`);
                        }}
                        key={index}
                      >
                        {ins}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <div className="buy-game-div2">
              <section className="buy-game-buy">
                <div className="buy-game-buy-price">
                  {gameData.offerPercentage! > 0 ? (
                    <span className="buy-game-buy-price-span">
                      <p>{`${gameData.offerPercentage}% off`}</p>
                      <p>
                        {`₹${Math.floor(
                          gameData.price! -
                            (gameData.price! / 100) * gameData.offerPercentage!
                        )}`}
                      </p>
                    </span>
                  ) : gameData.price! > 0 ? (
                    `₹${gameData.price}`
                  ) : (
                    "FREE"
                  )}
                </div>
                <div className="buy-game-buy-button">
                  {isInYourGames ? (
                    <button
                      onClick={() => {
                        navigate("/your-games");
                      }}
                      className="buy-game-buy-button-view-in-your-games"
                    >
                      View in Your Games
                    </button>
                  ) : (
                    <main>
                      <button
                        disabled={isInCart ? true : false}
                        className={
                          isInCart
                            ? "buy-game-add-to-cart-disabled"
                            : "buy-game-add-to-cart-enabled"
                        }
                        onClick={cartHandler}
                      >
                        Add to Cart
                      </button>
                      <button onClick={purchaseHandler}>Purchase</button>
                    </main>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BuyGame;
