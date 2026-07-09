import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileSearch,
  ClipboardCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import AgentLayout from "../layouts/AgentLayout";
import DashboardCard from "../Components/DashboardCard";
import { getAgentDashboard } from "../services/agentService";
import { toast } from "react-toastify";

const AgentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getAgentDashboard();
      console.log(response.data)
      setDashboard(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-8 text-white">

          <h1 className="text-4xl font-bold">
            Agent Dashboard
          </h1>

          <p className="mt-2">
            Review and recommend health insurance claims.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <DashboardCard
            title="Assigned Claims"
            value={dashboard.assignedClaims}
          />

          <DashboardCard
            title="Reviewed Claims"
            value={dashboard.reviewedClaims}
          />

          <DashboardCard
            title="Pending Claims"
            value={dashboard.pendingClaims}
          />

          

        </div>

        <h2 className="text-2xl font-bold">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            to="/agent/claims?filter=assigned"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg"
          >
            <FileSearch
              className="text-green-600"
              size={40}
            />

            <h3 className="font-semibold mt-4">
              Assigned Claims
            </h3>

            <p className="text-gray-500 mt-2">
              View all assigned claims.
            </p>

          </Link>

          <Link
            to="/agent/claims?filter=pending"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg"
          >
            <ClipboardCheck
              className="text-blue-600"
              size={40}
            />

            <h3 className="font-semibold mt-4">
              Pending Reviews
            </h3>

            <p className="text-gray-500 mt-2">
              Claims waiting for review.
            </p>

          </Link>

          <Link
            to="/agent/claims?filter=reviewed"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg"
          >
            <CheckCircle
              className="text-emerald-600"
              size={40}
            />

            <h3 className="font-semibold mt-4">
              Reviewed Claims
            </h3>

            <p className="text-gray-500 mt-2">
              View completed reviews.
            </p>

          </Link>

        </div>

        <div className="bg-white rounded-xl shadow">

          <div className="p-6 border-b">

            <h2 className="text-xl font-bold">
              Recent Assigned Claims
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Claim No
                </th>

                <th className="p-4 text-left">
                  Patient
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {dashboard.recentClaims?.map((claim) => (

                <tr
                  key={claim._id}
                  className="border-b"
                >

                  <td className="p-4">
                    {claim.claimNumber}
                  </td>

                  <td className="p-4">
                    {claim.patient?.name}
                  </td>

                  <td className="p-4">
                    ₹{claim.claimAmount}
                  </td>

                  <td className="p-4">
                    {claim.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AgentLayout>
  );
};

export default AgentDashboard;