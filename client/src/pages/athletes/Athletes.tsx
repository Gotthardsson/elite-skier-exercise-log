import { userApi } from "../../api/userApi";
import { useEffect, useState } from "react";
import type { UserType } from "../../types/UserType";
import { useCurrentUser } from "../../auth/CurrentUserContext";
import "./athletes.css";

export default function Athletes() {
  const currentUser = useCurrentUser();
  const [athletes, setAthletes] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await userApi.getUsersByCoachId(currentUser.id);
        setAthletes(response.data);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      }
    };
    fetchAthletes();
  }, [currentUser.id]);

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
