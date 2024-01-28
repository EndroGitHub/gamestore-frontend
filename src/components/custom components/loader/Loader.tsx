import { useEffect, useState } from "react";
import "./Loader.css";

const Loader = () => {
  const [loaderStyle, setLoaderStyle] = useState<{}>({});

  useEffect(() => {
    let degValue = 0;
    let myInterval1 = setInterval(() => {
      degValue += 150;
      setLoaderStyle({ transform: `rotate(${degValue}deg)` });
    }, 1000);
    let myInterval2 = setInterval(() => {
      degValue += 20;
      setLoaderStyle({ transform: `rotate(${degValue}deg)` });
    }, 100);

    return () => {
      clearInterval(myInterval1);
      clearInterval(myInterval2);
    };
  }, []);
  return (
    <>
      <div className={"loader-outer "}>
        <div style={loaderStyle} className="loader-inner"></div>
      </div>
    </>
  );
};

export default Loader;
