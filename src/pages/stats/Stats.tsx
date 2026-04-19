
import { useState } from "react";
import "./stats.css";

function Stats() {
  const totalLoggedMinutes = 36000;
  const hoursLogged = Math.floor(totalLoggedMinutes / 60);
  const minutesLogged = totalLoggedMinutes % 60;

  const totalPlannedMinutes = 40000;
  const hoursPlanned = Math.floor(totalPlannedMinutes / 60);
  const minutesPlanned = totalPlannedMinutes % 60;
  const [timeSpan, setTimeSpan] = useState("Hel Säsong");
  const [season, SetSeason] = useState("25/26");

  const sickDays = 14;
  const injurydays = 40;

  return (
    <main>
      <div className="stats-menu">
        <Dropdown className="drop-down-button dropdown-timeSpan">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {timeSpan}
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-season">
            <Dropdown.Item
              onClick={() => setTimeSpan("Hel säsong")}
              href="#/action-1"
            >
              Hel säsong
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setTimeSpan("Period")}
              href="#/action-2"
            >
              Period
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setTimeSpan("Vecka")}
              href="#/action-3"
            >
              Vecka
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="drop-down-button dropdown-season">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {season}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                SetSeason("26/27");
              }}
              href="#/action-1"
            >
              26/27
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                SetSeason("25/26");
              }}
              href="#/action-2"
            >
              25/26
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                SetSeason("24/25");
              }}
              href="#/action-3"
            >
              24/25
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="stats-div">
        <div className="stats-item total-time-logged">
          <label>Loggad tid</label> <br />
          {hoursLogged}h {minutesLogged}min
        </div>
        <div className="stats-item total-time-planned">
          <label>Planerad tid</label>
          <br />
          {hoursPlanned}h {minutesPlanned}min
        </div>

        <div className="stats-item sickdays-injurydays">
          <label>Sjuk/Skadad</label>
          <br />
          {sickDays}/{injurydays}
        </div>
      </div>

      <div className="logged-time-per-zon">TID PER ZON</div>

      <div className="time-per-sport">TID PER SPORT</div>
    </main>
  );
}

export default Stats;
