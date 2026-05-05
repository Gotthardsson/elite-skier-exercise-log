import React from "react";
import "./templates.css";
import type { TemplateType } from "../../types/TemplateType";
import { sessionTemplateApi } from "../../api/sessionTemplateApi";
import type { Activity } from "../../types/Activity";



interface NewTemplateDialogProps {
  onTemplateCreate: (template: TemplateType) => void;
  activities: Activity[];
}
const oldTemplates: TemplateType[] = await sessionTemplateApi.getByUserId(1); 
const amountOfTemplates = oldTemplates.length; // Hämta antal mallar för att generera unikt ID, byt ut mot bättre lösning när du har backend på plats

function NewTemplateDialog({
  onTemplateCreate,
  activities,
}: NewTemplateDialogProps) {
  function closeDialog() {
    const dialog = document.querySelector(
      ".new-template-container"
    ) as HTMLDivElement;
    dialog.style.display = "none";
  }
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
    const newTemplateData = {
      id: Number(amountOfTemplates + 1), // Generera ett unikt ID för mallen
      title: templateName,
      folderId: folderId === 0 ? null : folderId, // Om ingen mapp är vald, sätt folderId till null
      activityId: sportId,
      description: description,
      creatorId:1, // Hårdkodad för nu, byt ut mot riktig userId när du har auth på plats
      zones: {
        a1,
        a2,
        a3Minus,
        a3,
        a3Plus,
        comp
      },
      isInterval: isInterval, // Lägg till state för denna om du vill ha den dynamisk
    };

    try {
      
      sessionTemplateApi.create(newTemplateData);

      // Om allt gick bra (servicen kastar error om det skiter sig)
      onTemplateCreate(newTemplateData); // Uppdatera parent-komponenten
      closeDialog();
      resetForm();
    } catch (error) {
      alert("Kunde inte spara: " + error);
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
  }

  return (
    <>
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
              <option value="0">Välj mapp</option>
              <option value="1">Mapp 1</option>
              <option value="2">Mapp 2</option>
              <option value="3">Mapp 3</option>
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

        <label htmlFor="zoneInput" className="zone-label">
          Minuter per pulszon:{" "}
        </label>
        <div className="zone-inputs">
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a1Input" id="a1-label">
              A1{" "}
            </label>
            <input
              type="number"
              name="a1Input"
              value={a1}
              onChange={(e) => setA1(e.target.valueAsNumber)}
            />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a2Input" id="a2-label">
              A2{" "}
            </label>
            <input
              type="number"
              name="a2Input"
              value={a2}
              onChange={(e) => setA2(e.target.valueAsNumber)}
            />
          </div>
          <div className="zone-container">
            <label
              className="zone-input-label"
              htmlFor="a3minus-input"
              id="a3minus-label"
            >
              A3-{" "}
            </label>{" "}
            <input
              type="number"
              name="a3-Input"
              value={a3Minus}
              onChange={(e) => setA3Minus(e.target.valueAsNumber)}
            />
          </div>
          <div className="zone-container">
            <label
              className="zone-input-label"
              htmlFor="a3Input"
              id="a3minus-label"
            >
              A3{" "}
            </label>
            <input
              type="number"
              name="a3Input"
              value={a3}
              onChange={(e) => setA3(e.target.valueAsNumber)}
            />
          </div>
          <div className="zone-container">
            <label
              className="zone-input-label"
              htmlFor="a3+Input"
              id="a3plus-label"
            >
              A3+{" "}
            </label>
            <input
              type="number"
              name="a3+Input"
              value={a3Plus}
              onChange={(e) => setA3Plus(e.target.valueAsNumber)}
            />
          </div>
          <div className="zone-container">
            <label
              className="zone-input-label"
              htmlFor="compInput"
              id="comp-label"
            >
              Comp{" "}
            </label>
            <input
              type="number"
              name="compInput"
              value={comp}
              onChange={(e) => setComp(e.target.valueAsNumber)}
            />
          </div>
        </div>

        <label htmlFor="intervalCheckbox" className="interval-label">
          <input
            type="checkbox"
            name="intervalCheckbox"
            onChange={(e) => {
              setIsInterval(e.target.checked);
            }}
          />{" "}
          Intervallpass{" "}
        </label>

        <div className="new-template-buttons">
          <button className="btn btn-secondary" onClick={closeDialog}>
            Avbryt
          </button>
          <button className="btn btn-primary" onClick={createTemplate}>
            Skapa mall
          </button>
        </div>
      </div>
    </>
  );
}

export default NewTemplateDialog;
