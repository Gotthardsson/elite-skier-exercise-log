import "./sessionModal.css";
import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { workoutSessionApi } from "../../../api/workoutSessionApi";
import Swal from "sweetalert2";
import type { SessionType } from "../../../types/SessionType";

export default function SessionModal(props) {
  const createInitialSession = (date, timeOfDay) => ({
    id: undefined,
    userId: 1,
    activityId: 0,
    scheduledDate: date || new Date(),
    timeOfDay: timeOfDay || "Morgon",
    isLogged: true,
    comment: "",
    loggedComment: "",
    feeling: 5,
    mentalRpe: 5,
    avgHeartRate: 0,
    plannedZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
    actualZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
  });

  const [isLogSelected, setLogSelected] = useState(props.isLogSelected);
  const [session, setSession] = useState<SessionType>(() =>
    createInitialSession(props.date, props.timeOfDay)
  );

  useEffect(() => {
    if (!props.trigger) return;
    console.log("Effekt körs med session:", props.session);

    //Klickat logga planerat pass
    if (
      props.plannedSessionClicked &&
      props.session &&
      !props.session.stravaRaw
    ) {
      setSession({
        ...props.session,
        id: undefined, // Viktigt för att skapa ett NYTT loggat pass
        isLogged: true,
        scheduledDate: new Date(props.session.scheduledDate),
        actualZones: {
          a1: props.session.plannedZones?.a1 ?? 0,
          a2: props.session.plannedZones?.a2 ?? 0,
          a3Minus: props.session.plannedZones?.a3Minus ?? 0,
          a3: props.session.plannedZones?.a3 ?? 0,
          a3Plus: props.session.plannedZones?.a3Plus ?? 0,
          comp: props.session.plannedZones?.comp ?? 0,
        },
        plannedZones: { ...(props.session.plannedZones || {}) },
        loggedComment: props.session.comment,
        comment: props.session.comment,
        mentalRpe: 5,
        feeling: 5,
      });

      setLogSelected(true);
    } else if (props.session.stravaRaw) {
      setSession({
        ...props.session,
        id: props.session.id, // Viktigt för att skapa ett NYTT loggat pass
        isLogged: true,
        scheduledDate: new Date(props.session.scheduledDate),
        actualZones: {
          a1: props.session.actualZones?.a1 ?? 0,
          a2: props.session.actualZones?.a2 ?? 0,
          a3Minus: props.session.actualZones?.a3Minus ?? 0,
          a3: props.session.actualZones?.a3 ?? 0,
          a3Plus: props.session.actualZones?.a3Plus ?? 0,
          comp: props.session.actualZones?.comp ?? 0,
        },
        plannedZones: { ...(props.session.plannedZones || {}) },
        loggedComment: props.session.comment,
        comment: props.session.comment,
        mentalRpe: 5,
        feeling: 5,
      });

      setLogSelected(true);

      //Klicka Redigera
    } else if (props.editClicked && props.session) {
      setSession({
        ...props.session,
        id: props.session?.id,
        isLogged: props.isLogged,
        scheduledDate: new Date(props.session.scheduledDate),
        actualZones: {
          ...(props.session.actualZones || {
            a1: 0,
            a2: 0,
            a3Minus: 0,
            a3: 0,
            a3Plus: 0,
            comp: 0,
          }),
        },
        plannedZones: {
          ...(props.session.plannedZones || {
            a1: 0,
            a2: 0,
            a3Minus: 0,
            a3: 0,
            a3Plus: 0,
            comp: 0,
          }),
        },
        loggedComment: props.session.loggedComment,
        comment: props.session.comment,
        mentalRpe: props.session.mentalRpe,
        feeling: props.session.feeling,
        avgHeartRate: props.session.avgHeartRate,
      });
      setLogSelected(props.session.isLogged);
      console.log(props.session.feeling);
    } else {
      //Helt nytt tomt pass
      const newSession = createInitialSession(props.date, props.timeOfDay);
      setSession(newSession);
      setLogSelected(props.isLogSelected);
    }
  }, [
    props.trigger,
    props.plannedSessionClicked,
    props.session,
    props.date,
    props.timeOfDay,
    props.isLogSelected,
    props.editClicked,
    props.isLogged,
  ]);

  const handleZoneChange = (zoneKey, value) => {
    const numValue = Number(value) || 0;
    const targetZoneGroup = isLogSelected ? "actualZones" : "plannedZones";

    setSession((prev) => ({
      ...prev,
      [targetZoneGroup]: { ...prev[targetZoneGroup], [zoneKey]: numValue },
    }));
  };

  const handleEdit = async (currentSession: SessionType) => {
    if (!currentSession.id) return;

    try {
      const sessionToUpdate = {
        ...currentSession,
        isLogged: isLogSelected,
        scheduledDate: new Date(currentSession.scheduledDate).toISOString(),

        // FIXA KOMMENTARERNA HÄR:
        // Se till att 'description' (från state) mappar till vad din API-klient förväntar sig
        comment: currentSession.comment,
        loggedComment: currentSession.loggedComment,
      };

      await workoutSessionApi.update(currentSession.id, sessionToUpdate);

      props.onSessionSaved();
      props.setTrigger(false);
      Swal.fire({
        title: "Sparat!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Fel vid PUT-anrop:", error);
    }
  };

  const handleSave = async () => {
    try {
      // 1. Fixa datumet - oavsett om det är Date eller String från kalendern
      const dateObj = new Date(session.scheduledDate);

      // 2. Skapa det objekt som ska skickas
      const finalSession = {
        ...session,
        // Vi tvingar in isLogged från modalens flik-val (true/false)
        isLogged: isLogSelected,
        // Vi skickar datumet som en ISO-sträng för backend
        scheduledDate: dateObj.toISOString(),
      };

      // 3. Skicka till API
      await workoutSessionApi.create(finalSession);

      // 4. Städa upp och hälsa användaren
      props.onSessionSaved();
      props.setTrigger(false);

      Swal.fire({
        title: "Sparat!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Fel vid Post-anrop:", error);
      Swal.fire("Fel", "Kunde inte spara passet.", "error");
    }
  };

  if (!props.trigger) return null;

  return (
    <div
      className="sm-overlay"
      onClick={() => {
        props.setTrigger(false);
      }}
    >
      <div
        className={`sm-content ${isLogSelected ? "log-mode" : "plan-mode"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
            {isLogSelected ? "Kommentar" : "Kommentar"}
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

        <div
          className={isLogSelected ? "sm-slider-row" : "sm-slider-row planmode"}
        >
          <div className="sm-slider-field">
            <div className="sm-slider-header">
              <label className="sm-label">Känsla i kroppen</label>
              <span className="sm-slider-value">{session.feeling}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="sm-range-input"
              value={session.feeling ?? 5}
              onChange={(e) =>
                setSession({ ...session, feeling: Number(e.target.value) })
              }
            />
          </div>

          <div className="sm-slider-field">
            <div className="sm-slider-header">
              <label className="sm-label">Mental Känsla</label>
              <span className="sm-slider-value">{session.mentalRpe}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="sm-range-input"
              value={session.mentalRpe ?? 5}
              onChange={(e) =>
                setSession({ ...session, mentalRpe: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div
          className={
            isLogSelected ? "heart-rate-input" : "heart-rate-input planmode"
          }
        >
          <label className="sm-label">Medelpuls</label>
          <input
            type="number"
            className="sm-pulse-input"
            placeholder="BPM"
            value={session.avgHeartRate ?? 0}
            onFocus={(e) => e.target.select()} // Markera allt när man klickar
            onChange={(e) =>
              setSession({ ...session, avgHeartRate: Number(e.target.value) })
            }
          />
        </div>
        <div className="sm-footer">
          <button
            className="sm-save-btn"
            onClick={() => {
              console.log("Klickade spara. Session ID är:", session.id);
              if (!props.editClicked) {
                handleSave();
              } else if (props.editClicked) {
                console.log(session.isLogged);
                handleEdit(session);
              }
            }}
          >
            {!props.editClicked ? "Spara pass" : "Spara ändringar"}
          </button>
        </div>
      </div>
    </div>
  );
}
