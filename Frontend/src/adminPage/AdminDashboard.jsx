import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Building2,
  UserCheck,
  ClipboardList,
  FileCheck,
  CheckCircle,
  XCircle,
  CreditCard,
  FileText,
} from "lucide-react";

import { toast } from "react-toastify";

import AdminLayout from "../layouts/AdminLayout";
import DashboardCard from "../Components/DashboardCard";
import { getAdminDashboard } from "../services/dashboardService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getAdminDashboard();

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
      <AdminLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="space-y-8">

        {/* Hero */}

        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-2xl p-8 text-white">

          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-lg">
            Monitor users, insurance plans, policies and health claims.
          </p>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          <DashboardCard
            title="Patients"
            value={dashboard.totalPatients}
            icon={<UserCheck size={26} />}
          />

          <DashboardCard
            title="Hospitals"
            value={dashboard.totalHospitals}
            icon={<Building2 size={26} />}
          />

          <DashboardCard
            title="Agents"
            value={dashboard.totalAgents}
            icon={<Users size={26} />}
          />

          <DashboardCard
            title="Plans"
            value={dashboard.totalPlans}
            icon={<Shield size={26} />}
          />

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">

          <DashboardCard
            title="Policies"
            value={dashboard.totalPolicies}
            icon={<ClipboardList size={26} />}
          />

          <DashboardCard
            title="Claims"
            value={dashboard.totalClaims}
            icon={<FileText size={26} />}
          />

          <DashboardCard
            title="Approved"
            value={dashboard.approvedClaims}
            icon={<CheckCircle size={26} />}
          />

          <DashboardCard
            title="Rejected"
            value={dashboard.rejectedClaims}
            icon={<XCircle size={26} />}
          />

          <DashboardCard
            title="Paid"
            value={dashboard.paidClaims}
            icon={<CreditCard size={26} />}
          />

        </div>

                {/* Quick Actions */}

        <div>

          <h2 className="text-2xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-5">

            <Link
              to="/admin/plans"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg"
            >
              <Shield className="text-blue-600" size={40} />

              <h3 className="font-semibold mt-4">
                Insurance Plans
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Create and manage insurance plans.
              </p>

            </Link>

            <Link
              to="/admin/claims"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg"
            >
              <FileCheck className="text-green-600" size={40} />

              <h3 className="font-semibold mt-4">
                Manage Claims
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Review all submitted claims.
              </p>

            </Link>

            <Link
              to="/admin/users"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg"
            >
              <Users className="text-purple-600" size={40} />

              <h3 className="font-semibold mt-4">
                Manage Users
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Patients, hospitals and agents.
              </p>

            </Link>

          </div>

        </div>
                {/* Recent Claims */}

        <div className="bg-white rounded-2xl shadow">

          <div className="p-6 border-b flex justify-between items-center">

            <h2 className="text-2xl font-bold">
              Recent Claims
            </h2>

            <Link
              to="/admin/claims"
              className="text-blue-600 font-semibold hover:underline"
            >
              View All
            </Link>

          </div>

          <div className="overflow-x-auto">

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

                {dashboard.recentClaims?.length > 0 ? (

                  dashboard.recentClaims.map((claim) => (

                    <tr
                      key={claim._id}
                      className="border-b hover:bg-gray-50"
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

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${
                            claim.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : claim.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : claim.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {claim.status}
                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={4}
                      className="text-center p-8 text-gray-500"
                    >
                      No claims found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      

      </div>

    </AdminLayout>

  );
};

export default AdminDashboard;