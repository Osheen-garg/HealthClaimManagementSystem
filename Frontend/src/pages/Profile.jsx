import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import { toast } from "react-toastify";

import PatientLayout from "../layouts/PatientLayout";
import { getProfile, updateProfile } from "../services/userService";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      if (response.success) {
        setFormData({
          name: response.user.name || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
          address: response.user.address || "",
          role: response.user.role || "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (response.success) {
        toast.success(response.message);

        setFormData((prev) => ({
          ...prev,
          name: response.user.name,
          phone: response.user.phone,
          address: response.user.address,
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Profile update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="text-center text-xl mt-10">
          Loading Profile...
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto py-8">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Header */}

          <div className="bg-blue-600 text-white p-8 flex flex-col items-center">

            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg">

              <User
                size={55}
                className="text-blue-600"
              />

            </div>

            <h1 className="text-3xl font-bold mt-5">
              {formData.name}
            </h1>

            <p className="mt-2 capitalize">
              {formData.role}
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="p-8"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {/* Name */}

              <div>

                <label className="font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Email */}

              <div>

                <label className="font-semibold mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full border rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed"
                />

              </div>

              {/* Phone */}

              <div>

                <label className="font-semibold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Role */}

              <div>

                <label className="font-semibold mb-2 flex items-center gap-2">
                  <Shield size={18} />
                  Role
                </label>

                <input
                  type="text"
                  value={formData.role}
                  readOnly
                  className="w-full border rounded-xl px-4 py-3 bg-gray-100 capitalize cursor-not-allowed"
                />

              </div>

            </div>

            {/* Address */}

            <div className="mt-6">

              <label className="font-semibold mb-2 flex items-center gap-2">
                <MapPin size={18} />
                Address
              </label>

              <textarea
                rows={4}
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Save Button */}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Profile"}
            </button>

          </form>

        </div>

      </div>
    </PatientLayout>
  );
}

export default Profile;