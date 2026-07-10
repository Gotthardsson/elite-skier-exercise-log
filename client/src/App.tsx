import "./App.css";
import Calender from "./pages/calender/Calender";
import Stats from "./pages/stats/Stats";
import Templates from "./pages/templates/Templates";
import NavigationMenu from "./components/Navigation/NavigtionMenu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./pages/account/Account";
import { useState, useEffect } from "react";
import { getActivities } from "./api/activityApi";
import type { Activity } from "./types/Activity";
import Integrations from "./pages/integrations/Integrations";
import StravaCallback from "./pages/integrations/StravaCallback";
import Athletes from "./pages/athletes/Athletes";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "./auth/authConfig";
import { CurrentUserProvider, useCurrentUser } from "./auth/CurrentUserContext";
import ButtonPrimary from "./components/ButtonPrimary";


//https://www.w3schools.com/react/react_router.asp

function LoginPage() {
  const { instance } = useMsal();
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>SkiPlan</h2>
      <p>Logga in för att fortsätta.</p>
      <ButtonPrimary
        onClick={() => instance.loginRedirect(loginRequest)}
        text="Logga in"
      />
    </div>
  );
}

function AppRoutes() {
  const [activities, setActivities] = useState<Activity[]>([]); // En tom låda för sporter
  const currentUser = useCurrentUser();
  const [isCoachMode, setIsCoachMode] = useState<boolean>(
    currentUser.role === "coach"
  );

  // Så fort appen startar, hämta sporterna
  useEffect(() => {
    getActivities().then((data) => setActivities(data));
  }, []);
  return (
    <BrowserRouter>
      <div className="app-layout">
        <NavigationMenu isCoachMode={isCoachMode} />

        <main>
          <Routes>
            <Route path="/" element={<Calender activities={activities} isCoachMode={isCoachMode} setIsCoachMode={setIsCoachMode} />} />
            <Route
              path="/calendar"
              element={<Calender activities={activities} isCoachMode={isCoachMode} setIsCoachMode={setIsCoachMode} />}
            />
            <Route path="/stats" element={<Stats activities={activities} />} />
            <Route
              path="/templates"
              element={<Templates activities={activities} />}
            />
            <Route path="/athletes" element={<Athletes />} />
            <Route path="/account" element={<Account />} />

            <Route path="/integrations" element={<Integrations />} />

            <Route path="/strava-callback" element={<StravaCallback />} />

          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <>
      <AuthenticatedTemplate>
        <CurrentUserProvider>
          <AppRoutes />
        </CurrentUserProvider>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
    </>
  );
}

export default App;
