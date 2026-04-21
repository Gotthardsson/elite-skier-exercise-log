import "./App.css";
import Calender from "./pages/calender/Calender";
import Stats from "./pages/stats/Stats";
import Templates from "./pages/templates/Templates";
import NavigationMenu from "./components/Navigation/NavigtionMenu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./pages/account/Account";

//https://www.w3schools.com/react/react_router.asp

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <NavigationMenu />

        <main>
          <Routes>
            <Route path="/" element={<Calender />} />
            <Route path="/calendar" element={<Calender />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
