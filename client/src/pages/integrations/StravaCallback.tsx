import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Denna funktion exporteras och körs när man klickar på "Koppla" i Integrations.tsx
export const handleStravaConnect = () => {
  const clientId = "221024"; // Ditt riktiga Strava Client ID
  const redirectUri = "http://localhost:5173/strava-callback"; // Måste matcha din Strava Dashboard exakt
  const scope = "read,activity:read_all";

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&approval_prompt=force`;

  // Skicka iväg idrottaren till Stravas inloggning
  window.location.href = authUrl;
};

export default function StravaCallback() {
  const navigate = useNavigate();
  const hasCalled = useRef(false); // Fixar så att StrictMode i React inte dubbelkör effekten

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    // Om idrottaren klickade på "Neka/Cancel" hos Strava
    if (error) {
      console.error("Användaren nekade åtkomst i OAuth-steget");
      navigate("/integrations?status=error");
      return;
    }

    // Om vi fick en godkänd kod och inte redan har skickat den
    if (code && !hasCalled.current) {
      hasCalled.current = true; // Lås effekten
      console.log("Skickar kod till .NET-backend:", code);

      const exchangeToken = async () => {
        try {
          // Anropar din ExchangeToken-metod i StravaController
          await axios.post("http://localhost:5255/api/strava/exchange-token", {
            code: code,
          });

          console.log("Backend sparade ner tokens via Repot!");
          // Skicka tillbaka till integrationer med succé-flagga
          navigate("/integrations?status=success");
        } catch (err) {
          console.error("Fel vid token exchange i backenden:", err);
          navigate("/integrations?status=error");
        }
      };

      exchangeToken();
    }
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ color: "#111827" }}>Ansluter till Strava...</h2>
      <p style={{ color: "#6b7280" }}>
        Vi verifierar din anslutning med elit-fart. Vänta kvar...
      </p>
    </div>
  );
}
