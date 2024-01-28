import { useEffect, useState } from "react";
import "./UserGames.css";
import UserNavBar from "./UserNavBar";
import axios from "axios";

type gameDataType = {
  image?: string;
  gameName?: string;
}[];

const UserGames = () => {
  const [gameData, setGameData] = useState<gameDataType>([]);
  const [style, setStyle] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean | string>("");

  useEffect(() => {
    if (gameData.length > 0 || isEmpty) {
      setIsLoading(false);
    } else {
      getGameData();
    }
  }, [gameData, isEmpty]);

  const getGameData = async () => {
    let response = await axios.get(
      `http://localhost:5000/get-user-games/${localStorage.getItem("user")}`
    );
    if (!response.data.result) {
      setIsEmpty(false);
      let i = 0;
      let data: {}[] = [];
      while (i < response.data.length) {
        await axios
          .get(
            `http://localhost:5000/get-game-data/${response.data[i].gameName}`
          )
          .then((res) => {
            data[i] = { image: res.data.image, gameName: res.data.title };
          });
        i++;
      }
      if (response.data.length === 1) {
        setStyle({ gridTemplateColumns: " auto " });
      }
      setGameData(data);
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="user-games-outer">
        {isLoading ? (
          <div style={{ color: "white", fontWeight: "bold", fontSize: "24px" }}>
            Loading....
          </div>
        ) : (
          <div
            style={style}
            className={
              gameData.length > 0
                ? "user-games-inner " + (gameData.length === 2 && "two")
                : "user-games-inner-empty"
            }
          >
            <span className="user-games-heading">
              <h1>YOUR GAMES</h1>
            </span>

            {gameData.length > 0 ? (
              gameData.map((ins) => (
                <section key={ins.gameName} className="user-games-box">
                  <img src={`/images/${ins.image}`} alt="game image" />
                  <div>
                    <h1>{ins.gameName}</h1>
                    <button>PLAY</button>
                  </div>
                </section>
              ))
            ) : (
              <h2 className="user-games-empty">NO GAMES PURCHASED</h2>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserGames;
