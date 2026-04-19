import React, {useState} from 'react';
import "./templates.css"
import TemplateCard from './TemplateCard';
import NewTemplate from './NewTemplateDialog';

    function Templates(){

        return(<>
            <div className="header">
                <h1 className="title">Mallar av träningssessioner</h1> 
                <p className="subtitle">Här kan du skapa mallar av träningspass som du sedan kan dra direkt in i din kalender</p>
            </div>
            <div className="new-buttons">
                <button className="new-template"><b>+</b> Ny Träningsmall</button>
                <button className="new-folder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                    className="icons-in-text">
                        <path d="M12 10v6"></path>
                        <path d="M9 13h6"></path>
                        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 
                        1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                        </svg>
                    Ny Mapp
                    </button>
            </div>
            <div className="templates-container">
                <TemplateCard/>
                <TemplateCard/>
            </div>
            <NewTemplate/>

       </>);
    };

    export default Templates