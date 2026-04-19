type SportItem = {
  sport: string;
  minutes: number;
};

type TimePerSportProps = {
  totalMinutes: number;
  data: SportItem[];
};

function TimePerSport({ totalMinutes, data }: TimePerSportProps) {
  return (
    <div className="time-per-item-content">
      <h3>Tid per sport</h3>

      {data.map((item) => {
        const hours = Math.floor(item.minutes / 60);
        const minutes = item.minutes % 60;

        const percent =
          totalMinutes > 0
            ? Math.round((item.minutes / totalMinutes) * 100)
            : 0;

        return (
          <div key={item.sport} className="item-row">
            <div className="item-row-header">
              <span className="item-name">{item.sport}</span>
              <span className="item-time">
                {hours}h {minutes}min
              </span>
            </div>

            <div className="item-row-bar">
              <div
                className="item-row-fill"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <div className="item-row-percent">{percent}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default TimePerSport;
