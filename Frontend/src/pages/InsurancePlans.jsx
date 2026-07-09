import { useEffect, useState } from "react";
import {
  ShieldCheck,
  IndianRupee,
  Calendar,
  Building2,
  Clock3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import PatientLayout from "../layouts/PatientLayout";
import { getAllPlans } from "../services/planService";
import loadRazorpay from "../utils/loadRazorpay";
import {
  initiatePayment,
  verifyPayment,
} from "../services/paymentService";
import { useNavigate } from "react-router-dom";

function InsurancePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  
const handleBuyPlan = async (planId) => {
  try {
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Unable to load Razorpay");
      return;
    }

    const response = await initiatePayment(planId);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    const { key, order, plan } = response;

    const options = {
      key,

      amount: order.amount,

      currency: order.currency,

      name: "Health Claim Management System",

      description: plan.planName,

      order_id: order.id,

      handler: async function (paymentResponse) {
        try {
          const verifyResponse = await verifyPayment({
            razorpay_order_id:
              paymentResponse.razorpay_order_id,

            razorpay_payment_id:
              paymentResponse.razorpay_payment_id,

            razorpay_signature:
              paymentResponse.razorpay_signature,

            planId,
          });

          if (verifyResponse.success) {
            toast.success("Payment Successful");

            navigate("/payment-success");
          } else {
            toast.error("Payment Verification Failed");
          }
        } catch (error) {
            console.log(error)
          toast.error("Verification Failed");
        }
      },

      prefill: {
        name: "",
        email: "",
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
        "Unable to initiate payment"
    );
  }
};

  const fetchPlans = async () => {
    try {
      const response = await getAllPlans();

      console.log(response);

      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to fetch insurance plans"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto py-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Insurance Plans
          </h1>

          <p className="text-gray-500 mt-3">
            Choose the best health insurance plan for you and your family.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xl font-semibold">
            Loading Insurance Plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            No Insurance Plans Available
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition duration-300"
              >
                {/* Header */}

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="text-3xl font-bold text-blue-700">
                      {plan.planName}
                    </h2>

                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <Building2 size={18} />

                      {plan.insuranceCompany}
                    </div>

                  </div>

                  <ShieldCheck
                    size={60}
                    className="text-blue-600"
                  />

                </div>

                {/* Plan Details */}

                <div className="grid grid-cols-2 gap-5 mt-8">

                  <div className="bg-blue-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Coverage
                    </p>

                    <p className="font-bold text-xl flex items-center mt-2">
                      <IndianRupee size={20} />

                      {plan.coverageAmount.toLocaleString()}
                    </p>

                  </div>

                  <div className="bg-green-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Premium
                    </p>

                    <p className="font-bold text-xl flex items-center mt-2">
                      <IndianRupee size={20} />

                      {plan.premium.toLocaleString()}
                    </p>

                  </div>

                  <div className="bg-yellow-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Validity
                    </p>

                    <p className="font-bold text-lg flex items-center mt-2">
                      <Calendar size={18} className="mr-2" />

                      {plan.validity} Months
                    </p>

                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Waiting Period
                    </p>

                    <p className="font-bold text-lg flex items-center mt-2">
                      <Clock3 size={18} className="mr-2" />

                      {plan.waitingPeriod} Days
                    </p>

                  </div>

                </div>

                {/* Plan Type */}

                <div className="mt-6">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {plan.planType}
                  </span>
                </div>

                {/* Benefits */}

                <div className="mt-8">

                  <h3 className="text-xl font-semibold mb-4 text-green-700">
                    Benefits
                  </h3>

                  <div className="space-y-3">

                    {plan.benefits?.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle
                          size={20}
                          className="text-green-600"
                        />

                        <span>{benefit}</span>
                      </div>
                    ))}

                  </div>

                </div>

                {/* Exclusions */}

                <div className="mt-8">

                  <h3 className="text-xl font-semibold mb-4 text-red-600">
                    Exclusions
                  </h3>

                  <div className="space-y-3">

                    {plan.exclusions?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <XCircle
                          size={20}
                          className="text-red-500"
                        />

                        <span>{item}</span>
                      </div>
                    ))}

                  </div>

                </div>

                {/* Buy Button */}

               <button
  onClick={() => handleBuyPlan(plan._id)}
  className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition duration-300"
>
  Buy Now
</button>

              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default InsurancePlans;