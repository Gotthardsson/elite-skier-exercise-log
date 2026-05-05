import "./sessionModal.css";
import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { workoutSessionApi } from "../../../api/workoutSessionApi";

export default function SessionModal(props) {
  const [isLogSelected, setLogSelected] = useState(props.isLogSelected);
  const [isPlanSelected, setPlanSelected] = useState(false);

  const createInitialSession = (date, timeOfDay) => ({
    userId: 1,
    activityId: 0,
    scheduledDate: date,
    timeOfDay,
    isLogged: true,
    description: "",
    loggedComment: "",
    feeling: 5,
    mentalRpe: 5,
    plannedZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
    actualZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
  });

  const [session, setSession] = useState(() =>
    createInitialSession(props.date, props.timeOfDay),
  );

  useEffect(() => {
    if (!props.trigger) return;

    setSession(createInitialSession(props.date, props.timeOfDay));
    setLogSelected(true);
    setPlanSelected(false);
    setLogSelected(props.isLogSelected);
    setPlanSelected(!props.isLogSelected);
  }, [props.trigger, props.date, props.timeOfDay]);

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
      const finalSession = {
        ...session,
        scheduledDate: session.scheduledDate.toISOString(),
        isLogged: isLogSelected,
      };

      await workoutSessionApi.create(finalSession);
      props.onSessionSaved();
      alert("Passet sparades!");

      setSession(createInitialSession(props.date, props.timeOfDay));
      setLogSelected(true);
      setPlanSelected(false);
      props.setTrigger(false);
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
        <div className="header-container">
          
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
          <h2>Lägg till pass</h2>
          <ButtonPrimary
            className="popup-close-btn"
            text="Stäng"
            onClick={() => props.setTrigger(false)}
          >
            Stäng
          </ButtonPrimary>
        </div>
        <div className="date-and-time-div">
          <Calendar
            className="date-selector"
            value={session.date}
            onChange={(e) => {
              if (!e.value) return;

                setSession({
                  ...session,
                  date: e.value,
                });
              }}
              showIcon
            />
          </div>

          <div className="time-of-day-div">
            <label className="label-popup">Tid på dagen</label>
            <select
              className="time-of-day-select"
              value={session.timeOfDay}
              onChange={(e) =>
                setSession({
                  ...session,
                  timeOfDay: e.target.value,
                })
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
              setSession({
                ...session,
                activityId: Number(e.target.value),
              })
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
          <div className="feeling-div">
          <label className="label-popup">
            Hur kändes det mentalt? (1-10): {session.mentalRpe}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={session.mentalRpe}
            onChange={(e) =>
              setSession({
                ...session,
                mentalRpe: Number(e.target.value),
              })
            }
          />
          </div>
          <div className="feeling-div">
          <label className="label-popup">
            Hur kändes det fysiskt? (1-10): {session.feeling}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={session.feeling}
            onChange={(e) =>
              setSession({
                ...session,
                feeling: Number(e.target.value),
              })
            }
          /></div>
        </div>

        <ButtonPrimary
          className="popup-save-btn"
          text="Spara"
          onClick={handleSave}
        />
      </div>
    </div>
  ) : null;
}
