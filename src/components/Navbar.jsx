// components/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const [prompt, setPrompt] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useContext(UserContext); // Ensure loading is passed from Context
  const navigate = useNavigate();
  const path = useLocation().pathname;

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearch = () => {
    navigate(prompt ? `?search=${prompt}` : "/");
  };

  return (
    <div className="bg-black text-white">
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 relative">
        {/* Logo */}
        <h1 className="text-lg md:text-xl font-extrabold">
          <Link to="/">Blogosphere</Link>
        </h1>

        {/* Search bar on home page */}
        {path === "/" && (
          <div className="flex justify-center items-center space-x-0">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Search a post"
              className="outline-none rounded-l-xl px-3 py-1 text-black bg-white w-full max-w-[150px] md:max-w-full"
            />
            <button
              onClick={handleSearch}
              className="cursor-pointer p-2 bg-white text-black rounded-r-xl border-l border-gray-200"
            >
              <BsSearch />
            </button>
          </div>
        )}

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!loading && (
            user?._id ? ( // Strictly check for _id to avoid "empty object" truthy bugs
              <>
                <Link to="/write" className="hover:underline">Write</Link>
                <div className="relative">
                  <p onClick={toggleMenu} className="cursor-pointer text-lg">
                    <FaBars />
                  </p>
                  {/* Positioned Menu */}
                  {menuOpen && <Menu setMenuOpen={setMenuOpen} />}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            )
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          {!loading && (
            user?._id ? (
              <div className="relative">
                <p onClick={toggleMenu} className="cursor-pointer text-lg">
                  <FaBars />
                </p>
                {/* Fixed the Mobile logic to check _id same as desktop */}
                {menuOpen && <Menu setMenuOpen={setMenuOpen} />}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:underline text-sm">Login</Link>
                <Link to="/register" className="hover:underline text-sm">Register</Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;