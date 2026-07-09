import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMyPolicies } from "../services/policyService";
import { submitClaim } from "../services/claimService";

const SubmitClaim = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [policies, setPolicies] = useState([]);

 const [formData, setFormData] = useState({
  policy: "",
  claimAmount: "",
  diagnosis: "",
  treatmentDescription: "",
  admissionDate: "",
  dischargeDate: "",
});
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await getMyPolicies();

      setPolicies(
        response.data.filter(
          (policy) => policy.status === "Active"
        )
      );
    } catch (error) {
      toast.error("Unable to load policies");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

  const payload = {
  policyId: formData.policy,
  claimAmount: Number(formData.claimAmount),
  diagnosis: formData.diagnosis,
  treatmentDescription: formData.treatmentDescription,
  admissionDate: formData.admissionDate,
  dischargeDate: formData.dischargeDate,
};

    const response = await submitClaim(payload);

    toast.success(response.message);

    navigate("/my-claims");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to submit claim"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Submit Insurance Claim
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
                    <div>
  <label className="block mb-2 font-semibold">
    Select Policy
  </label>

  <select
    name="policy"
    value={formData.policy}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3"
  >
    <option value="">Select Policy</option>

    {policies.map((policy) => (
      <option key={policy._id} value={policy._id}>
        {policy.policyNumber} -{" "}
        {policy.insurancePlan?.planName}
      </option>
    ))}
  </select>
</div>

       <div>
  <label className="block mb-2 font-semibold">
    Claim Amount
  </label>

  <input
    type="number"
    name="claimAmount"
    value={formData.claimAmount}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3"
  />
</div>

          
          <div>
  <label className="block mb-2 font-semibold">
    Diagnosis
  </label>

  <input
    type="text"
    name="diagnosis"
    value={formData.diagnosis}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3"
    placeholder="e.g. Dengue Fever"
  />
</div>

          
         <div>
  <label className="block mb-2 font-semibold">
    Treatment Description
  </label>

  <textarea
    rows="4"
    name="treatmentDescription"
    value={formData.treatmentDescription}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3"
    placeholder="Describe the treatment received..."
  />
</div>
<div>
  <label className="block mb-2 font-semibold">
    Admission Date
  </label>

  <input
    type="date"
    name="admissionDate"
    value={formData.admissionDate}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3"
  />
</div>

<div>
  <label className="block mb-2 font-semibold">
    Discharge Date
  </label>

  <input
    type="date"
    name="dischargeDate"
    value={formData.dischargeDate}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3"
  />
</div>

         <div className="flex justify-end gap-4">

  <button
    type="button"
    onClick={() => navigate(-1)}
    className="px-6 py-3 border rounded-lg"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
  >
    {loading ? "Submitting..." : "Submit Claim"}
  </button>

</div>
        </form>

      </div>

    </div>
  );
};

export default SubmitClaim;
       

        