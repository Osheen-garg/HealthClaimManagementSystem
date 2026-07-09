import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getHospitals,
  assignHospital,
} from "../services/adminClaimService";

const AssignHospitalModal = ({
  isOpen,
  onClose,
  claimId,
  onSuccess,
}) => {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalId, setHospitalId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHospitals();
    }
  }, [isOpen]);

  const fetchHospitals = async () => {
    try {
      const response = await getHospitals();
      setHospitals(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load hospitals."
      );
    }
  };

  const handleAssign = async () => {
    if (!hospitalId) {
      toast.error("Please select a hospital.");
      return;
    }

    try {
      setLoading(true);

      await assignHospital(claimId, hospitalId);

      toast.success("Hospital assigned successfully.");

      onSuccess();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Assignment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-6">
          Assign Hospital
        </h2>

        <select
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            Select Hospital
          </option>

          {hospitals.map((hospital) => (
            <option
              key={hospital._id}
              value={hospital._id}
            >
              {hospital.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AssignHospitalModal;