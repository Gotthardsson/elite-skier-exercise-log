import "./calenderNav.css";
import ButtonPrimary from "../../components/ButtonPrimary";
import "../../components/button.css";

interface CalendarNavProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function CalendarNav({
  currentDate,
  setCurrentDate,
}: CalendarNavProps) {
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleJump = (seasonYear: number, period: number, week: number) => {
    // Skid-säsongen startar ofta 1 maj
    const date = new Date(seasonYear, 4, 1);

    // Hitta första måndagen i maj
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }

    // Hoppa framåt: (Perioder är ofta 4 veckor långa)
    const totalWeeksToAdd = (period - 1) * 4 + (week - 1);
    date.setDate(date.getDate() + totalWeeksToAdd * 7);

    setCurrentDate(date);
  };

  return (
    <div className="calendar-nav-container">
      <div className="nav-group buttons">
        <ButtonPrimary onClick={() => changeDate(-7)} text="←" />
        <ButtonPrimary onClick={() => setCurrentDate(new Date())} text="Idag" />
        <ButtonPrimary onClick={() => changeDate(7)} text="→" />
      </div>

      <div className="nav-group selectors">
        <select
          className="calendar-custom-select"
          onChange={(e) => handleJump(Number(e.target.value), 1, 1)}
        >
          <option value="2026">Säsong 26/27</option>
          <option value="2025">Säsong 25/26</option>
          <option value="2024">Säsong 24/25</option>
        </select>

        <select
          className="calendar-custom-select"
          onChange={(e) => handleJump(2026, Number(e.target.value), 1)}
        >
          {[...Array(13)].map((_, i) => (
            <option key={i} value={i + 1}>
              Period {i + 1}
            </option>
          ))}
        </select>

        <select
          className="calendar-custom-select"
          onChange={(e) => handleJump(2026, 1, Number(e.target.value))}
        >
          {[1, 2, 3, 4].map((v) => (
            <option key={v} value={v}>
              Vecka {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
