import "./sessionModal.css";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import zones from "../../../localdata/zones";
import ButtonPrimary from "../../../components/ButtonPrimary";

export default function SessionModal(props) {
  //Framtiden ta in bool ifrån vilken vy man är i:
  const [isLogSelected, setLogSelected] = useState(true);
  const [isPlanSelected, setPlanSelected] = useState(false);
  const [feelingValue, setFeelingValue] = useState(5);
  //Skicka in rätt datum sen genom kalender prop
  const [date, setDate] = useState(new Date());

  return props.trigger ? (
    <div className="session-popup">
      <div
        className={
          isLogSelected ? "popup-inner log-mode" : "popup-inner plan-mode"
        }
      >
        <ButtonPrimary
          className="popup-close-btn"
          text="Stäng"
          onClick={() => props.setTrigger(false)}
        >
          Stäng
        </ButtonPrimary>
        {props.childreen}
        <h2>Lägg till pass</h2>
        <div className="log-type-div">
          <button
            className={isLogSelected ? "log-selected" : "log-type-btn"}
            onClick={() => {
              setLogSelected(true);
              setPlanSelected(false);
            }}
          >
            Logga
          </button>
          <button
            className={
              isPlanSelected ? "plan-type-btn plan-selected" : "plan-type-btn"
            }
            onClick={() => {
              setPlanSelected(true);
              setLogSelected(false);
            }}
          >
            Planera
          </button>
        </div>

        <div className="date-and-time-div">
          <Calendar
            className="date-selector"
            id="date-selector"
            value={date}
            onChange={(e) => setDate(e.value)}
            showIcon
          />
          <div className="time-of-day-div">
            <label className="label-popup">Tid på dagen</label>
            <select className="time-of-day-select">
              <option>Morgon</option>
              <option>Förmiddag</option>
              <option>Eftermiddag</option>
              <option>Kväll</option>
            </select>
          </div>
        </div>

        <div className="activity-div">
          <label className="label-popup">Aktivitet</label>
          {/* Hämta idrotterna och mappa sen*/}
          <select className="activity-select">
            <option value="">Välj aktivitet</option>
            {props.activities?.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>
        <div className="zones-times-div">
          {zones.map((zone) => (
            <div key={zone} className="zone-input-div">
              <label>{zone}</label>
              <input className={`zone-input ${zone}`}></input>
            </div>
          ))}
        </div>
        <div className="comment-div">
          <label className="label-popup">Kommentar</label>
          <textarea className="comment-input" id="com"></textarea>
        </div>

        <div className="ranges-div" id="feeling-range">
          <label className="label-popup">
            Hur kändes det? (1-10): {feelingValue}
          </label>
          <input
            type="range"
            id="feeling"
            name="feeling"
            min="1"
            max="10"
            step="1"
            value={feelingValue}
            onChange={(e) => {
              setFeelingValue(Number(e.target.value));
            }}
          ></input>
        </div>

        <ButtonPrimary className="popup-save-btn" text="Spara"></ButtonPrimary>
      </div>
    </div>
  ) : (
    ""
  );
}
