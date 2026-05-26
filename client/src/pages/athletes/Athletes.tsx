import { userApi } from "../../api/userApi";
import { useEffect, useState } from "react";
import type { UserType } from "../../types/UserType";
import "./athletes.css";

export default function Athletes() {



const [athletes, setAthletes] = useState<UserType[]>([]);
const coachId = 1; // Exempel på coachId, du kan hämta detta från inloggningen eller kontext


useEffect(() => {

  const fetchAthletes = async () => {
    try {
      const response = await userApi.getUsersByCoachId(coachId); // Exempel på hur du kan anropa API:t
      setAthletes(response.data);
    } catch (error) {
      console.error("Error fetching athletes:", error);
    }
  };
    fetchAthletes();
  }, []);

  return (
    <div className="athletes-page">
      <h1>Athletes</h1>
      <p>Här kan du hantera dina idrottare.</p>
      <div className="athletes-list">
        {athletes.map((athlete) => (
          <div key={athlete.id} className="athlete-item">
            <h2>{athlete.name}</h2>
            <p>{athlete.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
