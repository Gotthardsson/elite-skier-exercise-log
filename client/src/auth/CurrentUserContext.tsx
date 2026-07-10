import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { userApi, type CurrentUser } from "../api/userApi";

const CurrentUserContext = createContext<CurrentUser | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userApi
      .getMe()
      .then((response) => setCurrentUser(response.data))
      .catch((err) => {
        console.error("Kunde inte hämta /api/user/me:", err);
        setError(
          err?.response
            ? `Servern svarade ${err.response.status}: ${JSON.stringify(err.response.data)}`
            : err?.message ?? "Okänt fel"
        );
      });
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#b91c1c" }}>
        <h3>Kunde inte läsa in din profil</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Läser in din profil...</h3>
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUser {
  const currentUser = useContext(CurrentUserContext);
  if (!currentUser) {
    throw new Error("useCurrentUser måste användas inom en CurrentUserProvider.");
  }
  return currentUser;
}
