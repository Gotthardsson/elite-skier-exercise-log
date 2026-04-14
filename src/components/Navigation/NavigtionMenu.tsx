import "./navigation.css";
export default function NavigationMenu() {
  return (
    <>
      <nav className="navigation-bar">
        <div className="nav-items">
          <a className="nav-item selected">Kalender</a>
          <a className="nav-item">Statistik</a>
          <a className="nav-item">Konto</a>
        </div>
        <div>&copy; Elit skier training log</div>
      </nav>
    </>
  );
}
