import { useEffect, useState } from "react";
import "./Cart.css";
import axios from "axios";
import UserNavBar from "./UserNavBar";
import { useLocation, useNavigate } from "react-router-dom";

type gameDataType = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  offerPercentage?: number;
  category?: string[];
  dateAddedMil?: number;
  isEmpty?: boolean;
}[];

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartData, setCartData] = useState<gameDataType>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCartData();
    setIsRemoved(false);
  }, [isRemoved]);

  useEffect(() => {
    if (cartData.length > 0) {
      setIsLoading(false);
    }
  }, [cartData]);

  const getCartData = async () => {
    let res = await axios.get(
      `http://localhost:5000/get-user-cart/${localStorage.getItem("user")}`
    );

    if (!res.data.result) {
      let i = 0,
        len = res.data.length,
        dataArr = [];
      while (i < len) {
        let game_res = await axios.get(
          `http://localhost:5000/get-game-data/${res.data[i].gameName}`
        );
        dataArr[i] = game_res.data;
        i++;
      }
      setCartData(dataArr);
      setIsEmpty(false);
    } else {
      setCartData([{ isEmpty: true }]);
      setIsEmpty(true);
    }
  };

  const removeHandler = async (gameName: string) => {
    await axios
      .delete(
        `http://localhost:5000/remove-from-cart/${localStorage.getItem(
          "user"
        )}/${gameName}`
      )
      .then((res) => {
        if (res.data.deletedCount > 0) {
          setIsRemoved(true);
        }
      });
  };

  return (
    <>
      <UserNavBar />
      <div className="cart-outer">
        {isLoading ? (
          <div style={{ color: "white", fontWeight: "bold", fontSize: "24px" }}>
            Loading....
          </div>
        ) : (
          <div className="cart-inner">
            <span className="cart-heading">
              <h1>CART</h1>
            </span>

            {isLoading ? (
              <div
                style={{
                  color: "white",
                  textAlign: "center",
                  background: "rgba(255,255,255, 0.1)",
                  padding: "10px",
                }}
              >
                Loading....
              </div>
            ) : isEmpty ? (
              <div className="cart-empty">CART IS EMPTY</div>
            ) : (
              cartData.map((ins) => (
                <section key={ins.title} className="cart-box">
                  <img src={`/images/${ins.image}`} alt="game image" />
                  <div className="cart-data">
                    <div>
                      <h1>{ins.title}</h1>
                    </div>
                    <div className="cart-data-div">
                      <section className="cart-buttons">
                        <button onClick={() => removeHandler(ins.title!)}>
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/payment/${ins.title}`, {
                              state: { path: location.pathname },
                            });
                          }}
                        >
                          Purchase
                        </button>
                      </section>
                      <section className="cart-price">
                        {ins.offerPercentage! > 0 ? (
                          <span>
                            <p>{`₹${Math.floor(
                              ins.price! -
                                (ins.price! / 100) * ins.offerPercentage!
                            )}`}</p>
                            <p>{`${ins.offerPercentage!}% off`}</p>
                          </span>
                        ) : ins.price! > 0 ? (
                          <p>{`₹${ins.price!}`}</p>
                        ) : (
                          <p>Free</p>
                        )}
                      </section>
                    </div>
                  </div>
                </section>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
