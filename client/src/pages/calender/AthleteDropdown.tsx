// AthleteDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { userApi } from "../../api/userApi";
import type { UserType } from "../../types/UserType";
import ButtonPrimary from "../../components/ButtonPrimary.tsx";

interface AthleteDropdownProps {
  athleteId: number;
  onAthleteChange?: (athleteId: number) => void;
}

export default function AthleteDropdown({ athleteId, onAthleteChange }: AthleteDropdownProps) {
  const coachId = 1; // Ersätt med dynamiskt coachId vid implementering
  const [athletes, setAthletes] = useState<UserType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hitta namnet på den aktiva atleten för att visa på knappen
  const selectedAthlete = athletes.find((a) => a.id === athleteId);
  const buttonText = selectedAthlete ? selectedAthlete.name : "Välj atlet";

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await userApi.getUsersByCoachId(coachId);
        setAthletes(response.data);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      }
    };
    fetchAthletes();
  }, []);

  // Stäng menyn vid klick utanför
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAthlete = (id: number) => {
    onAthleteChange?.(id);
    setIsOpen(false); // Stäng dropdownen efter val
  };

  return (
    <div ref={dropdownRef} className="athlete-dropdown-wrapper" style={{ position: "relative", marginLeft: "auto" }}>
      
      {/* Knappen som öppnar dropdownen */}
      <ButtonPrimary 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: "flex", alignItems: "center", gap: "6px" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        {buttonText} ▾
      </ButtonPrimary>

      {/* Själva dropdown-menyn (Exakt samma styling-struktur som TemplateDropdown) */}
      {isOpen && (
        <div className="athlete-dropdown-menu" style={{
          position: "absolute",
          top: "110%",
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: "200px",
          maxHeight: "300px",
          overflowY: "auto",
          zIndex: 999,
          padding: "6px"
        }}>
          <div style={{ padding: "4px 8px", fontWeight: "bold", borderBottom: "1px solid #eee", marginBottom: "6px", fontSize: "12px", color: "#666" }}>
            Mina Atleter:
          </div>

          {athletes.length === 0 ? (
            <div style={{ padding: "8px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              Inga atleter hittades
            </div>
          ) : (
            athletes.map((athlete) => {
              const isCurrent = athlete.id === athleteId;
              
              return (
                <div
                  key={athlete.id}
                  onClick={() => handleSelectAthlete(athlete.id)}
                  style={{
                    padding: "8px 10px",
                    margin: "2px 0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: isCurrent ? "#3b82f6" : "#333",
                    backgroundColor: isCurrent ? "#f0f6ff" : "transparent",
                    fontWeight: isCurrent ? "bold" : "normal",
                    transition: "background-color 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                  // Enkel hover-effekt via JS inline (valfritt, men trevligt)
                  onMouseEnter={(e) => !isCurrent && (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseLeave={(e) => !isCurrent && (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span>{athlete.name}</span>
                  {isCurrent && (
                    <span style={{ fontSize: "12px", color: "#3b82f6" }}>✓</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}