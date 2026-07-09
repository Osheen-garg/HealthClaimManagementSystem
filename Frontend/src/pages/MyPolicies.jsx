import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CalendarDays, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";

import PatientLayout from "../layouts/PatientLayout";
import { getMyPolicies,cancelPolicy } from "../services/policyService";

function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchPolicies = async () => {
    try {
      const response = await getMyPolicies();

      if (response.success) {
        setPolicies(response.data || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to fetch policies"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPolicy = async (policyId) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this policy?"
  );

  if (!confirmCancel) return;

  try {
    const response = await cancelPolicy(policyId);

    if (response.success) {
      toast.success(response.message || "Policy cancelled successfully");

      // Refresh policy list
      fetchPolicies();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to cancel policy"
    );
  }
};

  useEffect(() => {
    fetchPolicies();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto py-8">

        <h1 className="text-4xl font-bold mb-8">
          My Policies
        </h1>

        {loading ? (
          <div className="text-center text-lg">
            Loading Policies...
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <ShieldCheck
              size={70}
              className="mx-auto text-blue-500"
            />

            <h2 className="text-2xl font-bold mt-5">
              No Policies Found
            </h2>

            <p className="text-gray-500 mt-3">
              Purchase an insurance plan to see it here.
            </p>

            <Link
              to="/plans"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Browse Plans
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {policies.map((policy) => (

              <div
                key={policy._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >

                <div className="flex justify-between items-center">

                  <h2 className="text-2xl font-bold text-blue-700">
                    {policy.insurancePlan?.planName}
                  </h2>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      policy.status
                    )}`}
                  >
                    {policy.status}
                  </span>

                </div>

                <p className="text-gray-500 mt-2">
                  {policy.insurancePlan?.insuranceCompany}
                </p>

                <div className="grid grid-cols-2 gap-5 mt-6">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Coverage
                    </p>

                    <p className="font-bold flex items-center mt-1">
                      <IndianRupee size={18} />

                      {policy.insurancePlan?.coverageAmount?.toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Premium
                    </p>

                    <p className="font-bold flex items-center mt-1">
                      <IndianRupee size={18} />

                      {policy.insurancePlan?.premium?.toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Start Date
                    </p>

                    <p className="flex items-center mt-1">
                      <CalendarDays size={16} className="mr-2" />

                      {new Date(policy.startDate).toLocaleDateString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Expiry
                    </p>

                    <p className="flex items-center mt-1">
                      <CalendarDays size={16} className="mr-2" />

                      {new Date(policy.expiryDate).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className="mt-6 border-t pt-5">

                  <p className="text-sm text-gray-500">
                    Policy Number
                  </p>

                  <p className="font-semibold">
                    {policy.policyNumber}
                  </p>

                </div>

                <div className="flex gap-3 mt-6">

                  <Link
                    to={`/policies/${policy._id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                  >
                    View Details
                  </Link>

                  {policy.status === "Active" && (
                    <button
  onClick={() => handleCancelPolicy(policy._id)}
  className="px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl"
>
  Cancel
</button>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </PatientLayout>
  );
}

export default MyPolicies;