import React, { useMemo } from "react";
import type { SessionType } from "../../../types/SessionType.ts";
import "./WeeklySummaryModal.css";

interface WeeklySummaryProps {
  weeklySessions?: SessionType[];
  activities?: any[]; // Detta är nu er aktivitetslista från DB!
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  weeklySessions = [],
  activities = [],
}) => {
  const summary = useMemo(() => {
    if (!weeklySessions || weeklySessions.length === 0) return null;

    let totalMinutes = 0;
    const sportsMap: { [key: string]: { sport: string; minutes: number } } = {};
    let a1 = 0;
    let a2 = 0;
    let a3Minus = 0;
    let a3 = 0;
    let a3Plus = 0;
    let comp = 0;

    weeklySessions.forEach((session) => {
      if (!session.isLogged || !session.actualZones) return;

      const zones = session.actualZones;
      const sessionDuration =
        (zones.a1 || 0) +
        (zones.a2 || 0) +
        (zones.a3Minus || 0) +
        (zones.a3 || 0) +
        (zones.a3Plus || 0) +
        (zones.comp || 0);

      totalMinutes += sessionDuration;

      // KORRIGERING: Leta upp namnet i er egen aktivitetslista från databasen
      const dbActivity = activities.find(
        (a) => Number(a.id) === Number(session.activityId)
      );
      const sportName = dbActivity ? dbActivity.name : "Övrigt";

      if (!sportsMap[sportName]) {
        sportsMap[sportName] = { sport: sportName, minutes: 0 };
      }
      sportsMap[sportName].minutes += sessionDuration;

      a1 += zones.a1 || 0;
      a2 += zones.a2 || 0;
      a3Minus += zones.a3Minus || 0;
      a3 += zones.a3 || 0;
      a3Plus += zones.a3Plus || 0;
      comp += zones.comp || 0;
    });

    return {
      totalMinutes,
      zones: { a1, a2, a3Minus, a3, a3Plus, comp },
      sports: Object.values(sportsMap),
      loggedCount: weeklySessions.filter((s) => s.isLogged).length,
    };
  }, [weeklySessions, activities]);

  const formatHHMM = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  if (!summary || summary.totalMinutes === 0) {
    return (
      <div className="dashboard-summary-card">
        <h3 className="dashboard-summary-title">Veckosammanfattning</h3>
        <div className="dashboard-row-empty">
          Ingen loggad träning registrerad för denna vecka.
        </div>
      </div>
    );
  }

  const zoneRows = [
    { label: "A1 (Distans)", mins: summary.zones.a1, color: "#76c759" },
    { label: "A2 (Tröskel)", mins: summary.zones.a2, color: "#fdd835" },
    {
      label: "A3- (Hög tröskel)",
      mins: summary.zones.a3Minus,
      color: "#ba68c8",
    },
    { label: "A3 (VO2max)", mins: summary.zones.a3, color: "#ffa726" },
    { label: "A3+ (Anaerob)", mins: summary.zones.a3Plus, color: "#e53935" },
    { label: "Comp (Tävling)", mins: summary.zones.comp, color: "#757575" },
  ];

  return (
    <div className="dashboard-summary-card">
      <h3 className="dashboard-summary-title">Veckosammanfattning</h3>

      <div className="dashboard-summary-grid">
        <div className="dashboard-summary-col overview-col">
          <div className="overview-block">
            <label>Total träningsvolym</label>
            <div className="overview-time-value">
              {formatHHMM(summary.totalMinutes)}
            </div>
          </div>
          <div className="overview-block">
            <label>Utförda träningspass</label>
            <div className="overview-count-value">{summary.loggedCount} st</div>
          </div>
        </div>

        <div className="dashboard-summary-col data-block">
          <div className="column-header-row">
            <span>Kondition</span>
            <span className="column-header-total">
              {formatHHMM(summary.totalMinutes)}
            </span>
          </div>
          <div className="dashboard-data-list">
            {zoneRows.map((zone) => (
              <div key={zone.label} className="dashboard-data-row">
                <div className="dashboard-row-left">
                  <span
                    className="dashboard-color-dot"
                    style={{ backgroundColor: zone.color }}
                  ></span>
                  <span className="dashboard-row-name">{zone.label}</span>
                </div>
                <span className="dashboard-row-value">
                  {formatHHMM(zone.mins)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-summary-col data-block">
          <div className="column-header-row">
            <span>Sportfördelning</span>
            <span className="column-header-total">
              {formatHHMM(summary.totalMinutes)}
            </span>
          </div>
          <div className="dashboard-data-list">
            {summary.sports.map((item) => (
              <div key={item.sport} className="dashboard-data-row">
                <div className="dashboard-row-left">
                  <span
                    className="dashboard-row-name"
                    style={{ paddingLeft: "4px" }}
                  >
                    {item.sport}
                  </span>
                </div>
                <span className="dashboard-row-value">
                  {formatHHMM(item.minutes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
