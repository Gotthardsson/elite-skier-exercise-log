import { useState } from "react";
import "./switchViewComponent.css";

type Props = {
  onChange: (isLogSelected: boolean) => void;
};

export default function SwitchViewComponent({ onChange }: Props) {
  const [isLogSelected, setLogSelected] = useState(true);
  const [isPlanSelected, setPlanSelected] = useState(false);

  return (
    <div className="nav-log-type-div">
      <button
        className={isLogSelected ? "nav-log-selected" : "nav-log-type-btn"}
        onClick={() => {
          setLogSelected(true);
          setPlanSelected(false);
          onChange(true);
        }}
      >
        Logga
      </button>
      <button
        className={
          isPlanSelected
            ? "nav-plan-type-btn nav-plan-selected"
            : "nav-plan-type-btn"
        }
        onClick={() => {
          setPlanSelected(true);
          setLogSelected(false);
          onChange(false);
        }}
      >
        Planera
      </button>
    </div>
  );
}
