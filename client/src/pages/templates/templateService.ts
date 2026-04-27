const API_URL = "http://localhost:5255/api";

export const saveTemplate = async (templateData) => {
  const response = await fetch(`${API_URL}/WorkoutTemplate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(templateData),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Servern svarade med status: ${response.status}`);
  }
};
