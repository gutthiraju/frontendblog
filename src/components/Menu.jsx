import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../url"; // Assuming you have a URL config file

function Menu({ setMenuOpen }) { // Added setMenuOpen to close menu on click
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      // 1. Attempt to notify the backend (optional for LocalStorage flow)
      await axios.get(`${URL}/api/auth/logout`, { withCredentials: true });
    } catch (err) {
      // We catch the 404 here so the app doesn't crash/stop
      console.log("Backend logout route not found, performing frontend logout.");
    } finally {
      // 2. THIS MUST RUN REGARDLESS OF THE SERVER RESPONSE
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // 3. Clear global state
      setUser(null);
      
      // 4. Close the menu dropdown
      if (setMenuOpen) setMenuOpen(false);
      
      // 5. Redirect to login
      navigate("/login");
    }
  };

  // Helper to close menu when clicking a link
  const closeMenu = () => {
    if (setMenuOpen) setMenuOpen(false);
  };

  return (
    <div className='bg-black w-[200px] z-10 flex flex-col items-start absolute top-12 right-0 md:right-0 rounded-md p-4 space-y-4 shadow-2xl border border-gray-800'>
      {!user ? (
        <>
          <h3 className='text-white text-sm hover:text-gray-400 cursor-pointer' onClick={closeMenu}>
            <Link to='/login'>Login</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-400 cursor-pointer' onClick={closeMenu}>
            <Link to='/register'>Register</Link>
          </h3>
        </>
      ) : (
        <>
          <h3 className='text-white text-sm hover:text-gray-400 cursor-pointer' onClick={closeMenu}>
            <Link to={'/profile/' + user._id}>Profile</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-400 cursor-pointer' onClick={closeMenu}>
            <Link to='/write'>Write</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-400 cursor-pointer' onClick={closeMenu}>
            <Link to={'/myblogs/' + user._id}>My Blogs</Link>
          </h3>
          <h3 
            className='text-red-500 text-sm hover:text-red-400 cursor-pointer font-bold pt-2 border-t border-gray-800 w-full' 
            onClick={handlelogout}
          >
            Logout
          </h3>
        </>
      )}
    </div>
  );
}

export default Menu;