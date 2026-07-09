import api from "../api/axios";

// ===================== PATIENT =====================

export const getPatientDashboard = async () => {
  const response = await api.get("/dashboard/patient");
  return response.data;
};

// ===================== ADMIN =====================

export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

// ===================== HOSPITAL =====================

export const getHospitalDashboard = async () => {
  const response = await api.get("/dashboard/hospital");
  return response.data;
};

// ===================== AGENT =====================

export const getAgentDashboard = async () => {
  const response = await api.get("/dashboard/agent");
  return response.data;
};