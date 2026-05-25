import "./templates.css";
import type { FolderType } from "../../types/FolderType";

interface FolderProps {
  folder: FolderType;
  isActive: boolean;
  onClick: () => void;
}

function Folder({ folder, isActive, onClick }: FolderProps) {
  return (
    <div 
      className={`folder-card ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }} // Gör det tydligt att den går att klicka på
    >
      <h4 className="folder-name">{folder.name}</h4>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke={folder.color || "#000000"} // Använd folderns färg eller en standardfärg
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icons-in-text"
      >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
      </svg>
    </div>
  );
}

export default Folder;