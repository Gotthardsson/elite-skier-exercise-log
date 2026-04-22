import type { Template } from "../../types/TemplateType";
import "./templates.css";
function TemplateCard({ template }: { template: Template }) {
  const title = template.name;
  const sport = template.sport;
  const comment = template.description;
  const heartRateZone = template.zones;
  const totalTime = Object.values(heartRateZone).reduce((acc, time) => acc + time, 0);
  const length = totalTime > 0 ? totalTime : "0";
  console.log(length);
  return (
    <div className="template-card">
      <div className="card-title-container">
        <h4 className="card-title">{title}</h4>
        <div className="icons-container">
          <button className="icon-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-pen"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
            </svg>
          </button>
          <button className="icon-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-copy"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          </button>
          <button className="icon-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-trash2"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
      <p className="card-sport">
        {sport} - {length} min
      </p>
      <p className="card-comment">{comment}</p>
      <div className="card-zone-container">
        <div className="card-zone-texts-container">
        {Object.entries(heartRateZone).map(([zone, value]) => ( value > 0 ? (
          <p key={zone} className="card-zone-text" style={{ backgroundColor: `var(--clr-${zone.toLowerCase()})` }}>
            {zone.toUpperCase()}: {value} m
          </p>
        ) : null ))}</div>
        <div className="card-zone-line-container">
        {Object.entries(heartRateZone).map(([zone, value]) => ( value > 0 ? (
          <div key={zone} className="card-zone-line" style={{ backgroundColor: `var(--clr-${zone.toLowerCase()})`, width: `${(value / totalTime) * 100}%` }}></div>
        ) : null ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
