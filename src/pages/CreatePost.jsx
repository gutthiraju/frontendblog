import React, { useState, useContext } from 'react';
import Footer from "../components/Footer";
import { ImCross } from 'react-icons/im';
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const addCategory = () => {
    if (cat.trim() !== "") {
      setCats([...cats, cat]);
      setCat("");
    }
  };

  const deleteCategory = (i) => {
    setCats(cats.filter((_, index) => index !== i));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a post");
      return;
    }

    // 1. Get a fresh token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      return navigate("/login");
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };

    let uploadedFileName = "";

    // 2. Handle Image Upload first (if file exists)
    if (file) {
      const data = new FormData();
      const filename = Date.now() + "-" + file.name; // Added hyphen for readability
      data.append("img", filename);
      data.append("file", file);
      
      try {
        const imgRes = await axios.post(`${URL}/api/upload`, data, config);
        uploadedFileName = imgRes.data.filename;
      } catch (err) {
        console.error("Image upload failed:", err);
        // We don't stop here, but the post won't have a photo
      }
    }

    // 3. Prepare the final post object
    const newPost = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
      photo: uploadedFileName // Assign the result of the upload
    };

    // 4. Create the Post
    try {
      const res = await axios.post(`${URL}/api/posts/create`, newPost, config);
      
      // Navigate to the newly created post
      // Adjust this path if your route is different (e.g., /post/:id)
      navigate("/posts/post/" + res.data._id); 
    } catch (err) {
      console.error("Post creation error:", err.response?.data || err);
      if (err.response?.status === 401) {
        alert("Authorization failed. Please log out and log in again.");
      } else {
        alert("Failed to create post. Check all fields.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className='flex-grow flex justify-center py-10 bg-gray-50'>
        <div className='px-6 py-8 bg-white border rounded-lg flex flex-col w-[90%] md:w-[70%] shadow-lg'>
          <h1 className='font-bold text-2xl mb-6 text-center'>Create a New Post</h1>

          <form className='flex flex-col space-y-6'>
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Title</label>
              <input 
                onChange={(e) => setTitle(e.target.value)} 
                type="text" 
                placeholder='Enter post title' 
                className='px-4 py-2 border rounded outline-none focus:border-black' 
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Upload Thumbnail</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                className='px-4 py-2 border rounded bg-gray-50 text-sm' 
              />
            </div>

            <div className='flex flex-col space-y-3'>
              <label className="font-semibold mb-1">Categories</label>
              <div className='flex items-center space-x-4'>
                <select 
                  className="border rounded px-3 py-2 outline-none flex-grow"
                  value={cat} 
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Big Data">Big Data</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Business">Business</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Databases">Databases</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
                <button 
                  type="button"
                  onClick={addCategory} 
                  className="bg-black text-white px-6 py-2 font-semibold rounded hover:bg-gray-800 transition"
                >
                  ADD
                </button>
              </div>

              <div className='flex flex-wrap gap-2'>
                {cats?.map((c, i) => (
                  <div key={i} className='flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-full text-sm'>
                    <p>{c}</p>
                    <p onClick={() => deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-[10px]'>
                      <ImCross />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Description</label>
              <textarea 
                onChange={(e) => setDesc(e.target.value)} 
                rows={10} 
                className='px-4 py-2 border rounded outline-none focus:border-black' 
                placeholder='Tell your story...' 
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!user}
              className={`bg-black w-full md:w-[30%] mx-auto text-white font-bold px-4 py-3 rounded-lg hover:bg-gray-800 transition ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Publish Post
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreatePost;