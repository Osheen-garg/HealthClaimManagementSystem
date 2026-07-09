import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import AgentLayout from "../layouts/AgentLayout";
import {
  getClaimById,
  reviewClaim,
} from "../services/agentService";

const AgentClaimDetails = () => {
  const { id } = useParams();

  const [claim, setClaim] = useState(null);

  const [loading, setLoading] = useState(true);

  const [recommendation, setRecommendation] = useState("Approve");

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchClaim();
  }, []);

  const fetchClaim = async () => {
    try {
      const response = await getClaimById(id);

      setClaim(response.data);

      setRecommendation(
        response.data.agentRecommendation || "Approve"
      );

      setRemarks(response.data.agentRemarks || "");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch claim."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    try {
      await reviewClaim(id, {
        recommendation,
        remarks,
      });

      toast.success("Review Submitted");

      fetchClaim();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit review."
      );
    }
  };

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>

      <div className="space-y-8">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Claim Details
            </h1>

            <p className="text-gray-500 mt-2">
              {claim.claimNumber}
            </p>

          </div>

          <span
            className={`px-4 py-2 rounded-full font-semibold
            ${
              claim.status === "Agent Reviewed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {claim.status}
          </span>

        </div>

                <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Patient Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <InfoCard
              title="Patient Name"
              value={claim.patient?.name}
            />

            <InfoCard
              title="Email"
              value={claim.patient?.email}
            />

            <InfoCard
              title="Phone"
              value={claim.patient?.phone}
            />

            <InfoCard
              title="Policy Number"
              value={claim.policy?.policyNumber}
            />

            <InfoCard
              title="Claim Amount"
              value={`₹${claim.claimAmount}`}
            />

            <InfoCard
              title="Status"
              value={claim.status}
            />

          </div>

        </div>

                <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Diagnosis
          </h2>

          <p className="text-gray-700">
            {claim.diagnosis}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-4">
            Treatment Description
          </h2>

          <p className="text-gray-700 whitespace-pre-line">
            {claim.treatmentDescription}
          </p>

        </div>

                {/* Uploaded Documents */}

        {/* <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Uploaded Documents
          </h2>

          {claim.documents && claim.documents.length > 0 ? (

            <div className="space-y-4">

              {claim.documents.map((doc, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center border rounded-lg p-4"
                >

                  <div>

                    <h3 className="font-semibold">
                      {doc.documentType}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Medical Document
                    </p>

                  </div>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </a>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No documents uploaded.
            </p>

          )}

        </div> */}

        {/* Review Form */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Agent Review
          </h2>

          <div className="space-y-5">

            <div>

              <label className="block font-semibold mb-2">
                Recommendation
              </label>

              <select
                value={recommendation}
                onChange={(e) =>
                  setRecommendation(e.target.value)
                }
                disabled={claim.status === "Agent Reviewed"}
                className="w-full border rounded-lg p-3"
              >
                <option value="Approve">
                  Approve
                </option>

                <option value="Reject">
                  Reject
                </option>

              </select>

            </div>

            <div>

              <label className="block font-semibold mb-2">
                Remarks
              </label>

              <textarea
                rows={5}
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
                disabled={claim.status === "Agent Reviewed"}
                placeholder="Enter your review..."
                className="w-full border rounded-lg p-4"
              />

            </div>

          </div>

        </div>

        {/* Submit Button */}

        {claim.status === "Agent Assigned" && (

          <div className="flex justify-end">

            <button
              onClick={handleReview}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Submit Review
            </button>

          </div>

        )}

      </div>

    </AgentLayout>

  );
};

const InfoCard = ({ title, value }) => {
  return (
    <div className="border rounded-lg p-4">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="font-semibold mt-2">
        {value || "--"}
      </p>

    </div>
  );
};

export default AgentClaimDetails;