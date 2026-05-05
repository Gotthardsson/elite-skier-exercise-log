import { useEffect, useMemo, useState } from "react";
import "./stats.css";
import SelectField from "./SelectField";
import TimePerSport from "./TimePerSport";
import TimePerZone from "./TimePerZone";
import {
  getStatsForSeason,
  getStatsForPeriod,
  getStatsForWeekInPeriod,
  getAllTimeStats,
} from "./workoutStatsService.ts";
import { workoutSessionApi } from "../../api/workoutSessionApi.ts";
import type { SessionType } from "../../types/SessionType.ts";

// KVAR ATT FIXA:
// SJUKDAGAR OCH SKADEDAGAR (hårdkodade just nu),
// VISA "PERIOD DATA" FÖR SÄSONG I STAPLAR

function Stats(props: { activities: any[] }) {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [timeSpan, setTimeSpan] = useState("Säsong");
  const [season, setSeason] = useState("26/27");
  const [period, setPeriod] = useState("Alla perioder");
  const [periodView, setPeriodView] = useState("Hela perioden");

  // Alternativ för dropdowns
  const timeSpanOptions = ["Säsong", "Total statistik"];
  const seasonOptions = ["26/27", "25/26", "24/25"];
  const periodOptions = [
    "Alla perioder",
    ...Array.from({ length: 13 }, (_, i) => `Period ${i + 1}`),
  ];
  const periodViewOptions = [
    "Hela perioden",
    "Vecka 1",
    "Vecka 2",
    "Vecka 3",
    "Vecka 4",
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Antar userId 1 för tillfället enligt din kod
        const response = await workoutSessionApi.getByUserId(1);
        setSessions(response.data);
      } catch (error) {
        console.error("Kunde inte hämta pass:", error);
      }
    };
    fetchSessions();
  }, []);

  // Beräkna statistik baserat på valen i UI
  const activeStats = useMemo(() => {
    if (!sessions.length || !props.activities.length) return null;

    if (timeSpan === "Total statistik") {
      return getAllTimeStats(sessions, props.activities);
    }

    if (timeSpan === "Säsong") {
      // 1. Hela säsongen vald
      if (period === "Alla perioder") {
        return getStatsForSeason(sessions, props.activities, season);
      }

      // 2. Specifik period vald
      const periodNumber = parseInt(period.replace("Period ", ""));

      // 3. Specifik vecka inom perioden vald
      if (periodView !== "Hela perioden") {
        const weekInPeriodNumber = parseInt(periodView.replace("Vecka ", ""));
        return getStatsForWeekInPeriod(
          sessions,
          props.activities,
          periodNumber,
          weekInPeriodNumber,
          season
        );
      }

      // Returnera statistik för hela perioden om ingen specifik vecka är vald
      return getStatsForPeriod(
        sessions,
        props.activities,
        periodNumber,
        season
      );
    }

    return null;
  }, [timeSpan, period, periodView, season, sessions, props.activities]);

  // Just nu hårdkodat enligt din kommentar "KVAR ATT FIXA"
  const sickDays = 14;
  const injuryDays = 40;

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

        {timeSpan === "Säsong" && (
          <>
            <SelectField
              label="Säsong"
              value={season}
              onChange={setSeason}
              options={seasonOptions}
              className="dropdown-season dropdown-stats"
            />
            <SelectField
              label="Urval"
              value={period}
              onChange={(val) => {
                setPeriod(val);
                setPeriodView("Hela perioden"); // Återställ veckovyn vid periodbyte
              }}
              options={periodOptions}
              className="dropdown-period dropdown-stats"
            />

            {period !== "Alla perioder" && (
              <SelectField
                label="Tidspann"
                value={periodView}
                onChange={setPeriodView}
                options={periodViewOptions}
                className="dropdown-period-view dropdown-stats"
              />
            )}
          </>
        )}
      </div>

      <div className="stats-div">
        <div className="stats-item">
          <label>Loggad tid</label>
          <br />
          <strong>{activeStats?.total?.logged?.formatted || "0h 0m"}</strong>
        </div>
        <div className="stats-item">
          <label>Planerad tid</label>
          <br />
          <strong>{activeStats?.total?.planned?.formatted || "0h 0m"}</strong>
        </div>
        <div className="stats-item">
          <label>Sjuk/Skadad (dagar)</label>
          <br />
          <strong>
            {sickDays}/{injuryDays}
          </strong>
        </div>
      </div>

      {activeStats ? (
        <>
          <div className="distribution-diagrams">
            <TimePerZone
              totalMinutes={activeStats?.total?.logged?.totalMinutes || 0}
              data={activeStats?.tiz || []}
            />
          </div>
          <div className="distribution-diagrams">
            <TimePerSport
              totalMinutes={activeStats?.total?.logged?.totalMinutes || 0}
              data={activeStats?.sports || []}
            />
          </div>
        </>
      ) : (
        <div className="no-data">
          Laddar statistik eller ingen data hittad...
        </div>
      )}
    </main>
  );
}

export default Stats;
