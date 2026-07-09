import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
} from "lucide-react";

import {
  getAllPlans,
  deletePlan,
} from "../services/planService";

const AdminInsurancePlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const response = await getAllPlans();

      setPlans(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch insurance plans."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      return (
        plan.planName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        plan.insuranceCompany
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [plans, search]);

  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedPlan(null);
  };

  const handleDelete = async () => {
    try {
      await deletePlan(selectedPlan._id);

      toast.success("Insurance plan deleted successfully.");

      closeDeleteModal();

      fetchPlans();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete insurance plan."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">

        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold">

              Insurance Plans

            </h1>

            <p className="text-gray-500 mt-2">

              Manage all insurance plans

            </p>

          </div>

          <button
            onClick={() => navigate("/admin/plans/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />

            Create Plan

          </button>

        </div>

        {/* Search */}

        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search plan or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-11 pr-4 py-3"
            />

          </div>

        </div>

                {/* Plans Table */}

        <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-4 text-left">Plan</th>

                <th className="px-6 py-4 text-left">Company</th>

                <th className="px-6 py-4 text-left">Coverage</th>

                <th className="px-6 py-4 text-left">Premium</th>

                <th className="px-6 py-4 text-left">Validity</th>

                <th className="px-6 py-4 text-center">Status</th>

                <th className="px-6 py-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredPlans.length > 0 ? (

                filteredPlans.map((plan) => (

                  <tr
                    key={plan._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <div>

                        <p className="font-semibold">

                          {plan.planName}

                        </p>

                        <p className="text-sm text-gray-500">

                          {plan.planType}

                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      {plan.insuranceCompany}

                    </td>

                    <td className="px-6 py-4">

                      ₹
                      {plan.coverageAmount.toLocaleString()}

                    </td>

                    <td className="px-6 py-4">

                      ₹{plan.premium.toLocaleString()}

                    </td>

                    <td className="px-6 py-4">

                      {plan.validity} Months

                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          plan.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {plan.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/plans/${plan._id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={20} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/plans/edit/${plan._id}`
                            )
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          <Pencil size={20} />
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(plan)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >

                    No Insurance Plans Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Mobile Cards */}

        <div className="lg:hidden space-y-5">

          {filteredPlans.length > 0 ? (

            filteredPlans.map((plan) => (

              <div
                key={plan._id}
                className="bg-white rounded-xl shadow p-5"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-lg font-bold">

                      {plan.planName}

                    </h2>

                    <p className="text-gray-500">

                      {plan.insuranceCompany}

                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      plan.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {plan.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                <div className="mt-4 space-y-2 text-sm">

                  <p>

                    <strong>Coverage:</strong> ₹
                    {plan.coverageAmount.toLocaleString()}

                  </p>

                  <p>

                    <strong>Premium:</strong> ₹
                    {plan.premium.toLocaleString()}

                  </p>

                  <p>

                    <strong>Validity:</strong>{" "}
                    {plan.validity} Months

                  </p>

                </div>

                <div className="flex justify-end gap-4 mt-5">

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/plans/${plan._id}`
                      )
                    }
                    className="text-blue-600"
                  >
                    <Eye />
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/plans/edit/${plan._id}`
                      )
                    }
                    className="text-green-600"
                  >
                    <Pencil />
                  </button>

                  <button
                    onClick={() =>
                      openDeleteModal(plan)
                    }
                    className="text-red-600"
                  >
                    <Trash2 />
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="bg-white rounded-xl p-10 text-center shadow">

              <h2 className="text-xl font-semibold">

                No Insurance Plans Found

              </h2>

            </div>

          )}

        </div>

                {/* Delete Confirmation Modal */}

        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

              <h2 className="text-2xl font-bold mb-4">
                Delete Insurance Plan
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete
                <span className="font-semibold">
                  {" "}
                  {selectedPlan?.planName}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-4">

                <button
                  onClick={closeDeleteModal}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminInsurancePlans;