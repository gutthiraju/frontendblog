import React, { useState, useContext } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(UserContext);

  const handleLogin = async () => {
    // 1. Basic Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 2. API Call
      const res = await axios.post(
        `${URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // 3. Success Handling
      if (res.data) {
        // Get user and token from response (adjust based on your backend structure)
        const userData = res.data.user || res.data;
        const userToken = res.data.token;

        // Save to LocalStorage so the session survives page refreshes
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update Global Context
        setUser(userData);
        setToken(userToken);

        // Redirect to Home
        navigate("/"); 
      }
    } catch (err) {
      // 4. 🔥 THE FIX: Prevent React Error #31
      // We extract ONLY the error string. We never pass the whole 'err' object to setError.
      const errorData = err.response?.data;
      let errorMessage = "Invalid email or password"; // Default fallback

      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData?.error && typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData?.message && typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      }

      setError(errorMessage);
      console.error("Login failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Allow user to press "Enter" to login
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navbar */}
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-white shadow-sm">
        <h1 className="text-xl font-extrabold tracking-tight">
          <Link to="/">BLOGOSPHERE</Link>
        </h1>
        <Link to="/register" className="text-sm font-medium hover:text-blue-600 transition">Register</Link>
      </div>

      {/* Login Card */}
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="flex flex-col w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8 text-sm">Enter your credentials to access your account</p>

          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600 text-xs text-center font-semibold">{error}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              New here? <Link to="/register" className="text-black font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;