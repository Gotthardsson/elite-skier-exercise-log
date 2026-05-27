import React, { useState, useRef, useEffect } from "react";
import { folderApi } from "../../api/folderApi";
import type { FolderType } from "../../types/FolderType";
import ButtonPrimary from "../../components/ButtonPrimary";
import "./templates.css"; // Se till att css-filen är importerad

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreate: (newFolder: FolderType) => void;
}

function NewFolderDialog({ isOpen, onClose, onFolderCreate }: NewFolderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#3b82f6"); // Standard till en trevlig blå istället för svart
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Funktion för att stänga om man klickar på det mörka utanför rutan
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsSubmitting(true);
    try {
      const newFolderData: Omit<FolderType, "id"> = {
        name: folderName,
        color: folderColor,
        userId: 1,
      };

      const response = await folderApi.create(newFolderData);

      onFolderCreate(response);
      setFolderName("");
      onClose();
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
      onClick={handleBackdropClick}
      className="folder-dialog"
    >
      <form onSubmit={handleSubmit} className="folder-form-content">
        <h3 className="new-template-title">Skapa ny mapp</h3>
        
        <div className="sm-field">
          <label htmlFor="folderName" className="sm-label">Mappnamn</label>
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

        <div className="sm-field">
          <label htmlFor="folderColor" className="sm-label">Välj färg på mappen</label>
          <div className="color-picker-row">
            <input
              id="folderColor"
              type="color"
              value={folderColor}
              onChange={(e) => setFolderColor(e.target.value)}
              disabled={isSubmitting}
              className="color-input-square"
            />
            
            {/* En förhandsvisning som matchar din app-stil */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke={folderColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
            </svg>
          </div>
        </div>

        <div className="new-template-buttons">
          <ButtonPrimary type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Avbryt
          </ButtonPrimary>
          <ButtonPrimary type="submit" className="btn btn-primary" disabled={isSubmitting || !folderName.trim()}>
            {isSubmitting ? "Skapar..." : "Skapa mapp"}
          </ButtonPrimary>
        </div>
      </form>
    </dialog>
  );
}

export default NewFolderDialog;