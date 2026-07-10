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
import { dayStatusApi } from "../../api/dayStatusApi.ts"; // NY: Importera ditt dagsstatus-API
import type { SessionType } from "../../types/SessionType.ts";
import type { dayType } from "../../types/dayType.ts"; // NY: Importera din typ
import TimePerPeriod from "./TimePerPeriod";
import { useCurrentUser } from "../../auth/CurrentUserContext";

function Stats(props: { activities: any[] }) {
  const currentUser = useCurrentUser();
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [dayStatuses, setDayStatuses] = useState<dayType[]>([]); // NY: State för dagsstatusar
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

  // Hämta både träningspass och dagsstatusar vid laddning
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await workoutSessionApi.getByUserId(currentUser.id);
        setSessions(sessionResponse.data);

        const statusResponse = await dayStatusApi.getAllStatuses(currentUser.id);
        if (statusResponse.status === 200 && statusResponse.data) {
          setDayStatuses(statusResponse.data);
        }
      } catch (error) {
        console.error("Kunde inte hämta data till statistiken:", error);
      }
    };
    fetchData();
  }, [currentUser.id]);

  // Beräkna träningsstatistik baserat på valen i UI
  const activeStats = useMemo(() => {
    if (!sessions.length || !props.activities.length) return null;

    if (timeSpan === "Total statistik") {
      return getAllTimeStats(sessions, props.activities);
    }

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
    }

    return null;
  }, [timeSpan, period, periodView, season, sessions, props.activities]);

  // Räkna ut ackumulerad tid per period för stapeldiagrammet
  const periodChartData = useMemo(() => {
    // Vi vill BARA visa detta om vyn är "Säsong" och urvalet är "Alla perioder"
    if (
      timeSpan !== "Säsong" ||
      period !== "Alla perioder" ||
      !sessions.length
    ) {
      return null;
    }

    // Skapa en array för de 13 perioderna (P1 till P13)
    return Array.from({ length: 13 }, (_, i) => {
      const periodNumber = i + 1;

      // Hämta ut statistiken för just denna specifika period via din service
      const statsForThisPeriod = getStatsForPeriod(
        sessions,
        props.activities,
        periodNumber,
        season
      );

      // Hämta totalt antal minuter och konvertera till timmar
      const totalMinutes = statsForThisPeriod?.total?.logged?.totalMinutes || 0;
      const hours = totalMinutes / 60;

      return {
        period: periodNumber,
        hours: hours,
      };
    });
  }, [timeSpan, period, season, sessions, props.activities]);

  // NYTT: Beräkna och filtrera dagsstatusar dynamiskt baserat på ditt aktiva tidsfilter!
  const statusSummary = useMemo(() => {
    let filteredStatuses = [...dayStatuses];

    // Om vi bara kollar på en specifik säsong (t.ex. "26/27" startar 1 maj 2026)
    if (timeSpan === "Säsong") {
      const startYear = 2000 + parseInt(season.split("/")[0]); // Blir 2026
      const seasonStart = new Date(startYear, 4, 1); // 1 Maj
      const seasonEnd = new Date(startYear + 1, 3, 30, 23, 59, 59); // 30 April året efter

      filteredStatuses = filteredStatuses.filter((s) => {
        const statusDate = new Date(s.day);
        return statusDate >= seasonStart && statusDate <= seasonEnd;
      });

      // Om en specifik period eller vecka är vald, synkar vi enklast genom att matcha
      // de exakta datumen som dina aktiva träningspass i 'activeStats' har fallit inom.
      if (period !== "Alla perioder" && activeStats?.periodDates) {
        const { start, end } = activeStats.periodDates;
        // Obs: Om dina workoutStatsService-metoder inte returnerar datumintervall,
        // kan du använda de generella datumen från dina pass. Här matchar vi mot activeStats period.
        const pStart = new Date(start);
        const pEnd = new Date(end);

        filteredStatuses = filteredStatuses.filter((s) => {
          const d = new Date(s.day);
          return d >= pStart && d <= pEnd;
        });
      }
    }

    // Räkna ihop antal förekomster i den filtrerade listan
    return {
      sick: filteredStatuses.filter((s) => s.sick).length,
      injured: filteredStatuses.filter((s) => s.injured).length,
      rest: filteredStatuses.filter((s) => s.restDay).length,
      travel: filteredStatuses.filter((s) => s.travelDay).length,
    };
  }, [timeSpan, season, period, periodView, dayStatuses, activeStats]);

  return (
    <main>
      {/* 1. Dropdown-menyerna för filtrering */}
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

      {/* 2. De fyra sammanfattande rutorna (Tid, Hälsa, Logistik) */}
      <div className="stats-div">
        <div className="stats-item">
          <label>Loggad tid</label>
          <br />
          <strong className="logged-time">
            {activeStats?.total?.logged?.formatted || "0h 0m"}
          </strong>
        </div>
        <div className="stats-item">
          <label>Planerad tid</label>
          <br />
          <strong className="planned-time">
            {activeStats?.total?.planned?.formatted || "0h 0m"}
          </strong>
        </div>
        <div className="stats-item status-indicator-sick-injured">
          <label>Hälsa (Sjuk / Skadad)</label>
          <br />
          <strong>
            <span className="text-red">{statusSummary.sick}d /</span>{" "}
            <span className="text-orange">{statusSummary.injured}d</span>
          </strong>
        </div>
        <div className="stats-item status-indicator-rest-travel">
          <label>Logistik (Vila / Resa)</label>
          <br />
          <strong>
            <span className="text-blue">{statusSummary.rest}d /</span>{" "}
            <span className="text-cyan">{statusSummary.travel}d</span>
          </strong>
        </div>
      </div>

      {/* 3. Diagramsektionen – renderas bara om det finns data */}
      {activeStats ? (
        <>
          {/* Visar period-stapeldiagrammet överst, MEN bara om 'Säsong' och 'Alla perioder' är valt */}
          {periodChartData && (
            <div className="distribution-diagrams full-width-diagram">
              <TimePerPeriod
                data={periodChartData}
                onPeriodClick={(pNum) => setPeriod(`Period ${pNum}`)}
              />
            </div>
          )}

          {/* Pulszonsfördelning */}
          <div className="distribution-diagrams">
            <TimePerZone
              totalMinutes={activeStats?.total?.logged?.totalMinutes || 0}
              data={activeStats?.tiz || []}
            />
          </div>

          {/* Sportfördelning */}
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
