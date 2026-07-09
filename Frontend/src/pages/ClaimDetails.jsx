import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getClaimById } from "../services/claimService";

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    fetchClaim();
  }, []);

  const fetchClaim = async () => {
    try {
      setLoading(true);

      const response = await getClaimById(id);

      setClaim(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch claim details."
      );

      navigate("/my-claims");
    } finally {
      setLoading(false);
    }
  };

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

  if (!claim) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Claim Details
          </h1>

          <button
            onClick={() => navigate("/my-claims")}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Back
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <InfoCard
            title="Claim Number"
            value={claim.claimNumber}
          />

          <InfoCard
            title="Policy Number"
            value={claim.policy?.policyNumber}
          />

          <InfoCard
            title="Claim Amount"
            value={`₹${claim.claimAmount.toLocaleString()}`}
          />

          <InfoCard
            title="Status"
            value={
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  claim.status
                )}`}
              >
                {claim.status}
              </span>
            }
          />

          <InfoCard
            title="Admission Date"
            value={new Date(
              claim.admissionDate
            ).toLocaleDateString()}
          />

          <InfoCard
            title="Discharge Date"
            value={new Date(
              claim.dischargeDate
            ).toLocaleDateString()}
          />

                </div>

        {/* Diagnosis */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-3">
            Diagnosis
          </h2>

          <div className="border rounded-lg p-5 bg-gray-50">
            {claim.diagnosis}
          </div>

        </div>

        {/* Treatment Description */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-3">
            Treatment Description
          </h2>

          <div className="border rounded-lg p-5 bg-gray-50 whitespace-pre-line">
            {claim.treatmentDescription}
          </div>

        </div>

        {/* Hospital Information */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Hospital Information
          </h2>

          {claim.hospital ? (

            <div className="grid md:grid-cols-2 gap-5">

              <InfoCard
                title="Hospital Name"
                value={claim.hospital.name}
              />

              <InfoCard
                title="Hospital Email"
                value={claim.hospital.email}
              />

            </div>

          ) : (

            <div className="border rounded-lg p-5 bg-yellow-50 text-yellow-700">
              Hospital has not been assigned yet.
            </div>

          )}

        </div>

        {/* Agent Information */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Agent Information
          </h2>

          {claim.agent ? (

            <div className="grid md:grid-cols-2 gap-5">

              <InfoCard
                title="Agent Name"
                value={claim.agent.name}
              />

              <InfoCard
                title="Agent Email"
                value={claim.agent.email}
              />

            </div>

          ) : (

            <div className="border rounded-lg p-5 bg-yellow-50 text-yellow-700">
              Agent has not been assigned yet.
            </div>

          )}

        </div>

        {/* Approval */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Approval Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <InfoCard
              title="Approved Amount"
              value={`₹${claim.approvedAmount || 0}`}
            />

            <InfoCard
              title="Paid Date"
              value={
                claim.paidAt
                  ? new Date(claim.paidAt).toLocaleDateString()
                  : "Not Paid"
              }
            />

          </div>

        </div>

        {/* Rejection */}

        {claim.status === "Rejected" && (

          <div className="mt-8">

            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Rejection Reason
            </h2>

            <div className="border border-red-300 bg-red-50 rounded-lg p-5">
              {claim.rejectionReason || "No reason provided"}
            </div>

          </div>

        )}
                {/* Claim Timeline */}

        <div className="mt-10">

          <h2 className="text-2xl font-semibold mb-5">
            Claim Progress
          </h2>

          <div className="space-y-4">

            {[
              "Submitted",
              "Hospital Assigned",
              "Hospital Verified",
              "Agent Assigned",
              "Agent Reviewed",
              "Approved",
              "Paid",
            ].map((step) => {
              const completed =
                [
                  "Submitted",
                  "Hospital Assigned",
                  "Hospital Verified",
                  "Agent Assigned",
                  "Agent Reviewed",
                  "Approved",
                  "Paid",
                ].indexOf(claim.status) >=
                [
                  "Submitted",
                  "Hospital Assigned",
                  "Hospital Verified",
                  "Agent Assigned",
                  "Agent Reviewed",
                  "Approved",
                  "Paid",
                ].indexOf(step);

              return (
                <div
                  key={step}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`h-5 w-5 rounded-full ${
                      completed
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  />

                  <span
                    className={
                      completed
                        ? "font-semibold text-green-700"
                        : "text-gray-500"
                    }
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Documents */}
{/* 
        <div className="mt-10">

          <h2 className="text-2xl font-semibold mb-4">
            Uploaded Documents
          </h2>

          {claim.documents &&
          claim.documents.length > 0 ? (

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

                    <p className="text-sm text-gray-500">
                      Uploaded Document
                    </p>

                  </div>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View
                  </a>

                </div>

              ))}

            </div>

          ) : (

            <div className="border rounded-lg p-6 text-center text-gray-500">
              No documents uploaded.
            </div>

          )}

        </div> */}

      </div>

    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="border rounded-lg p-4 bg-gray-50">

    <p className="text-sm text-gray-500">
      {title}
    </p>

    <p className="mt-1 text-lg font-semibold">
      {value}
    </p>

  </div>
);

export default ClaimDetails;