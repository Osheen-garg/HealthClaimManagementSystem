import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { createPlan } from "../services/planService";

const CreateInsurancePlan = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
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
      setLoading(true);

      const payload = {
        ...formData,
        coverageAmount: Number(formData.coverageAmount),
        premium: Number(formData.premium),
        waitingPeriod: Number(formData.waitingPeriod),
        validity: Number(formData.validity),
        benefits: formData.benefits.filter((b) => b.trim() !== ""),
        exclusions: formData.exclusions.filter((e) => e.trim() !== ""),
      };

      const res = await createPlan(payload);

      toast.success(res.message);

      navigate("/admin/plans");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create insurance plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Create Insurance Plan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

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
                className="w-full border rounded-lg p-3"
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
                className="w-full border rounded-lg p-3"
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
                <option>Individual</option>
                <option>Family</option>
                <option>Senior Citizen</option>
               
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

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold">
                Benefits
              </h2>

              <button
                type="button"
                onClick={() => addField("benefits")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={18} />
                Add Benefit
              </button>

            </div>

            {formData.benefits.map((benefit, index) => (

              <div
                key={index}
                className="flex gap-3 mb-3"
              >

                <input
                  type="text"
                  placeholder={`Benefit ${index + 1}`}
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
                      removeField("benefits", index)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4"
                  >
                    <Trash2 size={18} />
                  </button>

                )}

              </div>

            ))}

          </div>

          {/* Exclusions */}

          <div className="border rounded-xl p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold">
                Exclusions
              </h2>

              <button
                type="button"
                onClick={() => addField("exclusions")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={18} />
                Add Exclusion
              </button>

            </div>

            {formData.exclusions.map((item, index) => (

              <div
                key={index}
                className="flex gap-3 mb-3"
              >

                <input
                  type="text"
                  placeholder={`Exclusion ${index + 1}`}
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
                      removeField("exclusions", index)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4"
                  >
                    <Trash2 size={18} />
                  </button>

                )}

              </div>

            ))}

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => navigate("/admin/plans")}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Plan"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateInsurancePlan;