import { useState, useRef, useEffect } from "react";
import { folderApi } from "../../api/folderApi";
import type { FolderType } from "../../types/FolderType";

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreate: (newFolder: FolderType) => void;
}

function NewFolderDialog({ isOpen, onClose, onFolderCreate }: NewFolderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#000000"); // Standardfärg (svart)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kontrollera om dialogen ska vara öppen eller stängd via props
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsSubmitting(true);
    try {
      // Skicka med userId (1 i ditt demo) och den valda färgen
      // 1. Skapa en temporär typ för att skicka data utan ID
        // Vi plockar bort 'id' från FolderType
    const newFolderData: Omit<FolderType, "id"> = {
      name: folderName,
      color: folderColor,
      userId: 1, // Ditt hårdkodade demo-id
    };

      const response = await folderApi.create(newFolderData);

      onFolderCreate(response); // Skicka upp den nya mappen till Templates.tsx
      setFolderName(""); // Nollställ formuläret
      onClose(); // Stäng dialogen
    } catch (error) {
      console.error("Kunde inte skapa mappen:", error);
      alert("Något gick fel när mappen skulle skapas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog 
      ref={dialogRef} 
      onClose={onClose}
      className="folder-dialog" // Lägg till styling i din CSS för denna klass
      style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", minWidth: "250px" }}>
        <h2>Skapa ny mapp</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label htmlFor="folderName">Mappnamn</label>
          <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="T.ex. Benpass, Cardio..."
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label htmlFor="folderColor">Välj färg på mappen</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              id="folderColor"
              type="color"
              value={folderColor}
              onChange={(e) => setFolderColor(e.target.value)}
              disabled={isSubmitting}
              style={{ width: "40px", height: "40px", padding: "0", border: "none", cursor: "pointer" }}
            />
            {/* En liten förhandsvisning av hur ikonen kommer se ut */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke={folderColor} // Använder den valda färgen dynamiskt
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Avbryt
          </button>
          <button type="submit" disabled={isSubmitting || !folderName.trim()}>
            {isSubmitting ? "Skapar..." : "Skapa mapp"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default NewFolderDialog;