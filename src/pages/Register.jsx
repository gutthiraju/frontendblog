import React, { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../url";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${URL}/api/auth/register`,
        { username, email, password },
        { withCredentials: true }
      );

      // Check if the response exists. If your backend returns the user object, 
      // check for res.data._id or simply if res.data exists.
      if (res.data) {
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      
      // 🔥 CRASH PREVENTION: Extract only the string message
      const errorData = err.response?.data;
      let errorMessage = "Registration failed. Try again.";

      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData?.error && typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData?.message && typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-white shadow-sm">
        <h1 className="text-xl font-extrabold tracking-tight">
          <Link to="/">BLOGOSPHERE</Link>
        </h1>
        <Link to="/login" className="text-sm font-medium hover:text-blue-600 transition">Login</Link>
      </div>

      {/* Registration Form */}
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="flex flex-col w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
          <p className="text-gray-500 mb-8 text-sm">Join our community of writers and readers</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;