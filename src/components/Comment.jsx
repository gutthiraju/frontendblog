import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ 1. Add this for URL fallback
import { UserContext } from "../context/UserContext";
import Comment from "../components/Comment";

import { URL } from "../url";

function PostDetails({ postId: propPostId }) { // ✅ 2. Rename prop for clarity
  const { id: urlPostId } = useParams(); 
  const postId = propPostId || urlPostId; // ✅ 3. Use URL ID if Prop is missing

  const { user, loading: authLoading } = useContext(UserContext);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return; 
    try {
      const res = await axios.get(`${URL}/api/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.log("Fetch comments error:", err.response?.data || err);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!user) return alert("Please login to comment");
    if (!commentText.trim()) return alert("Comment cannot be empty");
    
    // ✅ 4. Final safety check before sending
    if (!postId) return alert("Error: Post ID not found. Try refreshing.");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        postId: postId,
        comment: commentText.trim(),
        author: user.username || user.name || "Anonymous", 
        userId: user._id || user.id,      
      };

      // DEBUG: If you get "Fields required", check this log in your browser!
      console.log("Sending to Backend:", payload);

      await axios.post(
        `${URL}/api/comments/create`,
        payload,
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );
      
      setCommentText("");
      fetchComments(); 
    } catch (err) {
      console.error("Comment submission error:", err.response?.data);
      alert(err.response?.data?.error || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="text-center py-10 text-gray-400 italic">Checking authentication...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-4 border-t border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-800">Comments ({comments.length})</h3>
        {user && <span className="text-xs text-gray-400 font-medium italic">Replying as @{user.username}</span>}
      </div>
      
      <div className="flex flex-col mb-10 bg-white">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={user ? "Share your thoughts..." : "Please login to post a comment"}
          disabled={!user || loading}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all resize-none shadow-sm placeholder:text-gray-300"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={loading || !user}
          className={`mt-3 px-8 py-2.5 rounded-xl font-bold text-white self-end transition-all transform active:scale-95 shadow-md ${
            loading || !user ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-gray-50 rounded-2xl">
            <p className="text-gray-400 text-sm italic">Be the first to join the conversation.</p>
          </div>
        ) : (
          comments.map((c) => (
            <Comment 
              key={c._id} 
              c={c} 
              onActionSuccess={fetchComments} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PostDetails;