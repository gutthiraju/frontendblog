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
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res?.data?.token) {
        // 1. Persistence: Save to LocalStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // 2. Immediate UI update: Update Context
        setUser(res.data.user);
        setToken(res.data.token);

        // 3. Success! Go home
        navigate("/"); 
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || 
        err.response?.data || 
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ PRO-TIP: Allow user to press "Enter" to login
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-white shadow-sm">
        <h1 className="text-xl font-extrabold tracking-tight">
          <Link to="/">BLOGOSPHERE</Link>
        </h1>
        <Link to="/register" className="text-sm font-medium hover:text-blue-600 transition">Register</Link>
      </div>

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