import "./sessionModal.css";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { workoutSessionApi } from "../../../api/workoutSessionApi";

export default function SessionModal(props) {
  //Framtiden ta in bool ifrån vilken vy man är i:
  const [isLogSelected, setLogSelected] = useState(true);
  const [isPlanSelected, setPlanSelected] = useState(false);

  const [session, setSession] = useState({
    userId: 1, // Hårdkoda för nu
    activityId: 0,
    date: new Date().toISOString(),
    timeOfDay: "Förmiddag",
    isLogged: true,
    description: "", // Motsvarar "Comment" i planering
    loggedComment: "", // Motsvarar "LoggedComment"
    feeling: 5, // physicalRpe
    mentalRpe: 5,
    plannedZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
    actualZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
  });

  const handleZoneChange = (zoneKey, value) => {
    const numValue = Number(value) || 0;
    const targetZoneGroup = isLogSelected ? "actualZones" : "plannedZones";

    setSession((prev) => ({
      ...prev,
      [targetZoneGroup]: {
        ...prev[targetZoneGroup],
        [zoneKey]: numValue,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Se till att isLogged i objektet matchar din valda flik
      const finalSession = { ...session, isLogged: isLogSelected };

      await workoutSessionApi.create(finalSession);

      alert("Passet sparades!");
      props.setTrigger(false); // Stäng modalen
    } catch (error) {
      console.error("Fel vid sparning:", error);
      alert("Kunde inte spara passet.");
    }
  };

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
            value={new Date(session.date)} // Konvertera strängen i statet till ett Date-objekt
            onChange={(e) =>
              setSession({ ...session, date: e.value.toISOString() })
            }
            showIcon
          />
          <div className="time-of-day-div">
            <label className="label-popup">Tid på dagen</label>
            <select
              className="time-of-day-select"
              value={session.timeOfDay}
              onChange={(e) =>
                setSession({ ...session, timeOfDay: e.target.value })
              }
            >
              <option value="Morgon">Morgon</option>
              <option value="Förmiddag">Förmiddag</option>
              <option value="Eftermiddag">Eftermiddag</option>
              <option value="Kväll">Kväll</option>
            </select>
          </div>
        </div>

        <div className="activity-div">
          <label className="label-popup">Aktivitet</label>
          {/* Hämta idrotterna och mappa sen*/}
          <select
            className="activity-select"
            value={session.activityId}
            onChange={(e) =>
              setSession({ ...session, activityId: Number(e.target.value) })
            }
          >
            <option value={0}>Välj aktivitet</option>
            {props.activities?.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>
        <div className="zones-times-div">
          {Object.keys(session.plannedZones).map((zone) => (
            <div key={zone} className="zone-input-div">
              <label>
                {zone.replace("Minus", "-").replace("Plus", "+").toUpperCase()}
              </label>
              <input
                type="number"
                className={`zone-input ${zone}`}
                value={
                  isLogSelected
                    ? session.actualZones[zone]
                    : session.plannedZones[zone]
                }
                onChange={(e) => handleZoneChange(zone, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="comment-div">
          <label className="label-popup">Kommentar</label>
          <textarea
            className="comment-input"
            value={isLogSelected ? session.loggedComment : session.description}
            onChange={(e) =>
              isLogSelected
                ? setSession({ ...session, loggedComment: e.target.value })
                : setSession({ ...session, description: e.target.value })
            }
          />
        </div>

        <div className="ranges-div" id="feeling-range">
          <label className="label-popup">
            Hur kändes det mentalt? (1-10): {session.mentalRpe}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={session.mentalRpe} // Använd session-statet
            onChange={(e) =>
              setSession({ ...session, mentalRpe: Number(e.target.value) })
            }
          />

          <label className="label-popup">
            Hur kändes det fysiskt? (1-10): {session.feeling}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={session.feeling} // Använd session-statet (physicalRpe)
            onChange={(e) =>
              setSession({ ...session, feeling: Number(e.target.value) })
            }
          />
        </div>

        <ButtonPrimary
          className="popup-save-btn"
          text="Spara"
          onClick={handleSave}
        ></ButtonPrimary>
      </div>
    </div>
  ) : (
    ""
  );
}
