import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { URL } from "../url"; // Ensure this matches your URL export file

function EditPost() {
  const { id: postId } = useParams();
  const { user, loading: authLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // Form States
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [prevPhoto, setPrevPhoto] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch post details on load
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${URL}/api/posts/${postId}`);
        setTitle(res.data.title);
        setDesc(res.data.desc);
        setCats(res.data.categories || []);
        setPrevPhoto(res.data.photo);
      } catch (err) {
        console.error("Fetch post error:", err);
      }
    };
    fetchPost();
  }, [postId]);

  // 2. Fix: Reliable Category Deletion (UI)
  const addCategory = () => {
    if (cat.trim() !== "") {
      setCats([...cats, cat.trim()]);
      setCat("");
    }
  };

  const deleteCategory = (index) => {
    const updatedCats = [...cats];
    updatedCats.splice(index, 1);
    setCats(updatedCats);
  };

  // 3. Update Post Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in!");

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };

    setIsUpdating(true);
    let imageName = prevPhoto;

    // Handle Image Upload if new file exists
    if (file) {
      const data = new FormData();
      const filename = Date.now() + "-" + file.name;
      data.append("img", filename);
      data.append("file", file);
      imageName = filename;

      try {
        await axios.post(`${URL}/api/upload`, data, config);
      } catch (err) {
        console.error("Image upload error:", err);
      }
    }

    const updatedPost = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
      photo: imageName,
    };

    try {
      const res = await axios.put(`${URL}/api/posts/${postId}`, updatedPost, config);
      navigate(`/posts/post/${res.data._id}`);
    } catch (err) {
      console.error("Update post error:", err.response?.data || err);
      alert("Failed to update post.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. Delete Post Logic (Full Removal)
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post forever?")) return;
    
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unauthorized or server error.");
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading user...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex justify-center py-10 px-4">
        <div className="bg-white p-6 md:p-10 border rounded-2xl shadow-xl w-full max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-bold text-2xl">Edit Your Post</h1>
            <button 
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700 font-semibold text-sm border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
            >
              Delete Post
            </button>
          </div>

          <form className="flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div className="flex flex-col">
              <label className="font-bold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col">
              <label className="font-bold text-gray-700 mb-2">Header Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
                {prevPhoto && !file && (
                  <span className="text-xs text-gray-400 italic">Current: {prevPhoto.substring(0, 15)}...</span>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col">
              <label className="font-bold text-gray-700 mb-2">Categories</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="e.g. Technology"
                  className="flex-grow px-4 py-2 border border-gray-200 rounded-xl outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                />
                <button 
                  type="button" 
                  onClick={addCategory} 
                  className="bg-gray-200 text-black px-6 py-2 rounded-xl font-bold hover:bg-black hover:text-white transition"
                >
                  Add
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap mt-4 gap-2">
                {cats.map((c, i) => (
                  <div key={i} className="flex items-center bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium">
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => deleteCategory(i)}
                      className="ml-2 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="font-bold text-gray-700 mb-2">Content</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={12}
                className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Write your story..."
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button 
                onClick={handleUpdate} 
                disabled={isUpdating}
                className="bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg flex-grow disabled:bg-gray-400"
              >
                {isUpdating ? "Saving Changes..." : "Update Post"}
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditPost;