import api from "../api/axios";

// Dashboard
export const getAgentDashboard = async () => {
  const response = await api.get("/dashboard/agent");
  return response.data;
};

// Assigned Claims
export const getAssignedClaims = async () => {
  const response = await api.get("/agent/claims");
  return response.data;
};

// Claim Details
export const getClaimById = async (id) => {
  const response = await api.get(`/agent/claims/${id}`);
  return response.data;
};

// Review Claim
export const reviewClaim = async (id, data) => {
  const response = await api.patch(
    `/agent/claims/${id}/review`,
    data
  );

  return response.data;
};