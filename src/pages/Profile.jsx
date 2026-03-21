import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // State for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Get token from localStorage (Ensure key name matches your Login.jsx)
  const token = localStorage.getItem("token"); 

  // Helper for Headers
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch user profile on load
  useEffect(() => {
    // If no user in context, kick them to login
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${URL}/api/users/${user._id}`,
          authHeaders
        );
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.log("Fetch profile error:", err.response?.data || err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleForceLogout();
        } else {
          setError("Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Helper to clear everything if token is invalid/expired
  const handleForceLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Update user logic
  const handleUserUpdated = async () => {
    setUpdated(false);
    setError("");
    setActionLoading(true);

    try {
      const payload = { username, email };
      if (password) payload.password = password;

      const res = await axios.put(
        `${URL}/api/users/${user._id}`,
        payload,
        authHeaders
      );

      // 1. Update the Global Context so Navbar changes immediately
      const updatedUserData = { ...user, username, email };
      setUser(updatedUserData);

      // 2. Update LocalStorage so it stays updated on refresh
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      setUpdated(true);
      setPassword(""); // Clear password field for security
      console.log("Profile updated successfully");
    } catch (err) {
      console.log("Update error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update user");
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleForceLogout();
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user logic
  const handleUserDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmDelete) return;

    setError("");
    setActionLoading(true);

    try {
      await axios.delete(`${URL}/api/users/${user._id}`, authHeaders);
      handleForceLogout();
      navigate("/");
    } catch (err) {
      console.log("Delete error:", err.response?.data || err);
      setError("Failed to delete user account.");
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleForceLogout();
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <h3 className="font-bold text-xl">Loading profile...</h3>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center bg-gray-100 py-10">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Your Profile</h1>

          <div className="flex flex-col space-y-4">
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
            {updated && <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">Profile updated successfully!</p>}

            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded outline-none focus:border-black transition-colors"
                placeholder="Username"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded outline-none focus:border-black transition-colors"
                placeholder="Email"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1 ml-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded outline-none focus:border-black transition-colors"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="flex flex-col space-y-3 mt-6">
              <button
                onClick={handleUserUpdated}
                disabled={actionLoading}
                className={`w-full py-2 rounded font-bold text-white transition-all ${
                  actionLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {actionLoading ? "Updating..." : "Update Profile"}
              </button>

              <button
                onClick={handleUserDelete}
                disabled={actionLoading}
                className={`w-full py-2 rounded font-bold text-white transition-all ${
                  actionLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-700"
                }`}
              >
                {actionLoading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;