import { useState, useEffect } from "react";
import NewFolderDialog from "./NewFolderDialog.tsx";
import "./templates.css";
import TemplateCard from "./TemplateCard.tsx";
import NewTemplateDialog from "./NewTemplateDialog.tsx";
import EditTemplateDialog from "./EditTemplateDialog.tsx";
import { folderApi } from "../../api/folderApi.ts";
import { sessionTemplateApi } from "../../api/sessionTemplateApi.ts";
import type { TemplateType } from "../../types/TemplateType.ts";
import type { FolderType } from "../../types/FolderType.ts";
import Folder from "./Folder.tsx";
import ButtonPrimary from "../../components/ButtonPrimary.tsx";

function Templates(props) {
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateType | null>(
    null,
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await sessionTemplateApi.getByUserId(1); // Hårdkodad userId för demo
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await folderApi.getByUserId(1); // Hårdkodad userId för demo
        setFolders(response.data); // Assuming response.data contains the array of folders
        console.log("Fetched folders:", response.data); // Logga de hämtade mapparna
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
    // Log fetched folders directly from the response inside fetchFolders if needed
  }, []); // Kör endast en gång när komponenten mountas

  // NYTT: Beräkna filtrerade mallar baserat på vald mapp
  // Vi antar här att dina mallar har en property som heter 'folder_id' eller 'folderId'
  const filteredTemplates = selectedFolderId
    ? templates.filter((t) => t.folderId === selectedFolderId)
    : templates;


  const handleTemplateCreate = (newTemplate: TemplateType) => {
    setTemplates([...templates, newTemplate]);
  };
  const handleFolderCreate = (newFolder: FolderType) => {
    setFolders([...folders, newFolder]);
  };

  const handleTemplateUpdate = (updatedTemplate: TemplateType) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)),
    );
    setEditingTemplate(null);
  };

  const handleTemplateDelete = (deletedTemplate: TemplateType) => {
    setTemplates((prev) => prev.filter((t) => t.id !== deletedTemplate.id));
  };
  

  function openNewTemplateDialog() {
    setIsTemplateDialogOpen(true);
  }
  
  // Funktion för att toggla en mapp (klickar man på samma igen så nollställs filtret)
  const handleFolderClick = (folderId: number) => {
    setSelectedFolderId((prevId) => (prevId === folderId ? null : folderId));
  };

  return (
    <>
      <div className="header">
        <div>
          <h1 className="title">Mallar av träningssessioner</h1>
          <p className="subtitle">
            Här kan du skapa mallar av träningspass som du sedan kan dra direkt
            in i din kalender
          </p>
        </div>
        <div className="new-buttons">
          <ButtonPrimary className="new-template-button" onClick={openNewTemplateDialog}>
             Ny Träningsmall
          </ButtonPrimary>
          <ButtonPrimary className="new-folder-button" onClick={() => setIsFolderDialogOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icons-in-text"
            >
              <path d="M12 10v6"></path>
              <path d="M9 13h6"></path>
              <path
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 
                        1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
              ></path>
            </svg>
            Ny Mapp
          </ButtonPrimary>
        </div>
      </div>
      <h3>Mappar</h3>
      <div className="folders-container">
        <p className="no-folders">Inga mappar skapade</p>
        {folders.map((folder) => (
          <Folder
            key={folder.id}
            folder={folder}
            isActive={selectedFolderId === folder.id}
            onClick={() => handleFolderClick(folder.id)}
            style={{
          // color-mix tar din färg, behåller 20% av den och blandar resten med transparent (80% opacity)
          backgroundColor: selectedFolderId === folder.id 
            ? `color-mix(in srgb, ${folder.color} 20%, transparent)` 
            : "transparent",
          
          // Vi sätter texten till mappens skarpa originalfärg så den syns tydligt mot den bleka bakgrunden
          color: selectedFolderId === folder.id ? "#000000" : "inherit",
          
          // Vi gör ramen lite softare men i samma färg
          borderColor: selectedFolderId === folder.id ? folder.color : "#ccc",
          fontWeight: selectedFolderId === folder.id ? "bold" : "normal"
        }}
          />
        ))}
      </div>
      <h3>Träningsmallar</h3>
      <div className="templates-container">
        {isLoading ? (
          <p>Laddar mallar...</p>
        ) : templates.length === 0 ? (
          <p>Inga mallar skapade</p>
        ) : null}
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onTemplateUpdate={handleTemplateUpdate}
            setEditingTemplate={setEditingTemplate}
            onTemplateDelete={handleTemplateDelete}
          />
        ))}
      </div>
      <NewFolderDialog 
        isOpen={isFolderDialogOpen}
        onClose={() => setIsFolderDialogOpen(false)}
        onFolderCreate={handleFolderCreate}
      />
      {/* NY TRÄNINGSMALL-MODAL MED OVERLAY */}
      {isTemplateDialogOpen && (
        <div className="modal-overlay" onClick={() => setIsTemplateDialogOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NewTemplateDialog
              onTemplateCreate={(newTemplate) => {
                handleTemplateCreate(newTemplate);
                setIsTemplateDialogOpen(false); // Stäng efter lyckad skapelse
              }}
              folders={folders}
              activities={props.activities}
              onClose={() => setIsTemplateDialogOpen(false)} // Om du har en avbryt-knapp där i
            />
          </div>
        </div>
      )}

      {/* REDIGERA MALL-MODAL MED OVERLAY */}
      {editingTemplate && (
        <div className="modal-overlay" onClick={() => setEditingTemplate(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <EditTemplateDialog
              onTemplateUpdate={handleTemplateUpdate}
              activities={props.activities}
              folders={folders}
              template={editingTemplate}
              onClose={() => setEditingTemplate(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Templates;