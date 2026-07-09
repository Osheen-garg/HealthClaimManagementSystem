
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

import HospitalLayout from "../layouts/HospitalLayout";
import DashboardCard from "../Components/DashboardCard";
import { getHospitalDashboard } from "../services/hospitalService";
import { toast } from "react-toastify";

const HospitalDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getHospitalDashboard();
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
      <HospitalLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>

      <div className="space-y-8">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 text-white">

          <h1 className="text-4xl font-bold">
            Hospital Dashboard
          </h1>

          <p className="mt-2">
            Manage and verify assigned health claims.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <DashboardCard
            title="Assigned Claims"
            value={dashboard.assignedClaims}
          />

          <DashboardCard
            title="Verified Claims"
            value={dashboard.verifiedClaims}
          />

          <DashboardCard
            title="Pending Verification"
            value={dashboard.pendingClaims}
          />

        </div>

        <h2 className="text-2xl font-bold">
          Quick Actions
        </h2>

       <div className="grid md:grid-cols-3 gap-6">

  <Link
    to="/hospital/claims?filter=assigned"
    className="bg-white shadow rounded-xl p-6 hover:shadow-lg"
  >
    <FileText
      size={40}
      className="text-blue-600"
    />

    <h3 className="font-semibold mt-4">
      Assigned Claims
    </h3>

    <p className="text-gray-500 mt-2">
      View all assigned claims.
    </p>

  </Link>

  <Link
    to="/hospital/claims?filter=pending"
    className="bg-white shadow rounded-xl p-6 hover:shadow-lg"
  >
    <Clock
      size={40}
      className="text-yellow-600"
    />

    <h3 className="font-semibold mt-4">
      Pending Verification
    </h3>

    <p className="text-gray-500 mt-2">
      Claims awaiting verification.
    </p>

  </Link>

  <Link
    to="/hospital/claims?filter=verified"
    className="bg-white shadow rounded-xl p-6 hover:shadow-lg"
  >
    <CheckCircle
      size={40}
      className="text-green-600"
    />

    <h3 className="font-semibold mt-4">
      Verified Claims
    </h3>

    <p className="text-gray-500 mt-2">
      View verified claims.
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

                <th className="text-left p-4">
                  Claim No
                </th>

                <th className="text-left p-4">
                  Patient
                </th>

                <th className="text-left p-4">
                  Amount
                </th>

                <th className="text-left p-4">
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

    </HospitalLayout>
  );
};

export default HospitalDashboard;