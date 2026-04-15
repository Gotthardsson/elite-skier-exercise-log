import React, {useState} from 'react';
import "./templates.css"
import TemplateCard from './TemplateCard';

    function Templates(){

        return(<>
            <div className="header">
                <h1 className="title">Mallar av träningssessioner</h1> 
                <p className="subtitle">Här kan du skapa mallar av träningspass som du sedan kan dra direkt in i din kalender</p>
            </div>
            <div className="new-buttons">
                <button className="new-template">Ny Träningsmall</button>
                <button className="new-folder">Ny Mapp</button>
            </div>
            <div className="templates-container">
                <TemplateCard/>
            </div>
       </>);
    };

    export default Templates