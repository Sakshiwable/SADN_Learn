import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({ name: "", password: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("You must be logged in to view profile");
      navigate("/login");
      return;
    }

    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userData = res.data;
        if (userData.email === "sakshiwable0907@gmail.com") {
        userData.role = "Admin";
      }

      setUser(userData);
      setUpdatedData({ name: userData.name, password: "" });
      })
      .catch((err) => {
        console.error("Error fetching profile", err);
        toast.error("Failed to load profile");
      });
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      await api.put(
        "/auth/update",
        {
          name: updatedData.name,
          password: updatedData.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Profile updated!");
      setUser({ ...user, name: updatedData.name });
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("❌ Failed to update profile");
    }
  };

  if (!user)
    return (
      <div className="p-4 text-center font-serif text-orange-800">
        Loading profile...
      </div>
    );

  return (
    <div className="bg-orange-100 min-h-screen font-serif md:mt-12">
      <Navbar />
      <ToastContainer position="top-center" autoClose={2000} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-20 px-4 pb-12"
      >
        <div className="flex flex-col md:flex-row md:justify-start items-center gap-10">
          <img
            className="rounded-full md:h-[400px] md:w-[400px] w-40 h-40 mx-auto md:ml-48 hover:scale-125 duration-1000 ease-in-out transition-all shadow-2xl shadow-black"
            src="https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGljb25zfGVufDB8fDB8fHww"
            alt=""
          />

          <div className="flex flex-col w-full max-w-xl md:ml-20 mt-10 md:mt-0">
            <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left text-orange-900 mb-6 flex items-center gap-2">
              My Profile
            </h2>

            {!editMode ? (
              <div className="space-y-7 text-lg text-gray-800">
                <p>
                  <strong className="text-orange-900">Name:</strong> {user.name}
                </p>
                <p>
                  <strong className="text-orange-900">Email:</strong> {user.email}
                </p>
                <p>
                  <strong className="text-orange-900">Role:</strong> {user.role}
                </p>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-10 bg-orange-900 hover:bg-orange-800 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5h2M12 7v10m0 0h-2m2 0h2M5 12h2m10 0h2"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleUpdate}
                className="space-y-6 text-orange-900"
              >
                <div>
                  <label className="block mb-1 font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updatedData.name}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-orange-300 focus:ring-2 focus:ring-orange-500 bg-white shadow-inner"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={updatedData.password}
                    onChange={handleEditChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-xl border border-orange-300 focus:ring-2 focus:ring-orange-500 bg-white shadow-inner"
                  />
                  <p className="text-sm mt-3 text-orange-700">
                    Leave blank if you don’t want to change the password.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mt-4">
                  <button
                    type="submit"
                    className="bg-orange-900 text-white px-5 py-2 rounded-lg hover:bg-orange-800 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
