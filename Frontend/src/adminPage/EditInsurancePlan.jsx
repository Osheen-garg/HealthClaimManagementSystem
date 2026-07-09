import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";

import {
  getPlanById,
  updatePlan,
} from "../services/planService";

const EditInsurancePlan = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    planName: "",
    insuranceCompany: "",
    planType: "Individual",
    coverageAmount: "",
    premium: "",
    waitingPeriod: "",
    validity: "",
    benefits: [""],
    exclusions: [""],
    isActive: true,
  });

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);

      const response = await getPlanById(id);

      const plan = response.data;

      setFormData({
        planName: plan.planName,
        insuranceCompany: plan.insuranceCompany,
        planType: plan.planType,
        coverageAmount: plan.coverageAmount,
        premium: plan.premium,
        waitingPeriod: plan.waitingPeriod,
        validity: plan.validity,
        benefits:
          plan.benefits.length > 0 ? plan.benefits : [""],
        exclusions:
          plan.exclusions.length > 0
            ? plan.exclusions
            : [""],
        isActive: plan.isActive,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch insurance plan."
      );

      navigate("/admin/plans");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (
    field,
    index,
    value
  ) => {
    const updated = [...formData[field]];

    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      [field]: updated,
    }));
  };

  const addField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeField = (field, index) => {
    const updated = [...formData[field]];

    updated.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      [field]: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        coverageAmount: Number(
          formData.coverageAmount
        ),
        premium: Number(formData.premium),
        waitingPeriod: Number(
          formData.waitingPeriod
        ),
        validity: Number(formData.validity),
        benefits: formData.benefits.filter(
          (b) => b.trim() !== ""
        ),
        exclusions: formData.exclusions.filter(
          (e) => e.trim() !== ""
        ),
      };

      const response = await updatePlan(
        id,
        payload
      );

      toast.success(response.message);

      navigate("/admin/plans");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update insurance plan."
      );
    } finally {
      setSaving(false);
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

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Insurance Plan
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Basic Information */}

          <div className="grid md:grid-cols-2 gap-6">
                        <div>
              <label className="block mb-2 font-semibold">
                Plan Name
              </label>

              <input
                type="text"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Insurance Company
              </label>

              <input
                type="text"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Plan Type
              </label>

              <select
                name="planType"
                value={formData.planType}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="Individual">Individual</option>
                <option value="Family Floater">Family Floater</option>
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Coverage Amount
              </label>

              <input
                type="number"
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Premium
              </label>

              <input
                type="number"
                name="premium"
                value={formData.premium}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Waiting Period (Days)
              </label>

              <input
                type="number"
                name="waitingPeriod"
                value={formData.waitingPeriod}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Validity (Months)
              </label>

              <input
                type="number"
                name="validity"
                value={formData.validity}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-3 h-5 w-5"
              />

              <label className="font-semibold">
                Active Plan
              </label>
            </div>

          </div>

          {/* Benefits */}

          <div className="border rounded-xl p-6">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold">
                Benefits
              </h2>

              <button
                type="button"
                onClick={() => addField("benefits")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add
              </button>

            </div>

            {formData.benefits.map((benefit, index) => (

              <div
                key={index}
                className="flex gap-3 mb-3"
              >

                <input
                  type="text"
                  value={benefit}
                  onChange={(e) =>
                    handleArrayChange(
                      "benefits",
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1 border rounded-lg p-3"
                />

                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeField(
                        "benefits",
                        index
                      )
                    }
                    className="bg-red-500 text-white px-4 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

              </div>

            ))}

          </div>

          {/* Exclusions */}

          <div className="border rounded-xl p-6">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold">
                Exclusions
              </h2>

              <button
                type="button"
                onClick={() =>
                  addField("exclusions")
                }
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add
              </button>

            </div>

            {formData.exclusions.map((item, index) => (

              <div
                key={index}
                className="flex gap-3 mb-3"
              >

                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(
                      "exclusions",
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1 border rounded-lg p-3"
                />

                {formData.exclusions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeField(
                        "exclusions",
                        index
                      )
                    }
                    className="bg-red-500 text-white px-4 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

              </div>

            ))}
          </div>

          {/* Action Buttons */}

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => navigate("/admin/plans")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {saving ? "Updating..." : "Update Plan"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditInsurancePlan;