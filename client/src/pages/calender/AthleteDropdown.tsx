import { userApi } from "../../api/userApi"
import { useEffect, useState } from "react";
import "./AthleteDropdown.css";
import type { UserType } from "../../types/UserType";

interface AthleteDropdownProps {
    athleteId: number;
    onAthleteChange?: (athleteId: number) => void; // Valfri callback för när en atlet väljs
}

export default function AthleteDropdown({ athleteId, onAthleteChange }: AthleteDropdownProps ) {
    
    const coachId = 1; // Ersätt med dynamiskt coachId vid implementering
    const [athletes, setAthletes] = useState<UserType[]>([]);
    const [selectedAthleteId, setSelectedAthleteId] = useState<number>(athleteId);

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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAthleteId = parseInt(e.target.value);
        setSelectedAthleteId(newAthleteId);
        onAthleteChange?.(newAthleteId); // Anropa callbacken om den finns
    };

    return (
        <div 
        className="btn btn-primary"
        id="athlete-dropdown"
        style={{ position: "relative", marginLeft: "auto" }}>
            <select
            value={selectedAthleteId}
            onChange={handleChange}
            style={{ 
                display: "flex", 
                alignItems: "center",
                gap: "6px", 
                backgroundColor: "transparent", 
                height: "22px",
                border: "none", 
                color: "#fff", 
                fontSize: "16px",
                cursor: "pointer" }}>
                <option value="0"
                className="athlete-option"
                >Atleter</option>
                {athletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id} 
                    className="athlete-option"
                    >
                        {athlete.name}
                    </option>
                ))}
            </select>
        </div>
    );
}