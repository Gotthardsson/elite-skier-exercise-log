import { Fragment } from "react/jsx-runtime";
import "./account.css";
import { useState } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";

export default function Account() {
  const [zones, setZones] = useState([
    { name: "A1", min: "100", max: "150", color: "#19b37d" },
    { name: "A2", min: "150", max: "170", color: "#84cc16" },
    { name: "A3-", min: "170", max: "178", color: "#facc15" },
    { name: "A3", min: "178", max: "190", color: "#fb923c" },
    { name: "A3+", min: "190", max: "210", color: "#f87171" },
    { name: "Comp", min: "", max: "", color: "#b91c1c" },
  ]);
  function updateZone(index: number, field: "min" | "max", value: string) {
    if (value === "" || /^\d+$/.test(value)) {
      setZones((prev) =>
        prev.map((zone, i) =>
          i === index ? { ...zone, [field]: value } : zone
        )
      );
    }
  }
  return (
    <>
      <main className="main-area">
        <h1>Konto</h1>
        <div className="profile-div">
          <div className="profile-img-container">"image"</div>
          <select className="role-selector">
            <option>Coach</option>
            <option>Atlet</option>
          </select>

          <button className="save-role-btn">Spara ändringar</button>
        </div>

        <div className="heart-rate-zones-parent">
          <h2>Hjärtfrekvenszoner</h2>
          <p className="p-zone">
            Ange dina personliga zoner för automatisk beräkning av tid i zoner
            från Strava-pass.
          </p>

          <div className="zone-grid">
            {/* header */}
            <div className="zone-header">Zone</div>
            <div className="zone-header">Min (bpm)</div>
            <div className="zone-header">Max (bpm)</div>

            {zones.map((zone, index) => (
              <Fragment key={zone.name}>
                <div className="zone-label" style={{ background: zone.color }}>
                  {zone.name}
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  value={zone.min}
                  onChange={(e) => updateZone(index, "min", e.target.value)}
                  className="zone-input"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  value={zone.max}
                  onChange={(e) => updateZone(index, "max", e.target.value)}
                  className="zone-input"
                />
              </Fragment>
            ))}
          </div>
          <ButtonPrimary
            className={"save-zones-btn"}
            text={"Spara"}
          ></ButtonPrimary>
        </div>
      </main>
    </>
  );
}
