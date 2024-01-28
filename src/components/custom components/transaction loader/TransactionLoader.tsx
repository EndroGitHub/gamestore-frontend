import { useState, useEffect } from "react";
import "./TransactionLoader.css";

const TransactionLoader = (props: { displayText: boolean }) => {
  const [spinnerStyle, setSpinnerStyle] = useState<{}>({});

  useEffect(() => {
    let degValue = 0;
    let myInterval1 = setInterval(() => {
      degValue += 150;
      setSpinnerStyle({ transform: `rotate(${degValue}deg)` });
    }, 1000);
    let myInterval2 = setInterval(() => {
      degValue += 20;
      setSpinnerStyle({ transform: `rotate(${degValue}deg)` });
    }, 100);

    return () => {
      clearInterval(myInterval1);
      clearInterval(myInterval2);
    };
  }, []);
  return (
    <>
      <div className="transaction-loader-outer">
        <div className="transaction-loader-inner">
          <div
            style={spinnerStyle}
            className="transaction-loader-spinner"
          ></div>
          {props.displayText && (
            <div className="transaction-loader-text">
              Processing Transaction
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionLoader;
