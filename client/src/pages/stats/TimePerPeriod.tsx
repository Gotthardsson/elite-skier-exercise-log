import "./stats.css";

interface PeriodData {
  period: number;
  hours: number;
}

interface TimePerPeriodProps {
  data: PeriodData[];
  onPeriodClick: (periodNumber: number) => void; // <-- NYTT: Definiera proppen i interfacet
}

function TimePerPeriod({ data, onPeriodClick }: TimePerPeriodProps) {
  const maxHours = Math.max(...data.map((d) => d.hours), 1);

  return (
    <div className="period-chart-container">
      <h3>Träningstid per period (timmar)</h3>
      <div className="chart-bars">
        {data.map((d) => {
          const barHeight = (d.hours / maxHours) * 100;

          return (
            <div
              key={d.period}
              className="bar-wrapper"
              onClick={() => onPeriodClick(d.period)} // <-- NYTT: Gör hela stapelområdet klickbart!
              style={{ cursor: "pointer" }} // <-- NYTT: Visar en klickbar handvektor
            >
              <div className="bar-value">
                {d.hours > 0 ? `${d.hours.toFixed(1)}h` : "0h"}
              </div>
              <div
                className="bar-graphic"
                style={{ height: `${Math.max(barHeight, 2)}%` }}
                title={`Klicka för att öppna Period ${d.period}`}
              />
              <div className="bar-label">P{d.period}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimePerPeriod;
