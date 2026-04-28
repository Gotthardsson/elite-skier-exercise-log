import "./button.css";
export default function ButtonPrimary(props) {
  return (
    <button
      className={`button-primary ${props.className}`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
