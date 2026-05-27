import React from "react";
import "./templates.css";
import type { TemplateType } from "../../types/TemplateType";
import { sessionTemplateApi } from "../../api/sessionTemplateApi";
import type { Activity } from "../../types/Activity";
import type { FolderType } from "../../types/FolderType";
import ButtonPrimary from "../../components/ButtonPrimary";

interface NewTemplateDialogProps {
  onTemplateCreate: (template: TemplateType) => void;
  onClose: () => void; // NYTT: Ta emot stängnings-funktionen härifrån
  activities: Activity[];
  folders: FolderType[];
}

function NewTemplateDialog({
  onTemplateCreate,
  onClose, // NYTT: Packa upp onClose
  activities,
  folders,
}: NewTemplateDialogProps) {
  
  const [templateName, setTemplateName] = React.useState("");
  const [folderId, setFolderId] = React.useState(0);
  const [sportId, setSportId] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const [a1, setA1] = React.useState(0);
  const [a2, setA2] = React.useState(0);
  const [a3Minus, setA3Minus] = React.useState(0);
  const [a3, setA3] = React.useState(0);
  const [a3Plus, setA3Plus] = React.useState(0);
  const [comp, setComp] = React.useState(0);
  const [isInterval, setIsInterval] = React.useState(false);

  async function createTemplate() {
    // Skapa objektet så det matchar C# (platt struktur)
    const newTemplateData: Omit<TemplateType, "id"> = {
      title: templateName,
      folderId: folderId === 0 ? null : folderId, 
      activityId: sportId,
      description: description,
      creatorId: 1, 
      plannedZones: {
        a1: a1 || 0,
        a2: a2 || 0,
        a3Minus: a3Minus || 0,
        a3: a3 || 0,
        a3Plus: a3Plus || 0,
        comp: comp || 0,
      },
      isInterval: isInterval, 
    };

    try {
      const response = await sessionTemplateApi.create(newTemplateData);
      const createdTemplate = response.data;

      onTemplateCreate(createdTemplate || newTemplateData); 
      resetForm();
      // onClose() körs automatiskt i föräldern nu via onTemplateCreate, 
      // men ifall du vill köra den manuellt så ligger den här.
    } catch (error) {
      console.log("Kunde inte spara: " + error);
    }
  }

  function resetForm() {
    setTemplateName("");
    setFolderId(0);
    setSportId(0);
    setDescription("");
    setA1(0);
    setA2(0);
    setA3Minus(0);
    setA3(0);
    setA3Plus(0);
    setComp(0);
    setIsInterval(false);
  }

  return (
    <>
      {/* ÄNDRING: Vi tog bort .modal-overlay-divarna härifrån helt eftersom 
        de ligger i Templates.tsx nu. Kvar är bara själva container-rutan.
      */}
      <div className="new-template-container">
        <h3 className="new-template-title">Ny Mall</h3>
        
        <div className="template-name-folder">
          <div className="template-name">
            <label className="name-label" htmlFor="templateNameInput">
              Mallnamn:
            </label>
            <input
              type="text"
              name="templateNameInput"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className="template-folder">
            <label className="folder-label" htmlFor="folderSelect">
              Välj mapp:{" "}
            </label>
            <select
              className="select"
              name="folderSelect"
              id="folderSelect"
              value={folderId}
              onChange={(e) => setFolderId(Number(e.target.value))}
            >
              <option value="0">Ingen mapp</option> {/* Bra default-fall */}
              {folders?.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="sport-label" htmlFor="sportSelect">
          Välj sport:{" "}
        </label>
        <select
          className="select"
          name="sportSelect"
          id="sportSelect"
          value={sportId}
          onChange={(e) => setSportId(Number(e.target.value))}
        >
          <option value="0">Välj aktivitet</option>
          {activities?.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>

        <label htmlFor="descriptionInput" className="description-label">
          Beskrivning:{" "}
        </label>
        <textarea
          name="descriptionInput"
          id="descriptionInput"
          cols={30}
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="zones-label">Minuter per pulszon: </div>
        <div className="zone-inputs">
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a1Input" id="a1-label">
              A1
            </label>
            <input
              type="number"
              name="a1Input"
              value={a1 === 0 ? "" : a1} // Visa tomt fält istället för 0
              placeholder="0"
              onChange={(e) => setA1(e.target.valueAsNumber || 0)}
            />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a2Input" id="a2-label">
              A2
            </label>
            <input
              type="number"
              name="a2Input"
              value={a2 === 0 ? "" : a2} // Visa tomt fält istället för 0
              placeholder="0"
              onChange={(e) => setA2(e.target.valueAsNumber || 0)}
            />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a3minus-input" id="a3minus-label">
              A3-
            </label>
            <input
              type="number"
              name="a3minus-input"
              value={a3Minus === 0 ? "" : a3Minus} // Visa tomt fält istället för 0
              placeholder="0"
              onChange={(e) => setA3Minus(e.target.valueAsNumber || 0)}
            />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a3Input" id="a3minus-label">
              A3
            </label>
            <input
              type="number"
              name="a3Input"
              value={a3 === 0 ? "" : a3} // Visa tomt fält istället för 0
              placeholder="0"
              onChange={(e) => setA3(e.target.valueAsNumber || 0)}
            />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a3+Input" id="a3plus-label">
              A3+
            </label>
            <input
              type="number"
              name="a3+Input"
              value={a3Plus === 0 ? "" : a3Plus} // Visa tomt fält istället för 0
              placeholder="0"
              onChange={(e) => setA3Plus(e.target.valueAsNumber || 0)}
            />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="compInput" id="comp-label">
              Comp
            </label>
            <input
              type="number"
              name="compInput"
              value={comp === 0 ? "" : comp} // Visa tomt fält istället för 0
              placeholder="0"
              onChange={(e) => setComp(e.target.valueAsNumber || 0)}
            />
          </div>
        </div>

        <div className="new-template-buttons">
          {/* ÄNDRING: Använder props.onClose istället för closeDialog() */}
          <ButtonPrimary className="btn btn-secondary" onClick={onClose}>
            Avbryt
          </ButtonPrimary>
          <ButtonPrimary className="btn btn-primary" onClick={createTemplate}>
            Skapa mall
          </ButtonPrimary>
        </div>
      </div>
    </>
  );
}

export default NewTemplateDialog;