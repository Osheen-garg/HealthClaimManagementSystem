import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FilePlus2,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-toastify";

import PatientLayout from "../layouts/PatientLayout";
import DashboardCard from "../Components/DashboardCard";
import { getPatientDashboard } from "../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getPatientDashboard();
      setDashboard(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="space-y-8">

        {/* Welcome */}

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">

          <h1 className="text-4xl font-bold">
            Welcome 👋
          </h1>

          <p className="mt-3 text-lg">
            Manage your insurance policies and health claims easily.
          </p>

        </div>

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <DashboardCard
            title="Active Policies"
            value={dashboard.activePolicies}
          />

          <DashboardCard
            title="Claims Submitted"
            value={dashboard.totalClaims}
          />

          <DashboardCard
            title="Approved Claims"
            value={dashboard.approvedClaims}
          />

          <DashboardCard
            title="Pending Claims"
            value={dashboard.pendingClaims}
          />

        </div>

        {/* Quick Actions */}

        <div>

          <h2 className="text-2xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Link
              to="/plans"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <ShieldCheck
                className="text-blue-600"
                size={40}
              />

              <h3 className="font-semibold mt-4">
                Buy Insurance
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Purchase a new insurance policy.
              </p>

            </Link>

            <Link
              to="/submit-claim"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <FilePlus2
                className="text-green-600"
                size={40}
              />

              <h3 className="font-semibold mt-4">
                Submit Claim
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Upload documents and request reimbursement.
              </p>

            </Link>

            <Link
              to="/my-policies"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <ClipboardList
                className="text-purple-600"
                size={40}
              />

              <h3 className="font-semibold mt-4">
                My Policies
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                View all purchased insurance policies.
              </p>

            </Link>

            <Link
              to="/my-claims"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <ClipboardList
                className="text-red-600"
                size={40}
              />

              <h3 className="font-semibold mt-4">
                My Claims
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Track all submitted claims.
              </p>

            </Link>

          

          </div>

        </div>
                {/* Recent Policies */}

        <div className="bg-white rounded-2xl shadow-lg">

          <div className="p-6 border-b flex justify-between items-center">

            <h2 className="text-2xl font-bold">
              Recent Policies
            </h2>

            <Link
              to="/my-policies"
              className="text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    Policy
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Premium
                  </th>

                  <th className="text-left p-4">
                    Expiry
                  </th>

                </tr>

              </thead>

              <tbody>

                {dashboard.recentPolicies.length > 0 ? (

                  dashboard.recentPolicies.map((policy) => (

                    <tr
                      key={policy._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {policy.insurancePlan?.planName}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            policy.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : policy.status === "Pending Payment"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {policy.status}
                        </span>

                      </td>

                      <td className="p-4">
                        ₹{policy.insurancePlan?.premium}
                      </td>

                      <td className="p-4">
                        {policy.expiryDate
                          ? new Date(
                              policy.expiryDate
                            ).toLocaleDateString()
                          : "--"}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      No policies found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </PatientLayout>
  );
}

export default Dashboard;