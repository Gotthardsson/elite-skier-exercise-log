import "./button.css";
export default function ButtonPrimary({ text, className, onClick }) {
  return (
    <button className={`button-primary ${className}`} onClick={onClick}>
      {text}
    </button>
  );
}
