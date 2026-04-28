import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5255/api", // Din dotnet-url
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
