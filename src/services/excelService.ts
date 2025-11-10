import axios from "axios";

const EXCEL_API_URL = "https://prod-xx.azurewebsites.net/api/tu-flujo";

export async function getExcelTasks() {
  try {
    const response = await axios.get(EXCEL_API_URL);
    // Ajusta si tu flujo devuelve otro formato
    return response.data.value || response.data;
  } catch (error) {
    console.error("Error al obtener datos del Excel:", error);
    return [];
  }
}
