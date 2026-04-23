import "./dailyTotals.css";

//Kolla totalen för varje dag en specik vecka. Summera totalen och skriv ut längst ned under varje dag i kalender.
export default function DailyTotals() {
  const totals = [
    ["monday", 5],
    ["tuesday", 0],
    ["wednesday", 0],
    ["thursday", 3],
    ["friday", 0],
    ["saturday", 0],
    ["sunday", 0],
  ];

  return (
    //Första daily-total-label tar upp den första platsen i griden på kalendern så resten hamnar rätt
    <>
      <div className="daily-total-label"></div>

      {totals.map(([day, value]) => (
        <div key={day} className="daily-total">
          {value === 0 ? "-" : value}
        </div>
      ))}
    </>
  );
}
