import api from "../api/axios";

export const initiatePayment = async (planId) => {
  const response = await api.post("/payment/create-payment", {
    planId,
  });

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post(
    "/payment/verify",
    paymentData
  );

  return response.data;
};