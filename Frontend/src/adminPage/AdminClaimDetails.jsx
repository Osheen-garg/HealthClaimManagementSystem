import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import AdminLayout from "../layouts/AdminLayout";

import {
  getClaimById,
  payClaim,
} from "../services/adminClaimService";

import AssignHospitalModal from "../Components/AssignHospitalModal";
import AssignAgentModal from "../Components/AssignAgentModal";
import ApproveClaimModal from "../Components/ApproveClaimModal";
import RejectClaimModal from "../Components/RejectClaimModal";

const AdminClaimDetails = () => {
  const { id } = useParams();

  const [claim, setClaim] = useState(null);

  const [loading, setLoading] = useState(true);

   const [showAssignHospitalModal, setShowAssignHospitalModal] =
  useState(false);

   const [showAssignAgentModal, setShowAssignAgentModal] =
  useState(false);
  const [showApproveModal, setShowApproveModal] =
  useState(false);
  const [showRejectModal, setShowRejectModal] =
  useState(false);

  useEffect(() => {
    fetchClaim();
  }, []);

  const fetchClaim = async () => {
    try {
      const response = await getClaimById(id);

      setClaim(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch claim."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="space-y-8">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Claim Details
            </h1>

            <p className="text-gray-500 mt-1">
              {claim.claimNumber}
            </p>

          </div>

          <span
            className={`px-4 py-2 rounded-full font-semibold
            ${
              claim.status === "Approved"
                ? "bg-green-100 text-green-700"
                : claim.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : claim.status === "Paid"
                ? "bg-emerald-100 text-emerald-700"
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
              title="Policy Number"
              value={claim.policy?.policyNumber}
            />

            <InfoCard
              title="Claim Amount"
              value={`₹${claim.claimAmount}`}
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

        </div>
                <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Diagnosis
          </h2>

          <p className="text-gray-700">
            {claim.diagnosis}
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">
            Treatment Description
          </h2>

          <p className="text-gray-700 whitespace-pre-line">
            {claim.treatmentDescription}
          </p>

        </div>
                {/* Hospital Information */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Hospital Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <InfoCard
              title="Hospital"
              value={claim.hospital?.name || "Not Assigned"}
            />

            <InfoCard
              title="Verified By"
              value={claim.verifiedBy?.name || "--"}
            />

            <InfoCard
              title="Verified Date"
              value={
                claim.verifiedAt
                  ? new Date(
                      claim.verifiedAt
                    ).toLocaleDateString()
                  : "--"
              }
            />

          </div>

          {claim.hospitalRemarks && (

            <div className="mt-6">

              <h3 className="font-semibold mb-2">
                Hospital Remarks
              </h3>

              <p className="text-gray-700">
                {claim.hospitalRemarks}
              </p>

            </div>

          )}

        </div>

        {/* Agent Information */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Agent Review
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <InfoCard
              title="Assigned Agent"
              value={claim.agent?.name || "Not Assigned"}
            />

            <InfoCard
              title="Recommendation"
              value={claim.agentRecommendation}
            />

            <InfoCard
              title="Reviewed By"
              value={claim.reviewedBy?.name || "--"}
            />

            <InfoCard
              title="Reviewed Date"
              value={
                claim.reviewedAt
                  ? new Date(
                      claim.reviewedAt
                    ).toLocaleDateString()
                  : "--"
              }
            />

          </div>

          {claim.agentRemarks && (

            <div className="mt-6">

              <h3 className="font-semibold mb-2">
                Agent Remarks
              </h3>

              <p className="text-gray-700">
                {claim.agentRemarks}
              </p>

            </div>

          )}

        </div>

        {/* Documents */}

        {/* <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Uploaded Documents
          </h2>

          {claim.documents.length > 0 ? (

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
                      Uploaded Medical Document
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

            <p className="text-gray-500">
              No documents uploaded.
            </p>

          )}

        </div> */}
                {/* Admin Actions */}

        {/* Admin Actions */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold mb-6">
    Admin Actions
  </h2>

  <div className="flex flex-wrap gap-4">

    {/* Assign Hospital */}

    {!claim.hospital && (
      <>
        <button
          onClick={() => setShowAssignHospitalModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Assign Hospital
        </button>

        <AssignHospitalModal
          isOpen={showAssignHospitalModal}
          onClose={() => setShowAssignHospitalModal(false)}
          claimId={claim._id}
          onSuccess={fetchClaim}
        />
      </>
    )}

    {/* Assign Agent */}

    {claim.hospital && !claim.agent && (
      <>
        <button
          onClick={() => setShowAssignAgentModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg"
        >
          Assign Agent
        </button>

        <AssignAgentModal
          isOpen={showAssignAgentModal}
          onClose={() => setShowAssignAgentModal(false)}
          claimId={claim._id}
          onSuccess={fetchClaim}
        />
      </>
    )}

    {/* Approve Claim */}

    {claim.status === "Agent Reviewed" && (
      <>
        <button
          onClick={() => setShowApproveModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
        >
          Approve Claim
        </button>

        <ApproveClaimModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          claimId={claim._id}
          onSuccess={fetchClaim}
        />
      </>
    )}

    {/* Reject Claim */}

    {claim.status !== "Rejected" &&
      claim.status !== "Approved" &&
      claim.status !== "Paid" && (
        <>
          <button
            onClick={() => setShowRejectModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg"
          >
            Reject Claim
          </button>

          <RejectClaimModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            claimId={claim._id}
            onSuccess={fetchClaim}
          />
        </>
      )}

    {/* Mark as Paid */}

    {claim.status === "Approved" && (
      <button
        onClick={async () => {
          try {
            await payClaim(claim._id);

            toast.success("Claim marked as Paid.");

            fetchClaim();
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Unable to mark claim as paid."
            );
          }
        }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg"
      >
        Mark as Paid
      </button>
    )}

  </div>

</div>
</div>

    </AdminLayout>

  );
};

const InfoCard = ({ title, value }) => (
  <div className="border rounded-lg p-4">

    <h3 className="text-gray-500 text-sm">
      {title}
    </h3>

    <p className="font-semibold mt-1">
      {value || "--"}
    </p>

  </div>
);

export default AdminClaimDetails;