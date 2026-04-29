import { useEffect, Fragment, useMemo, useState } from "react";
import { getWeekDays } from "../../utils/date/dateHelper";
import "./calender.css";
import DailyTotals from "../../components/DailyTotals/DailyTotals";
import SessionModal from "./sessionModal/SessionModal";
import SwitchViewComponent from "./SwitchViewComponent";
import type { Activity } from "../../types/Activity";
import { workoutSessionApi } from "../../api/workoutSessionApi";
import type { SessionType } from "../../types/SessionType";

interface CalenderProps {
  activities: Activity[];
}

const timeSlots = ["Morgon", "Förmiddag", "Eftermiddag", "Kväll"];

export default function Calendar({ activities }: CalenderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [buttonPopup, setButtonPopup] = useState(false);
  const [borderStyle, setBorderStyle] = useState("3px solid #2fd08f");
  const [LogSelected, setLogSelected] = useState(true);
  const [dateOfCell, setDateOfCell] = useState<Date>(new Date());
  const [timeOfDay, setTimeOfDay] = useState("Morgon");
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);
  console.log(days);

  function getDailyTotal(day: Date) {
    const sessionsForDay = sessions.filter((session) =>
      isSameDate(day, session.scheduledDate)
    );

    const totalMinutes = sessionsForDay.reduce((total, session) => {
      const zones = session.actualZones;

      const sessionTotal =
        zones.a1 +
        zones.a2 +
        zones.a3Minus +
        zones.a3 +
        zones.a3Plus +
        zones.comp;

      return total + sessionTotal;
    }, 0);

    return totalMinutes;
  }

  const fetchSessions = async () => {
    try {
      const response = await workoutSessionApi.getByUserId(1);
      setSessions(response.data);
      console.log("Hämtade pass:", response.data);
    } catch (error) {
      console.error("Kunde inte hämta pass:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  function isSameDate(dateA: Date, dateB: string | Date) {
    const a = new Date(dateA);
    const b = new Date(dateB);

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function getTotalTime(session: SessionType) {
    const zones = session.isLogged ? session.actualZones : session.plannedZones;

    return (
      zones.a1 + zones.a2 + zones.a3Minus + zones.a3 + zones.a3Plus + zones.comp
    );
  }

  function getActivityName(activityId: number) {
    const activity = activities.find((a) => a.id === activityId);
    return activity?.name ?? "Pass";
  }

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
    setCurrentDate(new Date());
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

        <SwitchViewComponent
          onChange={(isLogSelected) => {
            setBorderStyle(
              isLogSelected ? "3px solid #2fd08f" : "3px solid #3b82f6"
            );
            setLogSelected(isLogSelected);

            console.log(isLogSelected);
          }}
        />
      </div>

      <div className="calendar-grid" style={{ border: borderStyle }}>
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

            {days.map((day) => {
              const sessionsForCell = sessions.filter(
                (session) =>
                  isSameDate(day.fullDate, session.scheduledDate) &&
                  session.timeOfDay === slot
              );

              return (
                <button
                  key={`${slot}-${day.key}`}
                  className="calendar-cell"
                  type="button"
                  onClick={() => {
                    setDateOfCell(day.fullDate);
                    setTimeOfDay(slot);
                    setButtonPopup(true);
                  }}
                >
                  <span className="cell-plus">+</span>

                  {sessionsForCell.length > 0 && (
                    <div className="session-cell-list">
                      {sessionsForCell.map((session) => (
                        <div
                          key={session.id}
                          className={`session-cell-card ${
                            session.isLogged ? "logged" : "planned"
                          }`}
                        >
                          <strong>{getActivityName(session.activityId)}</strong>
                          <span>{getTotalTime(session)}min</span>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </Fragment>
        ))}

        <DailyTotals days={days} getDailyTotal={getDailyTotal} />
      </div>

      <SessionModal
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        activities={activities}
        date={dateOfCell}
        timeOfDay={timeOfDay}
        onSessionSaved={fetchSessions}
        isLogSelected={LogSelected}
      />
    </section>
  );
}
