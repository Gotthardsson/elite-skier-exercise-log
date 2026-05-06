import { useEffect, Fragment, useMemo, useState } from "react";
import { getWeekDays } from "../../utils/date/dateHelper";
import "./calender.css";
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
  const [logSelected, setLogSelected] = useState(true);
  const [dateOfCell, setDateOfCell] = useState<Date>(new Date());
  const [timeOfDay, setTimeOfDay] = useState("Morgon");
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [plannedSessionClicked, setPlannedSessionClicked] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );

  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const fetchSessions = async () => {
    try {
      const response = await workoutSessionApi.getByUserId(1);
      setSessions(response.data);
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
    return activities.find((a) => a.id === activityId)?.name ?? "Pass";
  }

  function logPlannedSession(e: React.MouseEvent, plannedSession: SessionType) {
    e.stopPropagation(); // Hindrar cell-klicket
    setDateOfCell(new Date(plannedSession.scheduledDate));
    setTimeOfDay(plannedSession.timeOfDay || "Morgon");
    setSelectedSession(plannedSession);
    setPlannedSessionClicked(true);
    setButtonPopup(true);
  }

  return (
    <section className="calendar">
      <div className="calendar-nav">
        <button
          onClick={() => {
            const prev = new Date(currentDate);
            prev.setDate(prev.getDate() - 7);
            setCurrentDate(prev);
          }}
        >
          ←
        </button>
        <button onClick={() => setCurrentDate(new Date())}>Idag</button>
        <button
          onClick={() => {
            const next = new Date(currentDate);
            next.setDate(next.getDate() + 7);
            setCurrentDate(next);
          }}
        >
          →
        </button>
        <SwitchViewComponent
          onChange={(isLog) => {
            setBorderStyle(isLog ? "3px solid #2fd08f" : "3px solid #3b82f6");
            setLogSelected(isLog);
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
                (s) =>
                  isSameDate(day.fullDate, s.scheduledDate) &&
                  s.timeOfDay === slot
              );

              return (
                <button
                  key={`${slot}-${day.key}`}
                  className="calendar-cell"
                  onClick={() => {
                    // Skapa NYTT pass
                    setDateOfCell(day.fullDate);
                    setTimeOfDay(slot);
                    setSelectedSession(null);
                    setPlannedSessionClicked(false);
                    setButtonPopup(true);
                  }}
                >
                  <span className="cell-plus">+</span>
                  <div className="session-cell-list">
                    {sessionsForCell.map((s) => (
                      <div
                        key={s.id}
                        className={`session-cell-card ${
                          s.isLogged ? "logged" : "planned"
                        }`}
                        onClick={(e) => {
                          if (!s.isLogged) {
                            logPlannedSession(e, s);
                          } else {
                            e.stopPropagation(); // Hindrar klick även på loggade pass
                          }
                        }}
                      >
                        <strong>{getActivityName(s.activityId)}</strong>
                        <span>{getTotalTime(s)}min</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      <SessionModal
        trigger={buttonPopup}
        setTrigger={(val: boolean) => {
          setButtonPopup(val);
          if (!val) {
            setPlannedSessionClicked(false);
            setSelectedSession(null);
          }
        }}
        activities={activities}
        date={dateOfCell}
        timeOfDay={timeOfDay}
        onSessionSaved={fetchSessions}
        isLogSelected={logSelected}
        plannedSessionClicked={plannedSessionClicked}
        session={selectedSession}
      />
    </section>
  );
}
