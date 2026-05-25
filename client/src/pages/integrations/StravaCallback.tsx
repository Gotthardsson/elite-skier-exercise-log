import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const handleStravaConnect = () => {
  const clientId = "221024"; // Byt ut mot ditt riktiga ID
  const redirectUri = "http://localhost:5173/strava-callback"; // Samma som i Strava Dashboard
  const scope = "read,activity:read_all";

  // Bygg URL:en
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&approval_prompt=force`;

  // Skicka iväg användaren
  window.location.href = authUrl;
};

export default function StravaCallback() {
  const navigate = useNavigate();
  const hasCalled = useRef(false); // Förhindrar att useEffect körs två gånger i StrictMode

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error("Användaren nekade åtkomst");
      navigate("/integrations?status=error");
      return;
    }

    if (code && !hasCalled.current) {
      hasCalled.current = true; // Markera att vi har startat anropet
      console.log("Skickar kod till backend:", code);

      const exchangeToken = async () => {
        try {
          // Ändra porten (5255) så den matchar din dotnet run-logg!
          await axios.post("http://localhost:5255/api/strava/exchange-token", {
            code: code,
          });

          console.log("Backend svarade: Success!");
          navigate("/integrations?status=success");
        } catch (err) {
          console.error("Fel vid token exchange:", err);
          navigate("/integrations?status=error");
        }
      };

      exchangeToken();
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Ansluter till Strava...</h2>
      <p>Vi verifierar din anslutning med elit-fart. Vänta kvar...</p>
    </div>
  );
}
