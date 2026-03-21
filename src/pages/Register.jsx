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
      console.log("Sending:", { username, email, password });

      const res = await axios.post(
        `{URL}/api/auth/register`,
        { username, email, password },
        { withCredentials: true }
      );

      if (res?.data?.user?._id) {
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        // Redirect to login page
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
        <h1 className="text-lg md:text-xl">
          <Link to="/">Blogosphere</Link>
        </h1>
        <h3>
          <Link to="/login">Login</Link>
        </h3>
      </div>

      {/* Registration Form */}
      <div className="flex-grow flex justify-center items-center bg-gray-100">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%] bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-left w-full">Create an Account</h1>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
          />

          <button
            onClick={handleRegister}
            disabled={!username || !email || !password || loading}
            className={`w-full px-4 py-3 text-lg font-bold text-white rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-center items-center space-x-2 mt-2">
            <p>Already have an account?</p>
            <Link
              to="/login"
              className="text-black font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;