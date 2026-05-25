import { useEffect, Fragment, useMemo, useState } from "react";
import { getWeekDays } from "../../utils/date/dateHelper";
import "./calender.css";
import SessionModal from "./sessionModal/SessionModal";
import SwitchViewComponent from "./SwitchViewComponent";
import type { Activity } from "../../types/Activity";
import { workoutSessionApi } from "../../api/workoutSessionApi";
import type { SessionType } from "../../types/SessionType";
import { folderApi } from "../../api/folderApi";
import { sessionTemplateApi } from "../../api/sessionTemplateApi";
import Swal from "sweetalert2";
import type { TemplateType } from "../../types/TemplateType";
import type { FolderType } from "../../types/FolderType";
import TemplateDropdown from "./templatesInCalender/TemplateDropdown";


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
    null);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  

  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const fetchSessions = async () => {
    try {
      const response = await workoutSessionApi.getByUserId(1);
      setSessions(response.data);
    } catch (error) {
      console.error("Kunde inte hämta pass:", error);
    }
  };
  const fetchFoldersAndTemplates = async () => {
    try {
      const [foldersResponse, templatesResponse] = await Promise.all([
        folderApi.getByUserId(1),
        sessionTemplateApi.getByUserId(1)
      ]);
      setFolders(foldersResponse.data);
      setTemplates(templatesResponse.data);
    } catch (error) {
      console.error("Kunde inte hämta mappar eller mallar:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchFoldersAndTemplates();
  }, []);

  const handleTemplateDrop = async (date: Date, slot: string, rawTemplateData: string) => {
    try {
      const template = JSON.parse(rawTemplateData);
      // Bygg upp ett nytt pass baserat på mallens parametrar
      const newSession = {
        userId: 1, // Ditt hårdkodade demo-id
        activityId: template.activityId || 0,
        scheduledDate: date.toISOString(), // Sparar datumet cellen representerar
        timeOfDay: slot, // Sparar "Morgon", "Förmiddag" etc.
        isLogged: false, // Det är ett planerat pass från början
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
        actualZones: { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 }
      };

      // Skicka till din backend
      await workoutSessionApi.create(newSession);
      
      // Uppdatera kalendern direkt så passet dyker upp på skärmen!
      await fetchSessions();
      
      // En liten bekräftelse
      Swal.fire({
        title: "Inplanerat!",
        text: `Mallen "${template.title}" lades till på ${slot.toLowerCase()}en.`,
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

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();

    // Ersätt window.confirm med SweetAlert
    const result = await Swal.fire({
      title: "Vill du radera passet?",
      text: "Du kan inte ångra detta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#11b981", // Din gröna färg
      cancelButtonColor: "#ef4444", // Röd
      confirmButtonText: "Ja, ta bort!",
      cancelButtonText: "Avbryt",
      background: "#fff",
      borderRadius: "15px",
    });

    if (result.isConfirmed) {
      try {
        await workoutSessionApi.delete(sessionId);
        await fetchSessions();

        // En liten "success" toast efteråt
        Swal.fire({
          title: "Raderad!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Fel!", "Kunde inte radera passet: " + { error });
      }
    }
  };
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
          <TemplateDropdown folders={folders || []} templates={templates || []} />

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
                <div
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

                  // --- NYTT: HÄR LÄGGER VI TILL DRAG & DROP LYSSNARE PÅ CELLEN ---
                  onDragOver={(e) => {
                    e.preventDefault(); // Krävs för att tillåta "drop" i webbläsaren
                    e.currentTarget.classList.add("drag-over"); // Tips: Stylar cellen vid hovring
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
                        }`}
                        onClick={(e) => {
                          e.stopPropagation(); // Hindrar klick även på loggade pass
                        }}
                      >
                        <div
                          className={
                            s.isLogged
                              ? "session-cell-header logged"
                              : "session-cell-header planned"
                          }
                        >
                          <strong>{getActivityName(s.activityId)}</strong>
                          <div className="sm-edit-btns-container">
                            <button
                              className={
                                s.isLogged
                                  ? "sm-edit-btn logged"
                                  : "sm-edit-btn planned"
                              }
                              title="Redigera"
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
                              onClick={(e) => {
                                handleDeleteSession(e, s.id);
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
                                className="lucide lucide-trash2"
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
                        <div className="session-cell-card-content">
                          <span>{getTotalTime(s)}min</span>
                        </div>

                        <div>
                          <button
                            className={`session-cell-log-btn ${
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
                            {!s.isLogged ? "Logga" : ""}
                          </button>
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
