import "./navigation.css";
import { NavLink, useNavigate } from "react-router-dom";
// Importera sportiga och passande ikoner
import { Calendar, BarChart3, FolderHeart, Zap, User, Contact } from "lucide-react";

export default function NavigationMenu({ isCoachMode }: { isCoachMode: boolean }) {
  const navigate = useNavigate();
  return (
    <nav className="navigation-bar">
      <div
        className="nav-brand-container"
        onClick={() => navigate("/calendar")}
        style={{ cursor: "pointer" }}
      >
        <div className="nav-brand-logo"></div>
        <div className="nav-brand">SkiPlan</div>
      </div>

      <div className="nav-items">
        <NavLink
          to="/athletes"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
          style={{ display: isCoachMode ? "flex" : "none" }}
          id="athletes-nav-link"
        >
          <Contact className="nav-icon" size={20} />
          <span>
          Atleter
          </span>
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          <Calendar className="nav-icon" size={20} />
          <span>Kalender</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          <BarChart3 className="nav-icon" size={20} />
          <span>Statistik</span>
        </NavLink>

        <NavLink
          to="/templates"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          <FolderHeart className="nav-icon" size={20} />
          <span>Mallar</span>
        </NavLink>

        <NavLink
          to="/integrations"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          <Zap className="nav-icon" size={20} />
          <span>Integrationer</span>
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          <User className="nav-icon" size={20} />
          <span>Konto</span>
        </NavLink>
      </div>

      <div className="nav-footer">
        <p>Elit Skier Log</p>
        <span>v1.2.0</span>
      </div>
    </nav>
  );
}
