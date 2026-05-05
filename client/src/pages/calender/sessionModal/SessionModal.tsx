import "./sessionModal.css";
import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { workoutSessionApi } from "../../../api/workoutSessionApi";

export default function SessionModal(props) {
  // Använd isLogSelected som huvudkälla för läge (Logga vs Planera)
  const [isLogSelected, setLogSelected] = useState(props.isLogSelected);

  const createInitialSession = (date, timeOfDay) => ({
    userId: 1,
    activityId: 0,
    scheduledDate: date || new Date(),
    timeOfDay: timeOfDay || "Morgon",
    isLogged: true,
    description: "",
    loggedComment: "",
    feeling: 5,
    mentalRpe: 5,
    plannedZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
    actualZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
  });

  const [session, setSession] = useState(() =>
    createInitialSession(props.date, props.timeOfDay)
  );

  // Synka modalen när den öppnas
  useEffect(() => {
    if (!props.trigger) return;

    setSession(createInitialSession(props.date, props.timeOfDay));
    setLogSelected(props.isLogSelected);
  }, [props.trigger, props.date, props.timeOfDay, props.isLogSelected]);

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
      // Formatera datumet till ISO-sträng för API:et
      const finalSession = {
        ...session,
        scheduledDate: session.scheduledDate.toISOString(),
        isLogged: isLogSelected,
      };

      await workoutSessionApi.create(finalSession);
      props.onSessionSaved(); // Refreshar listan i bakgrunden
      alert("Passet sparades!");

      props.setTrigger(false); // Stäng modalen
    } catch (error) {
      console.error("Fel vid sparning:", error);
      alert("Kunde inte spara passet.");
    }
  };

  if (!props.trigger) return null;

  return (
    <div className="session-popup">
      <div
        className={`popup-inner ${isLogSelected ? "log-mode" : "plan-mode"}`}
      >
        <ButtonPrimary
          className="popup-close-btn"
          text="Stäng"
          onClick={() => props.setTrigger(false)}
        />

        <h2>{isLogSelected ? "Logga utfört pass" : "Planera nytt pass"}</h2>

        <div className="log-type-div">
          <button
            className={isLogSelected ? "log-selected" : "log-type-btn"}
            onClick={() => setLogSelected(true)}
          >
            Logga
          </button>
          <button
            className={!isLogSelected ? "plan-selected" : "plan-type-btn"}
            onClick={() => setLogSelected(false)}
          >
            Planera
          </button>
        </div>

        <div className="date-and-time-div">
          <div className="date-selector-wrapper">
            <label className="label-popup">Datum</label>
            <Calendar
              className="date-selector"
              value={session.scheduledDate}
              onChange={(e) => {
                if (e.value) {
                  setSession({ ...session, scheduledDate: e.value });
                }
              }}
              showIcon
              dateFormat="yy-mm-dd"
            />
          </div>

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
          <label className="zone-header">Tid i zoner (minuter)</label>
          <div className="zone-grid">
            {Object.keys(session.plannedZones).map((zone) => (
              <div key={zone} className="zone-input-div">
                <label>
                  {zone
                    .replace("Minus", "-")
                    .replace("Plus", "+")
                    .toUpperCase()}
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
                  onFocus={(e) => e.target.select()} // Underlättar inmatning
                />
              </div>
            ))}
          </div>
        </div>

        <div className="comment-div">
          <label className="label-popup">
            {isLogSelected ? "Kommentar om passet" : "Beskrivning av plan"}
          </label>
          <textarea
            className="comment-input"
            value={isLogSelected ? session.loggedComment : session.description}
            onChange={(e) =>
              setSession({
                ...session,
                [isLogSelected ? "loggedComment" : "description"]:
                  e.target.value,
              })
            }
            placeholder={isLogSelected ? "Hur kändes det?" : "Vad ska du köra?"}
          />
        </div>

        {isLogSelected && (
          <div className="ranges-div">
            <div className="range-item">
              <label className="label-popup">
                Mentalt fokus (1-10): <strong>{session.mentalRpe}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={session.mentalRpe}
                onChange={(e) =>
                  setSession({ ...session, mentalRpe: Number(e.target.value) })
                }
              />
            </div>

            <div className="range-item">
              <label className="label-popup">
                Fysisk känsla (1-10): <strong>{session.feeling}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={session.feeling}
                onChange={(e) =>
                  setSession({ ...session, feeling: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        <div className="popup-actions">
          <ButtonPrimary
            className="popup-save-btn"
            text={isLogSelected ? "Spara logg" : "Spara planering"}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
