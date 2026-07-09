import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

        <CheckCircle
          size={90}
          className="text-green-600 mx-auto"
        />

        <h1 className="text-4xl font-bold mt-5">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-4">
          Your insurance policy has been activated.
        </p>

        <Link
          to="/my-policies"
          className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700"
        >
          View My Policies
        </Link>

      </div>

    </div>
  );
}

export default PaymentSuccess;