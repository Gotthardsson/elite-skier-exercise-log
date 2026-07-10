import "./calenderNav.css";
import ButtonPrimary from "../../components/ButtonPrimary";
import "../../components/button.css";
import TemplateDropdown from "./templatesInCalender/TemplateDropdown";
import type { TemplateType } from "../../types/TemplateType";
import type { FolderType } from "../../types/FolderType";
import { folderApi } from "../../api/folderApi";
import { sessionTemplateApi } from "../../api/sessionTemplateApi";
import { useEffect, useState } from "react";
import AthleteDropdown from "./AthleteDropdown";
import { useCurrentUser } from "../../auth/CurrentUserContext";


interface CalendarNavProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  userId: number;
  setUserId: (userId: number) => void;
  isCoachMode: boolean;
  setIsCoachMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CalendarNav({
  currentDate,
  setCurrentDate,
  userId,
  setUserId,
  isCoachMode,
  setIsCoachMode,
}: CalendarNavProps) {
  const currentUser = useCurrentUser();
  // --- HJÄLPFUNKTION: Räkna ut första måndagen i maj för ett givet år ---
  const getFirstMondayOfMay = (year: number): Date => {
    const date = new Date(year, 4, 1); // 1 maj
    while (date.getDay() !== 1) {
      // 1 = Måndag
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  // --- HJÄLPFUNKTION: Räkna ut Säsong, Period och Vecka baserat på currentDate ---
  const getSeasonPeriodWeek = (date: Date) => {
    let seasonYear = date.getFullYear();
    let startMonday = getFirstMondayOfMay(seasonYear);

    // Om dagens datum är INNAN första måndagen i maj, tillhör vi föregående säsong
    if (date < startMonday) {
      seasonYear -= 1;
      startMonday = getFirstMondayOfMay(seasonYear);
    }

    // Räkna ut differensen i millisekunder och konvertera till hela veckor
    const diffTime = date.getTime() - startMonday.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(diffDays / 7);

    // En period är 4 veckor. Förhindra negativa värden eller för höga värden (t.ex. vid nyår)
    const currentPeriod = Math.max(
      1,
      Math.min(13, Math.floor(totalWeeks / 4) + 1)
    );
    const currentWeek = Math.max(1, Math.min(4, (totalWeeks % 4) + 1));

    return { seasonYear, period: currentPeriod, week: currentWeek };
  };

  // Hämta de aktuella värdena baserat på currentDate
  const { seasonYear, period, week } = getSeasonPeriodWeek(currentDate);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [templates, setTemplates] = useState<TemplateType[]>([]);

  
   
  
  const handleUserIdChange = (newUserId: number) => {
    setUserId(newUserId);
  }
  
  const handleCoachModeToggle = () => {

    setIsCoachMode((prevMode) => {
    const nextMode = !prevMode;

    // Om nästa läge är falskt (vi stänger av tränarläget),
    // återställ userId till den inloggade användarens egna profil
    if (!nextMode) {
      setUserId(currentUser.id);
    }

    return nextMode;
  });
};

  const fetchFoldersAndTemplates = async () => {
    try {
      const [foldersResponse, templatesResponse] = await Promise.all([
        folderApi.getByUserId(currentUser.id),
        sessionTemplateApi.getByUserId(currentUser.id),
      ]);
      setFolders(foldersResponse.data);
      setTemplates(templatesResponse.data);
    } catch (error) {
      console.error("Kunde inte hämta mappar eller mallar:", error);
    }
  };

  const handleJump = (year: number, p: number, w: number) => {
    const date = getFirstMondayOfMay(year);
    const totalWeeksToAdd = (p - 1) * 4 + (w - 1);
    date.setDate(date.getDate() + totalWeeksToAdd * 7);
    setCurrentDate(date);
  };

  useEffect(() => {
    fetchFoldersAndTemplates();
  }, [currentUser.id]);
  return (
    <div className="calendar-nav-container">
      <div className="nav-group buttons">
        <ButtonPrimary onClick={() => changeDate(-7)} text="←" />
        <ButtonPrimary onClick={() => setCurrentDate(new Date())} text="Idag" />
        <ButtonPrimary onClick={() => changeDate(7)} text="→" />
      </div>

      <div className="nav-group selectors">
        {/* SäsongDropdown - bunden till seasonYear */}
        <select
          className="calendar-custom-select"
          value={seasonYear}
          onChange={(e) => handleJump(Number(e.target.value), period, week)}
        >
          <option value="2026">Säsong 26/27</option>
          <option value="2025">Säsong 25/26</option>
          <option value="2024">Säsong 24/25</option>
        </select>

        {/* PeriodDropdown - bunden till period */}
        <select
          className="calendar-custom-select"
          value={period}
          onChange={(e) => handleJump(seasonYear, Number(e.target.value), week)}
        >
          {[...Array(13)].map((_, i) => (
            <option key={i} value={i + 1}>
              Period {i + 1}
            </option>
          ))}
        </select>

        {/* VeckaDropdown - bunden till week */}
        <select
          className="calendar-custom-select"
          value={week}
          onChange={(e) =>
            handleJump(seasonYear, period, Number(e.target.value))
          }
        >
          {[1, 2, 3, 4].map((v) => (
            <option key={v} value={v}>
              Vecka {v}
            </option>
          ))}
        </select>
      </div>
      {currentUser.role === "coach" && (
        <ButtonPrimary
          className="coach-button"
          style={{ backgroundColor: isCoachMode ? "#007bff" : "#000000" }}
          onClick={handleCoachModeToggle}
          text="Tränarläge"
        ></ButtonPrimary>
      )}
      <div className="dropdowns-container">
        {isCoachMode && (
          <AthleteDropdown
            athleteId={userId}
            onAthleteChange={handleUserIdChange}
          />
        )}
        <TemplateDropdown folders={folders || []} templates={templates || []} />
      </div>
    </div>
  );
}
