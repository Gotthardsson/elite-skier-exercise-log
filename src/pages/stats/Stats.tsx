import { useState } from "react";
import "./stats.css";
import SelectField from "./SelectField";
import TimePerSport from "./TimePerSport";
import TimePerZone from "./TimePerZone";

function Stats() {
  const totalLoggedMinutes = 36000;
  const totalPlannedMinutes = 40000;
  const hoursLogged = Math.floor(totalLoggedMinutes / 60);
  const minutesLogged = totalLoggedMinutes % 60;
  const timePerSportData = [
    { sport: "Längdskidor", minutes: 18000 }, // 50%
    { sport: "Rullskidor", minutes: 8000 }, // 22%
    { sport: "Löpning", minutes: 5000 }, // 14%
    { sport: "Styrka", minutes: 3000 }, // 8%
    { sport: "Cykel", minutes: 2000 }, // 6%
  ];

  const timePerZoneData = [
    { zone: "A1", minutes: 20000 }, // ~56%
    { zone: "A2", minutes: 12000 }, // ~33%

    { zone: "A3-", minutes: 1500 }, // ~4%
    { zone: "A3", minutes: 1200 }, // ~3%
    { zone: "A3+", minutes: 800 }, // ~2%
    { zone: "Tävling", minutes: 500 }, // ~1%
  ];

  const hoursPlanned = Math.floor(totalPlannedMinutes / 60);
  const minutesPlanned = totalPlannedMinutes % 60;
  const [timeSpan, setTimeSpan] = useState("Hel säsong");
  const [season, setSeason] = useState("25/26");
  const [period, setPeriod] = useState("Period 1");
  const [periodView, setPeriodView] = useState("Hela perioden");
  const [week, setWeek] = useState("Vecka 41");

  const sickDays = 14;
  const injuryDays = 40;
  const timeSpanOptions = ["Hel säsong", "Period", "Vecka"];
  const periodOptions = ["Period 1", "Period 2", "Period 3", "Period 4"];
  const weekOptions = ["Vecka 41", "Vecka 42", "Vecka 43", "Vecka 44"];
  const seasonOptions = ["26/27", "25/26", "24/25"];
  const periodViewOptions = [
    "Hela perioden",
    "Vecka 1",
    "Vecka 2",
    "Vecka 3",
    "Vecka 4",
  ];

  return (
    <main>
      <div className="stats-menu">
        <SelectField
          label="Vy"
          value={timeSpan}
          onChange={setTimeSpan}
          options={timeSpanOptions}
          className="dropdown-timeSpan dropdown-stats"
        />

        {timeSpan === "Hel säsong" && (
          <SelectField
            label="Säsong"
            value={season}
            onChange={setSeason}
            options={seasonOptions}
            className="dropdown-season dropdown-stats"
          />
        )}

        {timeSpan === "Period" && (
          <>
            <SelectField
              label="Period"
              value={period}
              onChange={setPeriod}
              options={periodOptions}
              className="dropdown-period dropdown-stats"
            />

            <SelectField
              label="Tidspann"
              value={periodView}
              onChange={setPeriodView}
              options={periodViewOptions}
              className="dropdown-period-view dropdown-stats"
            />
          </>
        )}

        {timeSpan === "Vecka" && (
          <SelectField
            label="Vecka"
            value={week}
            onChange={setWeek}
            options={weekOptions}
            className="dropdown-week dropdown-stats"
          />
        )}
      </div>

      <div className="stats-div">
        <div className="stats-item total-time-logged dropdown-stas">
          <label>Loggad tid</label>
          <br />
          {hoursLogged}h {minutesLogged}min
        </div>

        <div className="stats-item total-time-planned dropdown-stas">
          <label>Planerad tid</label>
          <br />
          {hoursPlanned}h {minutesPlanned}min
        </div>

        <div className="stats-item sickdays-injurydays dropdown-stas">
          <label>Sjuk/Skadad</label>
          <br />
          {sickDays}/{injuryDays}
        </div>
      </div>

      <div className="logged-time-per-zon distribution-diagrams">
        <TimePerZone totalMinutes={totalLoggedMinutes} data={timePerZoneData} />
      </div>
      <div className="time-per-sport distribution-diagrams">
        {" "}
        <TimePerSport
          totalMinutes={totalLoggedMinutes}
          data={timePerSportData}
        />
      </div>
    </main>
  );
}

export default Stats;
