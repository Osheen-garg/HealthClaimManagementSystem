import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import HospitalLayout from "../layouts/HospitalLayout";
import {
  getHospitalClaimById,
  verifyClaim,
} from "../services/hospitalService";

const HospitalClaimDetails = () => {
  const { id } = useParams();

  const [claim, setClaim] = useState(null);

  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaim();
  }, []);

  const fetchClaim = async () => {
    try {
      const response = await getHospitalClaimById(id);

      setClaim(response.data);

      setRemarks(response.data.hospitalRemarks || "");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch claim."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      await verifyClaim(id, {
        hospitalRemarks: remarks,
      });

      toast.success("Claim Verified Successfully");

      fetchClaim();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification Failed"
      );
    }
  };

  if (loading) {
    return (
      <HospitalLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>

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
              claim.status === "Hospital Verified"
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
              title="Address"
              value={claim.patient?.address}
            />

          </div>

        </div>
                <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Claim Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

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

          <p>
            {claim.diagnosis}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-4">
            Treatment Description
          </h2>

          <p>
            {claim.treatmentDescription}
          </p>

        </div>
                {/* Documents */}

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

        {/* Hospital Remarks */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Hospital Remarks
          </h2>

          <textarea
            rows={5}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter verification remarks..."
            className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={claim.status === "Hospital Verified"}
          />

        </div>

        {/* Verify Button */}

        {claim.status === "Hospital Assigned" && (

          <div className="flex justify-end">

            <button
              onClick={handleVerify}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Verify Claim
            </button>

          </div>

        )}

      </div>

    </HospitalLayout>

  );
};

const InfoCard = ({ title, value }) => {
  return (
    <div className="border rounded-lg p-4">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <p className="font-semibold mt-2">
        {value || "--"}
      </p>

    </div>
  );
};

export default HospitalClaimDetails;