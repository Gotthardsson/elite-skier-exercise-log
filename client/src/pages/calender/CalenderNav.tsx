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

interface CalendarNavProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  userId: number;
  setUserId: (userId: number) => void;
}

export default function CalendarNav({
  currentDate,
  setCurrentDate,
  userId,
  setUserId
}: CalendarNavProps) {
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [templates, setTemplates] = useState<TemplateType[]>([]);

  const [isCoachMode, setIsCoachMode] = useState<boolean>(false);
   
  
  const handleUserIdChange = (newUserId: number) => {
    setUserId(newUserId);
  }

  const handleCoachModeToggle = () => {
  setIsCoachMode((prevMode) => {
    const nextMode = !prevMode;
    
    // Om nästa läge är falskt (vi stänger av tränarläget),
    // återställ userId till demonstrations-profilen (1)
    if (!nextMode) {
      setUserId(1);
    }
    
    return nextMode;
  });
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
  useEffect(() => {
    const fetchFoldersAndTemplates = async () => {
      try {
        const [foldersResponse, templatesResponse] = await Promise.all([
          folderApi.getByUserId(userId),
          sessionTemplateApi.getByUserId(userId)
        ]);
        setFolders(foldersResponse.data);
        setTemplates(templatesResponse.data);
      } catch (error) {
        console.error("Kunde inte hämta mappar eller mallar:", error);
      }
    };

    fetchFoldersAndTemplates();
  }, [userId]);

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
      <ButtonPrimary 
      className="coach-button"
      style={{ backgroundColor: isCoachMode ? "#007bff" : "#000000" }}
      onClick={handleCoachModeToggle}
      text="Tränarläge"
      ></ButtonPrimary>
      <div className="dropdowns-container"> 
        {isCoachMode && (
          <AthleteDropdown athleteId={userId} onAthleteChange={handleUserIdChange} />
        )}
        <TemplateDropdown folders={folders || []} templates={templates || []} />
      </div>
    </div>
  );
}
