import "./sessionModal.css";
import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { workoutSessionApi } from "../../../api/workoutSessionApi";
import Swal from "sweetalert2";
import type { SessionType } from "../../../types/SessionType";

export default function SessionModal(props) {
  const createInitialSession = (date, timeOfDay, userId) => ({
    id: undefined,
    userId: userId || 1,
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
    createInitialSession(props.date, props.timeOfDay, props.userId)
  );
  const [error, setError] = useState<string | null>(null);

  // Hjälpfunktion för att spara datum utan att tappa tidszonen (förhindrar flytt bakåt en dag)
  const toLocalISOString = (date: Date | string) => {
    const d = new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000; // i millisekunder
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString();
    return localISOTime;
  };

  useEffect(() => {
    setError(null);
  }, [props.trigger]);

  useEffect(() => {
    if (!props.trigger) return;
    console.log("Effekt körs med session:", props.session);

    // FIX 2: Lägg Klicka Redigera HÖGST UPP så inte "Logga planerat pass" stjäl klicket!
    if (props.editClicked && props.session) {
      setSession({
        ...props.session,
        id: props.session?.id,
        isLogged: props.session.isLogged, // FIX: använd direkt från objektet
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
        loggedComment: props.session.loggedComment || "",
        comment: props.session.comment || "", // FIX: Se till att comment hänger med
        mentalRpe: props.session.mentalRpe,
        feeling: props.session.feeling,
        avgHeartRate: props.session.avgHeartRate,
      });
      setLogSelected(props.session.isLogged);

      // Klickat logga planerat pass (ej Strava)
    } else if (
      props.plannedSessionClicked &&
      props.session &&
      !props.session.stravaRaw
    ) {
      setSession({
        ...props.session,
        id: props.session.id,
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
        loggedComment: props.session.comment || "",
        comment: props.session.comment || "",
        mentalRpe: 5,
        feeling: 5,
      });

      setLogSelected(true);

      // Strava-pass
    } else if (props.session && props.session.stravaRaw) {
      setSession({
        ...props.session,
        id: props.session.id,
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
        loggedComment:
          props.session.comment || props.session.loggedComment || "",
        comment: props.session.comment || "",
        mentalRpe: props.session.mentalRpe || 5,
        feeling: props.session.feeling || 5,
      });

      setLogSelected(true);
    } else {
      // Helt nytt tomt pass
      const newSession = createInitialSession(
        props.date,
        props.timeOfDay,
        props.userId
      );
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
    props.userId,
  ]);

  const handleZoneChange = (zoneKey, value) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);

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
        scheduledDate: toLocalISOString(currentSession.scheduledDate), // FIXAT: Tidszonssäkrad
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
    // 1. NYTT: Kontrollera om sporten är giltig (inte 0 eller tom)
    if (!session.activityId || session.activityId === 0) {
      setError("Du måste välja en sport innan du kan spara passet.");
      return; // Avbryt funktionen här, resten av koden (och API-anropet) körs aldrig!
    }

    try {
      setError(null); // Rensar eventuella gamla felmeddelanden om det lyckas nu

      const finalSession = {
        ...session,
        isLogged: isLogSelected,
        scheduledDate: toLocalISOString(session.scheduledDate), // FIXAT: Tidszonssäkrad
      };

      await workoutSessionApi.create(finalSession);

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
    <div className="sm-overlay" onClick={() => props.setTrigger(false)}>
      <div
        className={`sm-content ${isLogSelected ? "log-mode" : "plan-mode"}`}
        onClick={(e) => e.stopPropagation()}
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
          {error && <span className="sm-error-text">{error}</span>}
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
                  // FIXAT: Om värdet är 0, visa en tom sträng i rutan istället
                  value={
                    isLogSelected
                      ? session.actualZones[zone] === 0 ||
                        session.actualZones[zone] < 0
                        ? ""
                        : session.actualZones[zone]
                      : session.plannedZones[zone] === 0 ||
                        session.plannedZones[zone] < 0
                      ? ""
                      : session.plannedZones[zone]
                  }
                  onChange={(e) => handleZoneChange(zone, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="0" // Lägg till en placeholder så det fortfarande står en ljusgrå 0:a när den är tom!
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sm-field">
          <label className="sm-label">Kommentar</label>
          <textarea
            className="sm-textarea"
            value={isLogSelected ? session.loggedComment : session.comment}
            onChange={(e) =>
              setSession({
                ...session,
                [isLogSelected ? "loggedComment" : "comment"]: e.target.value,
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
            placeholder="0"
            value={
              session.avgHeartRate === 0 || session.avgHeartRate < 0
                ? ""
                : session.avgHeartRate
            }
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              setSession({ ...session, avgHeartRate: Number(e.target.value) })
            }
          />
        </div>

        <div className="sm-footer">
          <button
            className="sm-save-btn"
            onClick={() => {
              if (session.id) {
                handleEdit(session);
              } else {
                handleSave();
              }
            }}
          >
            {!session.id
              ? "Spara pass"
              : props.plannedSessionClicked ||
                (session.stravaRaw && !props.session?.isLogged)
              ? "Logga pass"
              : "Spara ändringar"}
          </button>
        </div>
      </div>
    </div>
  );
}
