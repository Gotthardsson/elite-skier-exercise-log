import React from 'react';
import "./templates.css"

    function NewTemplate(){

        return(<>
            <div className="new-template-container">
                <h3 className="title">New Template</h3>
                <div className="template-name-folder">
                <label className="name-label">
                    Mallnamn: <input type="text" name="templateNameInput"/>
                </label>
                <label className="folder-label" htmlFor='folderSelect'>
                    Välj mapp: </label>
                    <select name="folderSelect" id='folderSelect'>
                        <option value="default">Välj mapp</option>
                        <option value="folder1">Mapp 1</option>
                        <option value="folder2">Mapp 2</option>
                        <option value="folder3">Mapp 3</option>
                    </select>
                
                </div>
                <label className="sport-label" htmlFor='sportSelect'>
                    Välj sport: </label>
                    <select name="sportSelect" id='sportSelect'>
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
                    Beskrivning: </label> 
                    <textarea name="descriptionInput" id="descriptionInput" cols={30} rows={10}></textarea>
                

                <label htmlFor="zoneInput" className="zone-label">
                    Minuter per pulszon: </label>
                    <div className="zone-inputs">
                        <label className="zone-input-label" htmlFor="a1Input">
                            A1: </label><input type="number" name="a1Input"/>
                        
                        <label className="zone-input-label" htmlFor="a2Input">
                            A2: </label><input type="number" name="a2Input"/>
                        
                        <label className="zone-input-label" htmlFor="a3-Input">
                            A3-: </label> <input type="number" name="a3-Input"/>
                        
                        <label className="zone-input-label" htmlFor="a3Input">
                            A3: </label><input type="number" name="a3Input"/>
                        
                        <label className="zone-input-label" htmlFor="a3+Input">
                            A3+: </label><input type="number" name="a3+Input"/>
                        
                        <label className="zone-input-label" htmlFor="compInput">
                            Comp: </label><input type="number" name="compInput"/>
                        
                        
                    </div>   
               
                <label htmlFor="intervalCheckbox" className="interval-label">
                         Intervallpass:  </label>
                         <input type="checkbox" name="intervalCheckbox"/>
               
                <div className="new-template-buttons">
                    <button className="btn btn-primary">Skapa mall</button>
                    <button className="btn btn-secondary">Avbryt</button>
                </div>
            </div>

        </>);
    };

    export default NewTemplate