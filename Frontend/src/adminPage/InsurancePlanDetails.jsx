import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlanById } from "../services/planService";
import { toast } from "react-toastify";

const InsurancePlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);

      const response = await getPlanById(id);

      setPlan(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load insurance plan."
      );
      navigate("/admin/plans");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Insurance Plan Details
          </h1>

          <button
            onClick={() => navigate("/admin/plans")}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Back
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <InfoCard title="Plan Name" value={plan.planName} />
          <InfoCard title="Company" value={plan.insuranceCompany} />
          <InfoCard title="Plan Type" value={plan.planType} />
          <InfoCard
            title="Coverage"
            value={`₹${plan.coverageAmount.toLocaleString()}`}
          />
          <InfoCard
            title="Premium"
            value={`₹${plan.premium.toLocaleString()}`}
          />
          <InfoCard
            title="Waiting Period"
            value={`${plan.waitingPeriod} Days`}
          />
          <InfoCard
            title="Validity"
            value={`${plan.validity} Months`}
          />
          <InfoCard
            title="Status"
            value={plan.isActive ? "Active" : "Inactive"}
          />

        </div>

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Benefits
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            {plan.benefits.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </div>

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Exclusions
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            {plan.exclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </div>

      </div>

    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="font-semibold text-lg mt-1">{value}</p>
  </div>
);

export default InsurancePlanDetails;