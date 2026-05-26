import "./button.css";
export default function ButtonPrimary(props) {
  return (
    <button
      className={`button-primary ${props.className}`}
      style={props.style}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
