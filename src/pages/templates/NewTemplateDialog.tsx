import React from "react";
import "./templates.css";

function NewTemplate() {

    function closeDialog(){
        const dialog = document.querySelector(".new-template-container") as HTMLDivElement;
        dialog.style.display = "none";
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
          <input type="text" name="templateNameInput" />
          </div>
          <div className="template-folder">
          <label className="folder-label" htmlFor="folderSelect">
            Välj mapp:{" "}
          </label>
          <select className="select" name="folderSelect" id="folderSelect">
            <option value="default">Välj mapp</option>
            <option value="folder1">Mapp 1</option>
            <option value="folder2">Mapp 2</option>
            <option value="folder3">Mapp 3</option>
          </select>
          </div>
        </div>
        
        <label className="sport-label" htmlFor="sportSelect">
          Välj sport:{" "}
        </label>
        <select className="select" name="sportSelect" id="sportSelect">
          <option value="default">Välj sport</option>
          <option value="classic">Klassikt</option>
          <option value="skate">Skate</option>
          <option value="rollerski-classic">Rullskidor klassikt</option>
          <option value="rollerski-skate">Rullskidor skate</option>
          <option value="cycling">Cykling</option>
          <option value="running">Löpning</option>
          <option value="swimming">Simning</option>
          <option value="strength">Styrka</option>
        </select>
        
        <label htmlFor="descriptionInput" className="description-label">
          Beskrivning:{" "}
        </label>
        <textarea
          name="descriptionInput"
          id="descriptionInput"
          cols={30}
          rows={10}
        ></textarea>

        <label htmlFor="zoneInput" className="zone-label">
          Minuter per pulszon:{" "}
        </label>
        <div className="zone-inputs">
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a1Input" id="a1-label">
              A1{" "}
            </label>
            <input type="number" name="a1Input" />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a2Input" id="a2-label">
              A2{" "}
            </label>
            <input type="number" name="a2Input"/>
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a3minus-input" id="a3minus-label">
              A3-{" "}
            </label>{" "}
            <input type="number" name="a3-Input"  />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a3Input" id="a3minus-label">
              A3{" "}
            </label>
            <input type="number" name="a3Input"/>
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="a3+Input" id="a3plus-label">
              A3+{" "}
            </label>
            <input type="number" name="a3+Input" />
          </div>
          <div className="zone-container">
            <label className="zone-input-label" htmlFor="compInput" id="comp-label">
              Comp{" "}
            </label>
            <input type="number" name="compInput" />
          </div>
        </div>

        <label htmlFor="intervalCheckbox" className="interval-label">
          <input type="checkbox" name="intervalCheckbox" /> Intervallpass{" "}
        </label>
        

        <div className="new-template-buttons">
          <button className="btn btn-secondary" onClick={closeDialog}>
            Avbryt
          </button>
          <button className="btn btn-primary">Skapa mall</button>
          
        </div>
      </div>
    </>
  );
}

export default NewTemplate;
