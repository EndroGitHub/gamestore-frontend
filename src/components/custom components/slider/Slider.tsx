import { useEffect, useState } from "react";
import "./Slider.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";

type SliderPropsType = {
  content: string;
  heading: string;
};

type currentDataType = {
  title?: string;
  image?: string;
  description?: string;
  price?: number;
  offerPercentage?: number;
};

type gameDataType = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  offerPercentage?: number;
  category?: string[];
  dateAddedMil?: number;
}[];

const Slider = (props: SliderPropsType) => {
  //React-Router hooks
  const navigate = useNavigate();

  //Game data related states
  const [gameData, setGameData] = useState<gameDataType>([]);
  const [gameDataLength, setGameDataLength] = useState<number>(0);
  const [dataIndex, setDataIndex] = useState<number>(0);
  const [currentData, setCurrentData] = useState<currentDataType>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //slider styles state
  const [sliderStyle, setSliderStyle] = useState<{}>({});

  //initial load useEffect
  useEffect(() => {
    if (gameData.length > 0) {
      setIsLoading(false);
    } else {
      if (props.content === "newRelease") {
        getNewReleaseData();
      }
      if (props.content === "topDiscount") {
        getTopDiscountData();
      }
    }
  }, [gameData]);

  //useEffect for slider change
  useEffect(() => {
    if (gameData.length > 0) {
      setTimeout(() => {
        setSliderStyle({ opacity: 1 });
        setCurrentData(gameData[dataIndex]);
      }, 100);
    }
  }, [dataIndex]);

  const getNewReleaseData = async () => {
    await axios
      .get("http://localhost:5000/get-new-releases")
      .then((res) => {
        setGameData(res.data);
        setGameDataLength(res.data.length);
        setCurrentData(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTopDiscountData = async () => {
    await axios
      .get("http://localhost:5000/get-discount-games")
      .then((res) => {
        setGameData(res.data);
        setGameDataLength(res.data.length);
        setCurrentData(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prevClickHandler = () => {
    setSliderStyle({ opacity: 0 });
    if (dataIndex === 0) {
      setDataIndex(gameDataLength - 1);
    } else {
      setDataIndex(dataIndex - 1);
    }
  };

  const nextClickHandler = () => {
    setSliderStyle({ opacity: 0 });
    if (dataIndex === gameDataLength - 1) {
      setDataIndex(0);
    } else {
      setDataIndex(dataIndex + 1);
    }
  };

  const navigateToGame = () => {
    navigate(`/buy-game/${currentData.title}`);
  };

  return (
    <>
      <div className="slider-outer">
        <button
          onClick={prevClickHandler}
          className="slider-prev-btn"
        >{`<`}</button>

        <section className="slider-section">
          <div>
            <span className="slider-heading">
              <h1>{props.heading}</h1>
              {props.content === "topDiscount" && (
                <button
                  disabled={isLoading ? true : false}
                  onClick={() => {
                    navigate("/top-discounts");
                  }}
                >
                  EXPLORE MORE
                </button>
              )}
            </span>
            {!isLoading && (
              <span className="slider-indicator">
                {gameData.map(({}, index) => (
                  <div
                    onClick={() => {
                      setSliderStyle({ opacity: 0 });
                      setDataIndex(index);
                    }}
                    key={index}
                    className={index === dataIndex ? "active" : ""}
                  ></div>
                ))}
              </span>
            )}
          </div>

          <div
            onClick={navigateToGame}
            style={sliderStyle}
            className="slider-container"
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <img src={`/images/${currentData.image}`} alt="Game image" />
                <span className="slider-section-span">
                  <h1>{currentData.title}</h1>
                  <div>
                    {currentData.offerPercentage! > 0 ? (
                      <span>
                        <p>{`${currentData.offerPercentage}% off`}</p>
                        <p>{`₹${currentData.price}`}</p>
                        <p>
                          {`₹${Math.floor(
                            currentData.price! -
                              currentData.price! *
                                (currentData.offerPercentage! / 100)
                          )}`}
                        </p>
                      </span>
                    ) : currentData.price! > 0 ? (
                      `₹${currentData.price}`
                    ) : (
                      `Free To Play`
                    )}
                  </div>
                </span>
                <div className="slider-section-div">
                  <h1>{currentData.title}</h1>
                  <p>{currentData.description}</p>
                  <div>
                    {currentData.offerPercentage! > 0 ? (
                      <span>
                        <p>{`${currentData.offerPercentage}% off`}</p>
                        <p>{`₹${currentData.price}`}</p>
                        <p>
                          {`₹${Math.floor(
                            currentData.price! -
                              currentData.price! *
                                (currentData.offerPercentage! / 100)
                          )}`}
                        </p>
                      </span>
                    ) : currentData.price! > 0 ? (
                      `₹${currentData.price}`
                    ) : (
                      `Free To Play`
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <button
          onClick={nextClickHandler}
          className="slider-next-btn"
        >{`>`}</button>
      </div>
    </>
  );
};

export default Slider;
