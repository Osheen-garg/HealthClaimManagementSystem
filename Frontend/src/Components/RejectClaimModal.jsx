import { useState } from "react";
import { toast } from "react-toastify";
import { rejectClaim } from "../services/adminClaimService";

const RejectClaimModal = ({
  isOpen,
  onClose,
  claimId,
  onSuccess,
}) => {
  const [rejectionReason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return toast.error("Please enter rejection reason.");
    }

    try {
      setLoading(true);

     await rejectClaim(claimId, rejectionReason);

      toast.success("Claim rejected successfully.");

      setReason("");

      onSuccess();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reject claim."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Reject Claim
        </h2>

        <label className="block font-semibold mb-2">
          Rejection Reason
        </label>

        <textarea
          rows={5}
          value={rejectionReason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for rejecting this claim..."
          className="w-full border rounded-lg p-3 resize-none"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Rejecting..." : "Reject Claim"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default RejectClaimModal;