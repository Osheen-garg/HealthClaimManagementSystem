import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDays,
  Building2,
  IndianRupee,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import PatientLayout from "../layouts/PatientLayout";
import { getSinglePolicy } from "../services/policyService";

function PolicyDetails() {
  const { id } = useParams();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await getSinglePolicy(id);

      if (response.success) {
        setPolicy(response.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to fetch policy"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="text-center py-10 text-xl">
          Loading Policy...
        </div>
      </PatientLayout>
    );
  }

  if (!policy) {
    return (
      <PatientLayout>
        <div className="text-center py-10 text-xl">
          Policy not found.
        </div>
      </PatientLayout>
    );
  }

  const plan = policy.insurancePlan;

  return (
    <PatientLayout>
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              {plan.planName}
            </h1>

            <p className="flex items-center gap-2 mt-2 text-gray-600">
              <Building2 size={18} />
              {plan.insuranceCompany}
            </p>
          </div>

          <span
            className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
              policy.status
            )}`}
          >
            {policy.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-blue-50 p-5 rounded-xl">
            <p className="text-gray-500">Policy Number</p>
            <h3 className="font-bold mt-2">
              {policy.policyNumber}
            </h3>
          </div>

          <div className="bg-green-50 p-5 rounded-xl">
            <p className="text-gray-500">Coverage Amount</p>
            <h3 className="font-bold flex items-center mt-2">
              <IndianRupee size={18} />
              {plan.coverageAmount.toLocaleString()}
            </h3>
          </div>

          <div className="bg-yellow-50 p-5 rounded-xl">
            <p className="text-gray-500">Premium</p>
            <h3 className="font-bold flex items-center mt-2">
              <IndianRupee size={18} />
              {plan.premium.toLocaleString()}
            </h3>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl">
            <p className="text-gray-500">Validity</p>
            <h3 className="font-bold mt-2">
              {plan.validity} Months
            </h3>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl">
            <p className="text-gray-500">Start Date</p>
            <h3 className="flex items-center gap-2 mt-2">
              <CalendarDays size={18} />
              {new Date(policy.startDate).toLocaleDateString()}
            </h3>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl">
            <p className="text-gray-500">Expiry Date</p>
            <h3 className="flex items-center gap-2 mt-2">
              <CalendarDays size={18} />
              {new Date(policy.expiryDate).toLocaleDateString()}
            </h3>
          </div>

        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Benefits
          </h2>

          <div className="space-y-3">
            {plan.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={18} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Exclusions
          </h2>

          <div className="space-y-3">
            {plan.exclusions?.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <XCircle className="text-red-500" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PatientLayout>
  );
}

export default PolicyDetails;