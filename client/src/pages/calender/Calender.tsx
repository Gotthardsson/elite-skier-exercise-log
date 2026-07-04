import { useEffect, Fragment, useMemo, useState } from "react";
import { getWeekDays } from "../../utils/date/dateHelper";
import "./calender.css";
import SessionModal from "./sessionModal/SessionModal";
import CalendarNav from "./CalenderNav";
import type { Activity } from "../../types/Activity";
import { workoutSessionApi } from "../../api/workoutSessionApi";
import type { SessionType } from "../../types/SessionType";
import { getStartOfWeek } from "../../utils/date/dateHelper";

import Swal from "sweetalert2";

import ButtonPrimary from "../../components/ButtonPrimary";
import DayStatusModal from "./dayStatusModal/DayStatusModal";
import type { dayType } from "../../types/dayType";
import { dayStatusApi } from "../../api/dayStatusApi";
import { WeeklySummary } from "./weeklySummaryModal/WeeklySummaryModal";

interface CalenderProps {
  activities: Activity[];
  isCoachMode: boolean;
  setIsCoachMode: (isCoachMode: boolean) => void;
}

const timeSlots = ["Morgon", "Förmiddag", "Eftermiddag", "Kväll"];

export default function Calendar({
  activities,
  isCoachMode,
  setIsCoachMode,
}: CalenderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [buttonPopup, setButtonPopup] = useState(false);
  const [dayStatusPopup, setDayStatusPopup] = useState(false);
  const [borderStyle, setBorderStyle] = useState("3px solid #2fd08f");
  const [logSelected, setLogSelected] = useState(true);
  const [dateOfCell, setDateOfCell] = useState<Date>(new Date());
  const [timeOfDay, setTimeOfDay] = useState("Morgon");
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [plannedSessionClicked, setPlannedSessionClicked] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );
  const [savedDayStatuses, setSavedDayStatuses] = useState<dayType[]>([]);
  const [editClicked, setEditClicked] = useState(false);
  const [userId, setUserId] = useState(1); // Ändras dynamiskt via CalendarNav

  const days = useMemo(() => getWeekDays(currentDate), [currentDate, userId]);

  const toLocalISOString = (date: Date | string) => {
    const d = new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000; // i millisekunder
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString();
    return localISOTime;
  };

  const fetchSessions = async () => {
    try {
      const response = await workoutSessionApi.getByUserId(userId);
      setSessions(response.data);
    } catch (error) {
      console.error("Kunde inte hämta pass:", error);
    }
  };

  // Hämtar dagsstatusar synkat med det valda userId:t
  const fetchAllDayStatuses = async () => {
    // 1. Tvinga fram en tömning av gamla statusar direkt så att UI nollställs för den nya användaren
    setSavedDayStatuses([]);

    try {
      // 2. Skapa en lokal kopia av det ID som gäller JUST NU när funktionen körs
      const currentActiveUserId = userId;
      console.log(
        "[Kalender] Hämtar dagsstatusar för användare:",
        currentActiveUserId
      );

      // 3. Skicka med den lokala kopian i anropet
      const requests = days.map((day) =>
        dayStatusApi.getByDate(day.fullDate, currentActiveUserId)
      );
      const responses = await Promise.all(requests);

      const activeStatuses = responses
        .filter((res) => res.status === 200 && res.data)
        .map((res) => res.data as dayType);

      setSavedDayStatuses(activeStatuses);
    } catch (error) {
      console.error("Kunde inte hämta dagsstatusar till kalendern:", error);
    }
  };

  const weeklySessions = useMemo(() => {
    if (!sessions || !currentDate) return [];

    // 1. Hämta måndagen i den aktuella veckan (00:00:00) via din hjälpmetod
    const startOfWeek = getStartOfWeek(currentDate);

    // 2. Räkna ut söndagen i samma vecka genom att addera 6 dagar
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Sätt tiden till precis slutet av söndagen så inga kvällspass missas
    endOfWeek.setHours(23, 59, 59, 999);

    // 3. Filtrera listan så bara pass inom måndag-söndag sparas
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduledDate);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });
  }, [sessions, currentDate]);

  const handleTemplateDrop = async (
    date: Date,
    slot: string,
    rawTemplateData: string
  ) => {
    try {
      const template = JSON.parse(rawTemplateData);
      const newSession = {
        userId: userId,
        activityId: template.activityId || 0,
        scheduledDate: toLocalISOString(date),
        timeOfDay: slot,
        isLogged: false,
        description: template.description || "",
        loggedComment: "",
        feeling: 5,
        mentalRpe: 5,
        plannedZones: {
          a1: template.plannedZones?.a1 || 0,
          a2: template.plannedZones?.a2 || 0,
          a3Minus: template.plannedZones?.a3Minus || 0,
          a3: template.plannedZones?.a3 || 0,
          a3Plus: template.plannedZones?.a3Plus || 0,
          comp: template.plannedZones?.comp || 0,
        },
        actualZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 },
      };

      await workoutSessionApi.create(newSession);
      await fetchSessions();

      Swal.fire({
        title: "Inplanerat!",
        text: `Mallen "${
          template.title
        }" lades till på ${slot.toLowerCase()}en.`,
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Kunde inte skapa pass från mall:", error);
      Swal.fire("Fel", "Gick inte att läsa malldata.", "error");
    }
  };

  function isSameDate(dateA: Date, dateB: string | Date) {
    const a = new Date(dateA);
    const b = new Date(dateB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function getStatusClassForDate(dayDate: Date): string {
    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(dayDate.getDate()).padStart(2, "0");
    const calendarDateStr = `${year}-${month}-${dayStr}`;

    const status = savedDayStatuses.find((s) => {
      if (!s || !s.day) return false;
      return calendarDateStr === s.day.substring(0, 10);
    });

    if (!status) return "";

    if (status.sick) return "status-saved-sick";
    if (status.injured) return "status-saved-injured";
    if (status.restDay) return "status-saved-rest";
    if (status.travelDay) return "status-saved-travel";
    if (status.hrv > 0 || status.restingHeartRate > 0)
      return "status-saved-biometrics";

    return "";
  }

  function getStatusEmojiForDate(dayDate: Date): string {
    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(dayDate.getDate()).padStart(2, "0");
    const calendarDateStr = `${year}-${month}-${dayStr}`;

    const status = savedDayStatuses.find((s) => {
      if (!s || !s.day) return false;
      return calendarDateStr === s.day.substring(0, 10);
    });

    if (!status) return "";

    if (status.sick) return "(Sjuk) ";
    if (status.injured) return "(Skadad) ";
    if (status.restDay) return "(Vila) ";
    if (status.travelDay) return "(Resdag) ";
    if (status.hrv > 0 || status.restingHeartRate > 0) return "📊 ";

    return "";
  }

  function getTotalTime(session: SessionType) {
    const zones =
      !session.stravaRaw && session.isLogged
        ? session.actualZones
        : !session.stravaRaw && !session.isLogged
        ? session.plannedZones
        : session.actualZones;

    return (
      zones.a1 + zones.a2 + zones.a3Minus + zones.a3 + zones.a3Plus + zones.comp
    );
  }

  function getActivityCode(activityId: number) {
    switch (activityId) {
      case 1:
        return "SK";
      case 2:
        return "KL";
      case 3:
        return "RSK";
      case 4:
        return "RKL";
      case 5:
        return "MTB";
      case 6:
        return "LVG";
      case 7:
        return "LÖP";
      case 8:
        return "STV";
      case 9:
        return "SIM";
      case 10:
        return "STK";
      case 11:
        return "ERG";
      case 12:
        return "ÖVR";
      default:
        return "PASS";
    }
  }

  function logOrEditSession(
    e: React.MouseEvent,
    session: SessionType,
    isLogged: boolean,
    editClicked: boolean
  ) {
    e.stopPropagation();
    setDateOfCell(new Date(session.scheduledDate));
    setTimeOfDay(session.timeOfDay || "Morgon");
    setSelectedSession(session);

    if (!isLogged && !editClicked) {
      setPlannedSessionClicked(true);
    }
    setButtonPopup(true);
  }

  const handleDeleteSession = async (
    e: React.MouseEvent,
    sessionId: number
  ) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Vill du radera passet?",
      text: "Du kan inte ångra detta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#11b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ja, ta bort!",
      cancelButtonText: "Avbryt",
      background: "#fff",
      borderRadius: "15px",
    });

    if (result.isConfirmed) {
      try {
        await workoutSessionApi.delete(sessionId);
        await fetchSessions();
        Swal.fire({
          title: "Raderad!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Fel!", "Kunde inte radera passet.", "error");
      }
    }
  };

  const getDayTotal = (dayDate: Date) => {
    return sessions
      .filter((s) => isSameDate(dayDate, s.scheduledDate))
      .reduce((sum, s) => sum + getTotalTime(s), 0);
  };

  // Ser till att kalendern laddar om ALLT (både pass och dagsstatusar) när användare eller datum ändras
  useEffect(() => {
    fetchSessions();
    fetchAllDayStatuses();
  }, [currentDate, userId]);

  return (
    <section className="calendar">
      <CalendarNav
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        userId={userId}
        setUserId={setUserId}
        isCoachMode={isCoachMode}
        setIsCoachMode={setIsCoachMode}
      />

      <div className="calendar-grid" style={{ border: borderStyle }}>
        <div className="calendar-corner">
          {currentDate.toLocaleString("sv-SE", { month: "long" })}
        </div>

        {/* TOPPRADEN: Visar bara veckodag, datum och totaltid per dag */}
        {days.map((day) => (
          <div key={day.key} className="calendar-day">
            <span className="calendar-day-short">{day.short}</span>
            <span
              className={`calendar-day-date ${day.isToday ? "is-active" : ""}`}
            >
              {day.dateNumber}
            </span>
            <div className="calendar-day-total">
              {getDayTotal(day.fullDate)} min
            </div>
            {/* dagsstatus */}
            <div key={`status-row-${day.key}`} className="day-status-container">
              <div className={getStatusClassForDate(day.fullDate)}>
                <ButtonPrimary
                  text={`${getStatusEmojiForDate(day.fullDate)}Dagsstatus`}
                  onClick={() => {
                    setDateOfCell(day.fullDate);
                    setDayStatusPopup(true);
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* TRÄNINGSPASSEN: Loopar ut Morgon, Förmiddag, Eftermiddag, Kväll */}
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
                <div
                  key={`${slot}-${day.key}`}
                  className="calendar-cell"
                  onClick={() => {
                    const clickedDate = new Date(day.fullDate);
                    const now = new Date();
                    const today = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate()
                    );
                    const clickedDay = new Date(
                      clickedDate.getFullYear(),
                      clickedDate.getMonth(),
                      clickedDate.getDate()
                    );

                    setDateOfCell(day.fullDate);
                    setTimeOfDay(slot);
                    setPlannedSessionClicked(false);
                    setLogSelected(clickedDay <= today);
                    setButtonPopup(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("drag-over");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("drag-over");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");
                    const rawData = e.dataTransfer.getData("application/json");
                    if (rawData) {
                      handleTemplateDrop(day.fullDate, slot, rawData);
                    }
                  }}
                >
                  <span className="cell-plus">+</span>
                  <div className="session-cell-list">
                    {sessionsForCell.map((s) => (
                      <div
                        key={s.id}
                        className={`session-cell-card ${
                          s.isLogged ? "logged" : "planned"
                        } ${s.stravaRaw ? "strava" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!s.isLogged) {
                            setEditClicked(false);
                            logOrEditSession(e, s, s.isLogged, false);
                          } else {
                            setEditClicked(true);
                            logOrEditSession(e, s, s.isLogged, true);
                          }
                        }}
                      >
                        <div
                          className={
                            s.isLogged
                              ? "session-cell-header logged"
                              : "session-cell-header planned"
                          }
                        >
                          <div className="sm-text-content-container">
                            <strong>{getActivityCode(s.activityId)}</strong>
                            <div className="session-cell-card-content">
                              <span>{getTotalTime(s)} min</span>

                              {/* VISUELL ZONSTAPEL */}
                              {getTotalTime(s) > 0 && (
                                <div className="session-zone-bar">
                                  {(() => {
                                    const total = getTotalTime(s);
                                    const zoneObj = s.isLogged
                                      ? s.actualZones
                                      : s.plannedZones;

                                    if (!zoneObj) return null;

                                    const zones = [
                                      zoneObj.a1,
                                      zoneObj.a2,
                                      zoneObj.a3Minus,
                                      zoneObj.a3,
                                      zoneObj.a3Plus,
                                      zoneObj.comp,
                                    ];

                                    const zoneClasses = [
                                      "zone-a1",
                                      "zone-a2",
                                      "zone-a3minus",
                                      "zone-a3",
                                      "zone-a3plus",
                                      "zone-comp",
                                    ];

                                    return zones.map((minutes, index) => {
                                      if (!minutes || minutes <= 0) return null;
                                      const percentage =
                                        (minutes / total) * 100;

                                      return (
                                        <div
                                          key={index}
                                          className={`zone-segment ${zoneClasses[index]}`}
                                          style={{ width: `${percentage}%` }}
                                          title={`${minutes} min i denna zon`}
                                        />
                                      );
                                    });
                                  })()}
                                </div>
                              )}
                              {(() => {
                                const rawText = s.isLogged
                                  ? s.loggedComment
                                  : s.comment;
                                if (!rawText) return null;
                                const words = rawText.trim().split(/\s+/);
                                const shortText = words.slice(0, 3).join(" ");
                                return (
                                  <p className="session-cell-comment-preview">
                                    {shortText}
                                    {words.length > 3 ? "..." : ""}
                                  </p>
                                );
                              })()}
                            </div>
                            <span className="session-status-badge">
                              {(() => {
                                if (!s.isLogged && s.stravaRaw)
                                  return "Ologgat (Strava)";
                                if (s.isLogged && s.stravaRaw)
                                  return "Loggat (Strava)";
                                if (s.isLogged) return "Loggat";
                                return "Planerat";
                              })()}
                            </span>

                            <div>
                              <button
                                className={`session-cell-log-btn ${
                                  s.isLogged ? "logged" : "planned"
                                }`}
                                onClick={(e) => {
                                  if (!s.isLogged) {
                                    logOrEditSession(e, s, s.isLogged, false);
                                  } else {
                                    e.stopPropagation();
                                  }
                                }}
                              >
                                {!s.isLogged ? "Logga" : ""}
                              </button>
                            </div>
                          </div>
                          <div className="sm-edit-btns-container">
                            <button
                              className={
                                s.isLogged
                                  ? "sm-edit-btn logged"
                                  : "sm-edit-btn planned"
                              }
                              title="Redigera"
                              onClick={(e) => {
                                setEditClicked(true);
                                logOrEditSession(e, s, s.isLogged, true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                              </svg>
                            </button>
                            <button
                              className={
                                s.isLogged
                                  ? "sm-edit-btn logged delete"
                                  : "sm-edit-btn planned delete "
                              }
                              onClick={(e) => handleDeleteSession(e, s.id!)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
            setEditClicked(false);
            setSelectedSession(null);
          }
        }}
        activities={activities}
        userId={userId}
        date={dateOfCell}
        timeOfDay={timeOfDay}
        onSessionSaved={fetchSessions}
        isLogSelected={logSelected}
        plannedSessionClicked={plannedSessionClicked}
        session={selectedSession}
        editClicked={editClicked}
      />

      <DayStatusModal
        trigger={dayStatusPopup}
        setTrigger={(val: boolean) => setDayStatusPopup(val)}
        date={dateOfCell}
        userId={userId} // Skickar med det aktiva användar-id:t till spara-modalen
        onStatusSaved={fetchAllDayStatuses}
      />

      <WeeklySummary weeklySessions={weeklySessions} activities={activities} />
    </section>
  );
}
