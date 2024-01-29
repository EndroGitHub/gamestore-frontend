import { useEffect, useState } from "react";
import "./ConnectionLoader.css";

const ConnectionLoader = () => {
  const [loaderStyle, setLoaderStyle] = useState<{}>({});
  const [counter, setCounter] = useState<number>(30);
  useEffect(() => {
    let counterInterval = setInterval(() => {
      setCounter((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(counterInterval);
          return 0;
        }
      });
    }, 1000);
    let value = 0;
    let myInterval = setInterval(() => {
      value += 120;
      setLoaderStyle({ transform: `rotate(${value}deg)` });
    }, 200);

    return () => {
      clearInterval(myInterval);
      clearInterval(counterInterval);
    };
  }, []);
  return (
    <>
      <div className="connection-loader-text1">
        Please wait for {counter} seconds
      </div>
      <div className="connection-loader-text2">CONNECTING TO THE SERVER</div>
      <div className="connection-loader-loader-container">
        <div style={loaderStyle} className="connection-loader-loader"></div>
      </div>
    </>
  );
};

export default ConnectionLoader;
