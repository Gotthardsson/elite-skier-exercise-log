import "./sessionModal.css";
import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { workoutSessionApi } from "../../../api/workoutSessionApi";

export default function SessionModal(props) {
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

  const [isLogSelected, setLogSelected] = useState(props.isLogSelected);
  const [session, setSession] = useState(() =>
    createInitialSession(props.date, props.timeOfDay)
  );

  useEffect(() => {
    if (!props.trigger) return;

    if (props.plannedSessionClicked && props.session) {
      setSession({
        ...props.session,
        id: undefined, // Viktigt för att skapa ett NYTT loggat pass
        isLogged: true,
        scheduledDate: new Date(props.session.scheduledDate),
        actualZones: { ...props.session.plannedZones },
        loggedComment: "",
      });
      setLogSelected(true);
    } else {
      setSession(createInitialSession(props.date, props.timeOfDay));
      setLogSelected(props.isLogSelected);
    }
  }, [
    props.trigger,
    props.plannedSessionClicked,
    props.session,
    props.date,
    props.timeOfDay,
    props.isLogSelected,
  ]);

  const handleZoneChange = (zoneKey, value) => {
    const numValue = Number(value) || 0;
    const targetZoneGroup = isLogSelected ? "actualZones" : "plannedZones";

    setSession((prev) => ({
      ...prev,
      [targetZoneGroup]: { ...prev[targetZoneGroup], [zoneKey]: numValue },
    }));
  };

  const handleSave = async () => {
    try {
      const finalSession = {
        ...session,
        scheduledDate: session.scheduledDate.toISOString(),
        isLogged: isLogSelected,
      };
      await workoutSessionApi.create(finalSession);
      props.onSessionSaved();
      props.setTrigger(false);
    } catch (error) {
      console.error("Fel vid sparning:", error);
    }
  };

  if (!props.trigger) return null;

  return (
    <div className="sm-overlay">
      <div className={`sm-content ${isLogSelected ? "log-mode" : "plan-mode"}`}>
        <div className="sm-header">
          <button
            className="sm-close-btn"
            onClick={() => props.setTrigger(false)}
          >
            Stäng
          </button>
          <div className="sm-type-toggle">
            <button
              className={`sm-toggle-btn left ${
                isLogSelected ? "active log" : ""
              }`}
              onClick={() => setLogSelected(true)}
            >
              Logga
            </button>
            <button
              className={`sm-toggle-btn right ${
                !isLogSelected ? "active plan" : ""
              }`}
              onClick={() => setLogSelected(false)}
            >
              Planera
            </button>
          </div>
        </div>

        <div className="sm-row">
          <div className="sm-field">
            <label className="sm-label">Datum</label>
            <Calendar
              className="sm-calendar-input"
              value={session.scheduledDate}
              onChange={(e) =>
                e.value && setSession({ ...session, scheduledDate: e.value })
              }
              showIcon
              dateFormat="yy-mm-dd"
              appendTo="self"
            />
          </div>
          <div className="sm-field">
            <label className="sm-label">Tid på dagen</label>
            <select
              className="sm-select"
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

        <div className="sm-field" style={{ marginBottom: "15px" }}>
          <label className="sm-label">Aktivitet</label>
          <select
            className="sm-select"
            value={session.activityId}
            onChange={(e) =>
              setSession({ ...session, activityId: Number(e.target.value) })
            }
          >
            <option value={0}>Välj aktivitet</option>
            {props.activities?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm-zones-box">
          <label className="sm-label">Tid i zoner (minuter)</label>
          <div className="sm-zone-grid">
            {Object.keys(session.plannedZones).map((zone) => (
              <div key={zone} className="sm-zone-item">
                <label className={`sm-z-${zone.toLowerCase()}`}>
                  {zone
                    .replace("Minus", "-")
                    .replace("Plus", "+")
                    .toUpperCase()}
                </label>
                <input
                  type="number"
                  className="sm-zone-input"
                  value={
                    isLogSelected
                      ? session.actualZones[zone]
                      : session.plannedZones[zone]
                  }
                  onChange={(e) => handleZoneChange(zone, e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sm-field">
          <label className="sm-label">
            {isLogSelected ? "Kommentar om passet" : "Beskrivning av plan"}
          </label>
          <textarea
            className="sm-textarea"
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

        <div className="sm-footer">
          <button className="sm-save-btn" onClick={handleSave}>
            Spara pass
          </button>
        </div>
      </div>
    </div>
  );
}
