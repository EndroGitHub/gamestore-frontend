import { useEffect, useState } from "react";
import "./Modal.css";

type ModalPropsType = {
  msg: string;
  func: () => void;
  options?: boolean;
  func2?: (val: boolean) => void;
};

const Modal = (props: ModalPropsType) => {
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (props.options) {
      setShowOptions(true);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const cancelAlert = () => {
    props.func();
  };

  const continueFunc = (value: boolean) => {
    if (props.func2) {
      props.func2(value);
      props.func();
    }
  };

  return (
    <>
      <div className="modal-outer">
        <div className="modal-inner">
          <header>
            <button onClick={cancelAlert}>X</button>
          </header>
          <header>
            <p>{props.msg}</p>
          </header>
          {showOptions && (
            <header>
              <button
                onClick={() => {
                  continueFunc(true);
                }}
              >
                Continue
              </button>
            </header>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
