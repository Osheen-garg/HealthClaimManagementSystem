import api from "../api/axios";

// ===================== CLAIMS =====================

export const getAllClaims = async () => {
  const response = await api.get("/admin/claims");
  return response.data;
};

export const getClaimById = async (id) => {
  const response = await api.get(`/admin/claims/${id}`);
  return response.data;
};

// ===================== HOSPITAL =====================

export const assignHospital = async (claimId, hospitalId) => {
  const response = await api.patch(
    `/admin/claims/${claimId}/assign-hospital`,
    {
      hospitalId,
    }
  );

  return response.data;
};

// ===================== AGENT =====================

export const assignAgent = async (claimId, agentId) => {
  const response = await api.patch(
    `/admin/claims/${claimId}/assign-agent`,
    {
      agentId,
    }
  );

  return response.data;
};

// ===================== APPROVE =====================

export const approveClaim = async (
  claimId,
  approvedAmount
) => {
  const response = await api.patch(
    `/admin/claims/${claimId}/approve`,
    {
      approvedAmount,
    }
  );

  return response.data;
};

// ===================== REJECT =====================

export const rejectClaim = async (
  claimId,
  rejectionReason
) => {
  const response = await api.patch(
    `/admin/claims/${claimId}/reject`,
    {
      rejectionReason,
    }
  );

  return response.data;
};

// ===================== PAY =====================

export const payClaim = async (claimId) => {
  const response = await api.patch(
    `/admin/claims/${claimId}/pay`
  );

  return response.data;
};

export const getHospitals = async () => {
  const response = await api.get("/admin/hospitals");
  return response.data;
};

export const getAgents = async () => {
  const response = await api.get("/admin/agents");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/admin/create-user", data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};