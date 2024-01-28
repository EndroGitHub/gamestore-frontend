import { useEffect, useState } from "react";
import "./ShowResults.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserNavBar from "../../user/UserNavBar";

type ShowResultsPropsType = {
  type: string;
  heading?: string;
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

const ShowResults = (props: ShowResultsPropsType) => {
  const param = useParams();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<gameDataType>([]);
  const [isLastPage, setIsLastPage] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [param.search_key]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    getGameData();
  }, [page, param.search_key]);

  useEffect(() => {
    if (gameData.length > 0 || isEmpty) {
      setIsloading(false);
    }
  }, [gameData, isEmpty]);

  const getGameData = async () => {
    let api: string;
    if (props.type === "category") {
      if (param.category === "All Games") {
        api = `https://gamestore-api.onrender.com/get-all-games/${page}`;
      } else {
        api = `https://gamestore-api.onrender.com/get-categoty-games/${param.category}/${page}`;
      }
    }

    if (props.type === "discount") {
      api = `https://gamestore-api.onrender.com/get-all-discount/${page}`;
    }

    if (props.type === "search") {
      api = `https://gamestore-api.onrender.com/search-all-games/${param.search_key}/${page}`;
    }

    await axios
      .get(api!)
      .then((res) => {
        if (!res.data.result) {
          setIsEmpty(false);
          setGameData(res.data.data);
          setIsLastPage(res.data.lastPage);
        } else {
          setIsEmpty(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const prevButtonHandler = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const nextButtonHandler = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <UserNavBar />
      {isLoading ? (
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "24px",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          Loading....
        </div>
      ) : (
        <div id="show-results-id-outer" className="show-results-outer">
          <div className="show-results-inner">
            <span className="show-results-heading">
              <h1>
                {props.heading
                  ? props.heading
                  : param.category!.toLocaleUpperCase()}
              </h1>
            </span>
            <span className="show-results-page-buttons">
              <button
                onClick={prevButtonHandler}
                className={page === 1 ? "" : "show-results-button-active"}
                disabled={page === 1 ? true : false}
              >
                prev
              </button>
              <p>{page}</p>
              <button
                onClick={nextButtonHandler}
                className={isLastPage ? "" : "show-results-button-active"}
                disabled={isLastPage ? true : false}
              >
                next
              </button>
            </span>

            {isEmpty ? (
              <div className="show-results-empty">No Results Found</div>
            ) : (
              gameData.map((ins) => (
                <section
                  onClick={() => {
                    navigate(`/buy-game/${ins.title}`);
                  }}
                  key={ins.title}
                  className="show-results-section"
                >
                  <img src={`/images/${ins.image}`} alt="Game Image" />
                  <div className="show-results-data">
                    <h1>{ins.title}</h1>
                    <div className="show-results-data-category">
                      <div>
                        {ins.category!.map((ins, index) => (
                          <p key={index}>{ins}</p>
                        ))}
                      </div>

                      <span className="show-results-data-price">
                        {ins.offerPercentage! > 0 ? (
                          <span>
                            <p>{`₹${Math.floor(
                              ins.price! -
                                (ins.price! / 100) * ins.offerPercentage!
                            )}`}</p>
                            <p>{`${ins.offerPercentage}% off`}</p>
                          </span>
                        ) : ins.price! > 0 ? (
                          <p>{`₹${ins.price}`}</p>
                        ) : (
                          <p>Free To Play</p>
                        )}
                      </span>
                    </div>
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShowResults;
