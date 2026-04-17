import { Fragment, useMemo, useState } from "react";
import { getWeekDays } from "../../utils/date/dateHelper";
import "./calender.css";
import DailyTotals from "../../components/DailyTotals/DailyTotals";
import SessionModal from "./SessionModal";

const timeSlots = ["Morgon", "Förmiddag", "Eftermiddag", "Kväll"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const [buttonPopup, setButtonPopup] = useState(false);

  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  function handlePrevWeek() {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  }

  function handleNextWeek() {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  }

  function goToToday() {
    const today = new Date();
    setCurrentDate(today);
  }

  return (
    <section className="calendar">
      <div className="calendar-nav">
        <button type="button" onClick={handlePrevWeek}>
          ←
        </button>
        <button type="button" onClick={goToToday}>
          Idag
        </button>
        <button type="button" onClick={handleNextWeek}>
          →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-corner" />

        {days.map((day) => (
          <div key={day.key} className="calendar-day">
            <span className="calendar-day-short">{day.short}</span>
            <span
              className={`calendar-day-date ${day.isToday ? "is-active" : ""}`}
            >
              {day.dateNumber}
            </span>
          </div>
        ))}

        {timeSlots.map((slot) => (
          <Fragment key={slot}>
            <div className="calendar-row-label">{slot}</div>

            {days.map((day) => (
              <button
                key={`${slot}-${day.key}`}
                className="calendar-cell"
                type="button"
                onClick={() => {
                  setButtonPopup(true);
                }}
              >
                +
              </button>
            ))}
          </Fragment>
        ))}
        <DailyTotals />
      </div>
      <SessionModal trigger={buttonPopup} setTrigger={setButtonPopup} />
    </section>
  );
}
