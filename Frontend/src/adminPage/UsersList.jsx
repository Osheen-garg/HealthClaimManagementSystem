import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AdminLayout from "../layouts/AdminLayout";
import {
  getUsers,
  deleteUser,
} from "../services/adminClaimService";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, role]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      setUsers(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let data = [...users];

    if (search) {
      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      data = data.filter((user) => user.role === role);
    }

    setFilteredUsers(data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      toast.success("User deleted successfully.");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete user."
      );
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

      <div className="space-y-6">

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            Manage Users
          </h1>

          <Link
            to="/admin/users/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            + Create User
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg p-3"
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="border rounded-lg p-3"
            >
              <option value="">
                All Roles
              </option>

              <option value="hospital">
                Hospital
              </option>

              <option value="agent">
                Agent
              </option>

            </select>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      {user.phone || "--"}
                    </td>

                    <td className="p-4 capitalize">
                      {user.role}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/admin/users/edit/${user._id}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No users found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
};

export default UsersList;