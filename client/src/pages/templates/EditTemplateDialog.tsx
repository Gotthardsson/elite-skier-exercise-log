import {useState, useEffect} from "react";
import "./templates.css";
import type { TemplateType } from "../../types/TemplateType";
import { sessionTemplateApi } from "../../api/sessionTemplateApi";
import type { Activity } from "../../types/Activity";

interface EditTemplateDialogProps {
  template: TemplateType;
  onTemplateUpdate: (updatedTemplate: TemplateType) => void;
  activities: Activity[];
}

function EditTemplateDialog({
  template,
  onTemplateUpdate,
  activities,
}: EditTemplateDialogProps) {
    const [templateName, setTemplateName] = useState(template.title);
    const [folderId, setFolderId] = useState(template.folderId || 0);
    const [sportId, setSportId] = useState(template.activityId);
    const [description, setDescription] = useState(template.description);
    const [a1, setA1] = useState(template.plannedZones.a1);
    const [a2, setA2] = useState(template.plannedZones.a2);
    const [a3Minus, setA3Minus] = useState(template.plannedZones.a3Minus);
    const [a3, setA3] = useState(template.plannedZones.a3);
    const [a3Plus, setA3Plus] = useState(template.plannedZones.a3Plus);
    const [comp, setComp] = useState(template.plannedZones.comp);
    const [isInterval, setIsInterval] = useState(template.isInterval);

    function closeDialog() {
        const dialog = document.querySelector(".edit-template-dialog") as HTMLDivElement;
        if (dialog) {
            dialog.style.display = "none";
        }
    }
    function updateTemplate() {
        const updatedTemplate: TemplateType = {
            ...template,
            title: templateName,
            folderId: folderId,
            activityId: sportId,
            description: description,
            plannedZones: {
                a1: a1,
                a2: a2,
                a3Minus: a3Minus,
                a3: a3,
                a3Plus: a3Plus,
                comp: comp
            },
            isInterval: isInterval
        };
        sessionTemplateApi.update(updatedTemplate)
        onTemplateUpdate(updatedTemplate);
        closeDialog();
    }

    return (
    <>
      <div className="edit-template-container">
        <h3 className="edit-template-title">Uppdatera Mall</h3>
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
              onChange={(e) => setA1(e.target.valueAsNumber||0)}
              
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
              onChange={(e) => setA2(e.target.valueAsNumber||0)}
              
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
              onChange={(e) => setA3Minus(e.target.valueAsNumber||0)}
              
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
              onChange={(e) => setA3(e.target.valueAsNumber||0)}
              
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
              onChange={(e) => setA3Plus(e.target.valueAsNumber||0)}
             
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
              onChange={(e) => setComp(e.target.valueAsNumber||0)}
              
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
          <button className="btn btn-primary" onClick={updateTemplate}>
            Uppdatera mall
          </button>
        </div>
      </div>
    </>
  );
};

export default EditTemplateDialog;