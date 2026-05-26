import { useEffect, useState } from "react";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { dayStatusApi } from "../../../api/dayStatusApi";
import type { dayType } from "../../../types/dayType";
import "./Daystatus.css";
import Swal from "sweetalert2";

interface DayStatusModalProps {
  trigger: boolean;
  setTrigger: (val: boolean) => void;
  date: Date | string;
  onStatusSaved?: () => void;
}

export default function DayStatusModal(props: DayStatusModalProps) {
  // 1. Sätt upp ett grund-state baserat på dayType-interfacet
  const [status, setStatus] = useState<dayType>({
    id: 0,
    sick: false,
    injured: false,
    day: "",
    restingHeartRate: 0,
    hrv: 0,
    restDay: false,
    travelDay: false,
  });

  // 2. Läs in data från backend så fort modalen öppnas på ett specifikt datum
  useEffect(() => {
    if (!props.trigger || !props.date) return;

    const loadDayStatus = async () => {
      try {
        const response = await dayStatusApi.getByDate(props.date);

        if (response.status === 200 && response.data) {
          // Det fanns redan sparad data -> Läs in!
          setStatus(response.data);
        } else {
          // FIXAT: Skapa en ren, LOKAL datumsträng (YYYY-MM-DD) utan tidszonsförskjutning
          const targetDate =
            props.date instanceof Date ? props.date : new Date(props.date);
          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, "0");
          const dayNum = String(targetDate.getDate()).padStart(2, "0");
          const localDateStr = `${year}-${month}-${dayNum}`; // Garanterar exakt rätt dag!

          setStatus({
            id: 0,
            sick: false,
            injured: false,
            day: localDateStr,
            restingHeartRate: 0,
            hrv: 0,
            restDay: false,
            travelDay: false,
          });
        }
      } catch (error) {
        console.error("Fel vid hämtning av dagsstatus:", error);
      }
    };

    loadDayStatus();
  }, [props.trigger, props.date]);

  // 3. Funktion för att skicka tillbaka datan till backend via din apiClient
  const handleSave = async () => {
    try {
      await dayStatusApi.saveStatus(status);

      Swal.fire({
        title: "Sparat!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      props.setTrigger(false); // Stäng fönstret

      if (props.onStatusSaved) {
        props.onStatusSaved(); // Ladda om kalendervyn direkt
      }
    } catch (error) {
      console.error("Kunde inte spara dagsstatus:", error);
      Swal.fire({
        title: "Fel!",
        text: "Kunde inte spara dagsstatus.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (!props.trigger) return null;

  return (
    <div className="sm-overlay" onClick={() => props.setTrigger(false)}>
      <div
        className="sm-content ds-modal-width"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm-header">
          <button
            className="sm-close-btn"
            onClick={() => props.setTrigger(false)}
          >
            Stäng
          </button>
        </div>

        <div className="ds-content">
          {/* Rubrikgrupp med dynamiskt svenskt datum */}
          <div className="ds-header-title-group">
            <h3 className="ds-title">Dagsstatus & Biometri</h3>
            {props.date && (
              <span className="ds-date-subtitle">
                {new Date(props.date).toLocaleDateString("sv-SE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            )}
          </div>

          {/* Sektion 1: Medicinsk status (Sjuk / Skadad) */}
          <div className="ds-status-grid">
            <label
              className={`ds-status-card sick ${status.sick ? "active" : ""}`}
            >
              <input
                type="checkbox"
                id="sick"
                className="ds-hidden-checkbox"
                checked={status.sick}
                onChange={(e) =>
                  setStatus({ ...status, sick: e.target.checked })
                }
              />
              <span className="ds-card-icon">🤒</span>
              <div className="ds-card-text">
                <strong>Sjuk</strong>
                <span>Förkylning, feber etc.</span>
              </div>
            </label>

            <label
              className={`ds-status-card injured ${
                status.injured ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                id="injured"
                className="ds-hidden-checkbox"
                checked={status.injured}
                onChange={(e) =>
                  setStatus({ ...status, injured: e.target.checked })
                }
              />
              <span className="ds-card-icon">🤕</span>
              <div className="ds-card-text">
                <strong>Skadad</strong>
                <span>Överbelastning, känning</span>
              </div>
            </label>
          </div>

          {/* Sektion 2: Planering & Logistik (Vilodag / Resdag) */}
          <div className="ds-status-grid">
            <label
              className={`ds-status-card rest ${
                status.restDay ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                id="restDay"
                className="ds-hidden-checkbox"
                checked={status.restDay}
                onChange={(e) =>
                  setStatus({ ...status, restDay: e.target.checked })
                } // ÄNDRAT
              />
              <span className="ds-card-icon">💤</span>
              <div className="ds-card-text">
                <strong>Vilodag</strong>
                <span>Planerad återhämtning</span>
              </div>
            </label>

            <label
              className={`ds-status-card travel ${
                status.travelDay ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                id="travelDay"
                className="ds-hidden-checkbox"
                checked={status.travelDay}
                onChange={(e) =>
                  setStatus({ ...status, travelDay: e.target.checked })
                } // ÄNDRAT
              />
              <span className="ds-card-icon">✈️</span>
              <div className="ds-card-text">
                <strong>Resdag</strong>
                <span>Läger eller tävling</span>
              </div>
            </label>
          </div>

          {/* Sektion 3: Hjärtvärden / Biometri */}
          <div className="ds-metrics-row">
            <div className="ds-field-group">
              <label htmlFor="hrv" className="ds-input-label">
                HRV <span className="ds-unit">(ms)</span>
              </label>
              <div className="ds-input-wrapper">
                <input
                  type="number"
                  id="hrv"
                  value={status.hrv || ""}
                  onChange={(e) =>
                    setStatus({ ...status, hrv: Number(e.target.value) })
                  }
                  placeholder="t.ex. 75"
                  className="ds-number-input"
                />
              </div>
            </div>

            <div className="ds-field-group">
              <label htmlFor="rest-hrt-rate" className="ds-input-label">
                Vilopuls <span className="ds-unit">(bpm)</span>
              </label>
              <div className="ds-input-wrapper">
                <input
                  type="number"
                  id="rest-hrt-rate"
                  value={status.restingHeartRate || ""}
                  onChange={(e) =>
                    setStatus({
                      ...status,
                      restingHeartRate: Number(e.target.value),
                    })
                  }
                  placeholder="t.ex. 42"
                  className="ds-number-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="ds-save-btn">
          <ButtonPrimary text="Spara dagsstatus" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}
