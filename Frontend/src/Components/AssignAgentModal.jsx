import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAgents,
  assignAgent,
} from "../services/adminClaimService";

const AssignAgentModal = ({
  isOpen,
  onClose,
  claimId,
  onSuccess,
}) => {
  const [agents, setAgents] = useState([]);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    try {
      const response = await getAgents();

      setAgents(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load agents."
      );
    }
  };

  const handleAssign = async () => {
    if (!agentId) {
      return toast.error("Please select an agent.");
    }

    try {
      setLoading(true);

      await assignAgent(claimId, agentId);

      toast.success("Agent assigned successfully.");

      onSuccess();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to assign agent."
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
          Assign Agent
        </h2>

        <select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            Select Agent
          </option>

          {agents.map((agent) => (
            <option
              key={agent._id}
              value={agent._id}
            >
              {agent.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
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

export default AssignAgentModal;