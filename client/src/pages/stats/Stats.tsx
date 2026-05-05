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

//KVAR ATT FIXA:
// SJUKDAGAR OCH SKADEDAGAR,
// VISA "PERIOD DATA" FÖR SÄSONG I STAPLAR

function Stats(props) {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [timeSpan, setTimeSpan] = useState("Säsong");
  const [season, setSeason] = useState("26/27");
  const [period, setPeriod] = useState("Alla perioder");
  const [periodView, setPeriodView] = useState("Hela perioden");
  const [week, setWeek] = useState("Vecka 1");

  // Options
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
        const response = await workoutSessionApi.getByUserId(1);
        setSessions(response.data);
      } catch (error) {
        console.error("Kunde inte hämta pass:", error);
      }
    };
    fetchSessions();
  }, []);

  // Beräkna data
  const activeStats = useMemo(() => {
    if (!sessions.length || !props.activities.length) return null;

    if (timeSpan === "Säsong") {
      if (period === "Alla perioder") {
        return getStatsForSeason(sessions, props.activities, season);
      }

      const periodNumber = parseInt(period.replace("Period ", ""));

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

      return getStatsForPeriod(
        sessions,
        props.activities,
        periodNumber,
        season
      );
    } else if (timeSpan === "Total statistik") {
      return getAllTimeStats(sessions, props.activities);
    }

    // Fallback för globala Vecka 1-52 om det behövs senare
    return getStatsForSeason(sessions, props.activities, season);
  }, [timeSpan, period, periodView, season, sessions, props.activities]);

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
                setPeriodView("Hela perioden");
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
          {activeStats?.total?.logged?.formatted || "0h 0m"}
        </div>
        <div className="stats-item">
          <label>Planerad tid</label>
          <br />
          {activeStats?.total?.planned?.formatted || "0h 0m"}
        </div>
        <div className="stats-item">
          <label>Sjuk/Skadad</label>
          <br />
          {sickDays}/{injuryDays}
        </div>
      </div>

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
    </main>
  );
}

export default Stats;
