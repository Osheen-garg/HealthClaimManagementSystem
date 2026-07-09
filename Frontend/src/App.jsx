import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InsurancePlans from "./pages/InsurancePlans";
import MyPolicies from "./pages/MyPolicies";
import PolicyDetails from "./pages/PolicyDetails";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import SubmitClaim from "./pages/SubmitClaim";
import MyClaims from "./pages/MyClaims";
import ClaimDetails from "./pages/ClaimDetails";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

import AdminInsurancePlans from "./adminPage/AdminInsurancePlans";
import CreateInsurancePlan from "./adminPage/CreateInsurancePlan";
import EditInsurancePlan from "./adminPage/EditInsurancePlan";
import InsurancePlanDetails from "./adminPage/InsurancePlanDetails";
import AdminClaims from "./adminPage/AdminClaims";
import AdminClaimDetails from "./adminPage/AdminClaimDetails";
import AdminDashboard from "./adminPage/AdminDashboard";
import CreateUser from "./adminPage/CreateUser";
import UsersList from "./adminPage/UsersList";
import EditUser from "./adminPage/EditUser";

import HospitalDashboard from "./hospitalPages/HospitalDashboard";
import HospitalClaims from "./hospitalPages/HospitalClaims";
import HospitalClaimDetails from "./hospitalPages/HospitalClaimDetails";

import AgentDashboard from "./agentPages/AgentDashboard";
import AgentClaims from "./agentPages/AgentClaims";
import AgentClaimDetails from "./agentPages/AgentClaimDetails";
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plans"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <InsurancePlans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-policies"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyPolicies />
          </ProtectedRoute>
        }
      />

      <Route
  path="/policies/:id"
  element={
    <ProtectedRoute roles={["patient"]}>
      <PolicyDetails />
    </ProtectedRoute>
  }
/>

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              "patient",
              "admin",
              "agent",
              "hospital",
            ]}
          >
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-success"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      <Route
  path="/submit-claim"
  element={
    <ProtectedRoute allowedRoles={["patient"]}>
      <SubmitClaim />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-claims"
  element={
    <ProtectedRoute allowedRoles={["patient"]}>
      <MyClaims />
    </ProtectedRoute>
  }
/>

<Route
  path="/claims/:id"
  element={
    <ProtectedRoute allowedRoles={["patient"]}>
      <ClaimDetails />
    </ProtectedRoute>
  }
/>

      {/* Unauthorized */}
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

      <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users/create"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CreateUser />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users/edit/:id"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <EditUser />
    </ProtectedRoute>
  }
/>
      <Route
        path="/admin/plans"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminInsurancePlans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/plans/create"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateInsurancePlan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/plans/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditInsurancePlan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/plans/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <InsurancePlanDetails />
          </ProtectedRoute>
        }
      />

      <Route
  path="/admin/claims"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminClaims />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/claims/:id"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminClaimDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <UsersList />
    </ProtectedRoute>
  }
/>


<Route
  path="/hospital/dashboard"
  element={
    <ProtectedRoute allowedRoles={["hospital"]}>
      <HospitalDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/hospital/claims"
  element={
    <ProtectedRoute allowedRoles={["hospital"]}>
      <HospitalClaims />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/claims/:id"
  element={
    <ProtectedRoute allowedRoles={["hospital"]}>
      <HospitalClaimDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/dashboard"
  element={
    <ProtectedRoute allowedRoles={["agent"]}>
      <AgentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/claims"
  element={
    <ProtectedRoute allowedRoles={["agent"]}>
      <AgentClaims />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/claims/:id"
  element={
    <ProtectedRoute allowedRoles={["agent"]}>
      <AgentClaimDetails />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;