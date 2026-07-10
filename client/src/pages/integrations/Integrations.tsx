import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./integrations.css";
import stravaLogo from "../../assets/strava.svg";
import ButtonPrimary from "../../components/ButtonPrimary";
import "../../components/button.css";
import { handleStravaConnect } from "./StravaCallback";
import apiClient from "../../api/apiClient";

export default function Integrations() {
  const [stravaConnected, setStravaConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Kontrollera befintlig koppling i databasen vid laddning
  useEffect(() => {
    const checkStravaConnection = async () => {
      try {
        const response = await apiClient.get("/strava/status");
        // Sätter staten baserat på vad ditt repo/service svarade (true/false)
        setStravaConnected(response.data.connected);
      } catch (error) {
        console.error("Kunde inte kontrollera Strava-status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStravaConnection();
  }, []);

  // 2. Fånga upp status från OAuth-callbacken (?status=success eller ?status=error)
  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "success") {
      setStravaConnected(true); // Gör knappen grön direkt i UI

      Swal.fire({
        title: "Kopplingen lyckades!",
        text: "Dina framtida Strava-pass kommer nu att dyka upp i kalendern.",
        icon: "success",
        timer: 3500,
        showConfirmButton: false,
      });

      // Städa URL:en så att meddelandet inte visas igen vid sidomladdning
      searchParams.delete("status");
      setSearchParams(searchParams);
    }

    if (status === "error") {
      Swal.fire({
        title: "Kopplingen misslyckades",
        text: "Något gick fel under token-utbytet eller så avbröts verifieringen.",
        icon: "error",
        confirmButtonText: "Försök igen",
      });

      searchParams.delete("status");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Hantera bortkoppling (rensa tokens i databasen)
  const handleDisconnect = async () => {
    try {
      const result = await Swal.fire({
        title: "Är du säker?",
        text: "Vill du koppla bort ditt Strava-konto från SkiPlan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ja, koppla bort",
        cancelButtonText: "Avbryt",
      });

      if (result.isConfirmed) {
        // Ropar på din nya Disconnect-endpoint i din StravaController
        await apiClient.post("/strava/disconnect");

        setStravaConnected(false);
        Swal.fire(
          "Bortkopplad!",
          "Din Strava-koppling har tagits bort.",
          "success"
        );
      }
    } catch (error) {
      console.error("Gick inte att koppla bort Strava:", error);
      Swal.fire("Fel", "Kunde inte slutföra bortkopplingen.", "error");
    }
  };

  if (loading) {
    return (
      <div
        className="integrations-page"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <h3>Läser in din profil...</h3>
      </div>
    );
  }

  return (
    <div className="integrations-page">
      <div className="ig-app-container">
        <img alt="strava-logo" src={stravaLogo} className="strava-logo-svg" />

        <div className="ig-txt-content">
          <h2>Strava</h2>
          <p>Importera aktiviteter automatiskt</p>

          <span
            className={`ig-status ${
              stravaConnected ? "is-connected" : "is-disconnected"
            }`}
          >
            Status: {stravaConnected ? "Kopplad" : "Ej kopplad"}
          </span>
        </div>

        <div className="connect-btn">
          <ButtonPrimary
            onClick={stravaConnected ? handleDisconnect : handleStravaConnect}
            className={`btn-primary ${
              stravaConnected ? "strava-btn-connected" : ""
            }`}
            text={stravaConnected ? "Koppla bort" : "Koppla"}
          />
        </div>
      </div>
    </div>
  );
}
