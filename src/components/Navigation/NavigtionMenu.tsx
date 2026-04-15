import "./navigation.css";
import { NavLink } from "react-router-dom";

export default function NavigationMenu() {
  return (
    <nav className="navigation-bar">
      <div className="nav-items">
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          Kalender
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          Statistik
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive ? "nav-item selected" : "nav-item"
          }
        >
          Konto
        </NavLink>
      </div>

      <div>&copy; Elit skier training log</div>
    </nav>
  );
}
