import api from "../api/axios";

export const getMyPolicies = async () => {
  const response = await api.get("/policies/my-policies");
  return response.data;
};

export const getSinglePolicy = async (id) => {
  const response = await api.get(`/policies/${id}`);
  return response.data;
};

export const cancelPolicy = async (id) => {
  const response = await api.patch(`/policies/cancel/${id}`);
  return response.data;
};