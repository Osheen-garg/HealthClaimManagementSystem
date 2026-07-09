

import api from "../api/axios";

export const submitClaim = async (data) => {
  const response = await api.post("/claims/", data);

  return response.data;
};

export const getMyClaims = async () => {
  const response = await api.get("/claims/my-claims");

  return response.data;
};

export const getClaimById = async (id) => {
  const response = await api.get(`/claims/${id}`);

  return response.data;
};