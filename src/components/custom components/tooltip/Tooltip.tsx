import "./Tooltip.css";

type TooltipPropsType = {
  text: string;
  position: string;
};

const Tooltip = (props: TooltipPropsType) => {
  return <div className={`tooltip-box ${props.position}`}>{props.text}</div>;
};

export default Tooltip;
