import "./App.css";
import Calender from "./pages/calender/Calender";
import Stats from "./pages/stats/Stats";
import Templates from "./pages/templates/Templates";
import NavigationMenu from "./components/Navigation/NavigtionMenu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./pages/account/Account";
import { useState, useEffect } from "react";
import { getActivities } from "./api/activityApi";

//https://www.w3schools.com/react/react_router.asp

function App() {
  const [activities, setActivities] = useState([]); // En tom låda för sporter

  // Så fort appen startar, hämta sporterna
  useEffect(() => {
    getActivities().then((data) => setActivities(data));
  }, []);
  return (
    <BrowserRouter>
      <div className="app-layout">
        <NavigationMenu />

        <main>
          <Routes>
            <Route path="/" element={<Calender activities={activities} />} />
            <Route
              path="/calendar"
              element={<Calender activities={activities} />}
            />
            <Route path="/stats" element={<Stats activities={activities} />} />
            <Route
              path="/templates"
              element={<Templates activities={activities} />}
            />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
