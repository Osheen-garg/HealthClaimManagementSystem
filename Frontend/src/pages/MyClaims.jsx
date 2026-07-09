import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Search } from "lucide-react";

import { getMyClaims } from "../services/claimService";

const MyClaims = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);

      const response = await getMyClaims();

      setClaims(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load claims."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        claim.claimNumber
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        claim.policy?.policyNumber
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, search, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-700";

      case "Hospital Assigned":
        return "bg-blue-100 text-blue-700";

      case "Hospital Verified":
        return "bg-indigo-100 text-indigo-700";

      case "Agent Assigned":
        return "bg-purple-100 text-purple-700";

      case "Agent Reviewed":
        return "bg-cyan-100 text-cyan-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Paid":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-gray-100 text-gray-700";
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

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            My Claims
          </h1>

          <button
            onClick={() => navigate("/submit-claim")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Submit New Claim
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-3.5 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search Claim Number..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            >
              <option>All</option>
              <option>Submitted</option>
              <option>Hospital Assigned</option>
              <option>Hospital Verified</option>
              <option>Agent Assigned</option>
              <option>Agent Reviewed</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Paid</option>
            </select>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">
            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Claim No.
                </th>

                <th className="p-4 text-left">
                  Policy
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Submitted
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>
                {filteredClaims.length > 0 ? (
  filteredClaims.map((claim) => (
    <tr
      key={claim._id}
      className="border-t hover:bg-gray-50 transition"
    >
      <td className="p-4 font-medium">
        {claim.claimNumber}
      </td>

      <td className="p-4">
        {claim.policy?.policyNumber}
      </td>

      <td className="p-4">
        ₹{claim.claimAmount.toLocaleString()}
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            claim.status
          )}`}
        >
          {claim.status}
        </span>
      </td>

      <td className="p-4">
        {new Date(claim.createdAt).toLocaleDateString()}
      </td>

      <td className="p-4 text-center">
        <button
          onClick={() =>
            navigate(`/claims/${claim._id}`)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          View Details
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td
      colSpan={6}
      className="text-center py-10 text-gray-500"
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
  );
};

export default MyClaims;