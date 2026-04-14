import "./App.css";
import Calender from "./components/Calender/Calender";
import NavigationMenu from "./components/Navigation/NavigtionMenu";

function App() {
  return (
    <div className="app-layout">
      <NavigationMenu />
      <main>
        <Calender />
      </main>
    </div>
  );
}

export default App;
