import axios from "axios";

const EXCEL_API_URL = "https://default0507e5ce0f9549aaabdec90dcdedbd.12.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/1c99f96fc6894096af6b98b644b03d39/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bqcEBXUBeg2v2Iv6VEI88tOQdZD6yQ6H7kpp_yrYsgI";

export async function getExcelTasks() {
  try {
    const response = await axios.get(EXCEL_API_URL);
    console.log("📦 Datos recibidos del Excel:", response.data);
    return response.data.value || response.data;
  } catch (error) {
    console.error("Error al obtener datos del Excel:", error);
    return [];
  }
}
