import api from "../api/axios";

// Dashboard
export const getHospitalDashboard = async () => {
  const response = await api.get("/dashboard/hospital");
  return response.data;
};

// Assigned Claims
export const getAssignedClaims = async () => {
  const response = await api.get("/hospital/claims");
  return response.data;
};

// Claim Details
export const getHospitalClaimById = async (id) => {
  const response = await api.get(`/hospital/claims/${id}`);
  return response.data;
};

// Verify Claim
export const verifyClaim = async (id, data) => {
  const response = await api.patch(
    `/hospital/claims/${id}/verify`,
    data
  );

  return response.data;
};