import "./dailyTotals.css";

export default function DailyTotals(props) {
  return (
    <>
      <div className="daily-total-label"></div>

      {props.days.map((day) => {
        const total = props.getDailyTotal(day.fullDate);

        if (total > 60) {
          const hours = Math.floor(total / 60);
          const minutes = total % 60;
          console.log(total);
          console.log(hours);
          console.log(minutes);

          return (
            <div key={day.key} className="daily-total">
              {total > 0 ? `${hours}h  ${minutes}min` : "-"}
            </div>
          );
        } else {
          return (
            <div key={day.key} className="daily-total">
              {total > 0 ? `${total} min` : "-"}
            </div>
          );
        }
      })}
    </>
  );
}
