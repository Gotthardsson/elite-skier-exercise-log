import "./templates.css"
    function TemplateCard(){

        const title = "Långpass";
        const sport = "Klassikt";
        const length = 120;
        const comment = "lugn och skön zon 2-åkning"
        const  heartRateZone = "A2"


        return(
            <div className="template-card">
                <h3 className="card-title">{title}</h3>
                <p className="card-sport">{sport} - {length} min</p>
                <p className="card-comment">{comment}</p>
                <p className="card-zone">{heartRateZone}</p>
                <div className="card-zone-line"></div>
            </div>

        );
    }

    export default TemplateCard