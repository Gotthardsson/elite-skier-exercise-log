import { useState } from "react";
import "./integrations.css";
import stravaLogo from "../../assets/strava.svg";
import ButtonPrimary from "../../components/ButtonPrimary";
import "../../components/button.css";
import { handleStravaConnect } from "./StravaCallback";

export default function Integrations() {
  const [stravaConnected, setStravaConnected] = useState(false);

  return (
    <div className="integrations-page">
      <div className="ig-app-container">
        <img alt="strava-logo" src={stravaLogo} className="strava-logo-svg" />

        <div className="ig-txt-content">
          <h2>Strava</h2>
          <p>Importera aktiviteter automatiskt</p>
        </div>

        <div className="connect-btn">
          <ButtonPrimary
            onClick={
              stravaConnected
                ? () => console.log("Hantera bortkoppling")
                : handleStravaConnect
            }
            className={stravaConnected ? "connected" : ""}
            text={stravaConnected ? "Koppla bort" : "Koppla"}
          />
        </div>
      </div>
    </div>
  );
}
