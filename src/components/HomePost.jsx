import { useNavigate } from "react-router-dom";
import axios from "axios";

import { URL } from "../url";

function HomePosts({ post, user, fetchPosts }) {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to delete a post.");
      return;
    }

    // 2. Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      // 3. Pass the token in the Headers (Note: headers is the 2nd argument in DELETE)
      const res = await axios.delete(`${URL}/api/posts/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        withCredentials: true,
      });

      console.log("Post deleted:", res.data);
      // 4. Trigger the parent function to refresh the list
      fetchPosts(); 
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        alert("You are not authorized to delete this post.");
      } else {
        alert("Failed to delete the post.");
      }
    }
  };

  return (
    <div className="border p-4 rounded relative bg-white shadow-sm hover:shadow-md transition-shadow">
      {post.photo && (
        <img
          src={`${URL}/images/${post.photo}`}
          alt="post"
          className="w-full h-60 object-cover mb-3 rounded"
        />
      )}

      <h2
        className="cursor-pointer font-bold text-xl hover:text-gray-700"
        onClick={() => navigate(`/posts/post/${post._id}`)}
      >
        {post.title}
      </h2>

      <p className="text-gray-600 line-clamp-3 mt-2">{post.desc}</p>

      {/* 5. Improved ownership check to prevent crashes if user is null */}
      {user && user._id.toString() === post.userId.toString() && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
            onClick={() => navigate(`/edit/${post._id}`)}
          >
            Edit
          </button>
          <button
            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition"
            onClick={() => handleDelete(post._id)}
          >
            Delete
          </button>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400">
        By <span className="font-semibold">{post.username}</span> • {new Date(post.createdAt).toDateString()}
      </div>
    </div>
  );
}

export default HomePosts;