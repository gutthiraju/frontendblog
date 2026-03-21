import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ Added to catch IDs from URL
import { UserContext } from "../context/UserContext";
import { URL } from "../url";



function PostDetails({ postId: propPostId }) {
  const { id: urlPostId } = useParams(); // ✅ Fallback if prop is missing
  const postId = propPostId || urlPostId; 

  const { user, loading: authLoading } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };
  }, []);

  const fetchComments = useCallback(async () => {
    if (!postId) return; // ✅ Prevent fetching if ID is still null
    try {
      const res = await axios.get(`${URL}/api/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!commentText.trim()) return alert("Comment cannot be empty");
    
    // ✅ Stronger check for postId
    if (!postId) {
      console.error("PostID missing in State:", { propPostId, urlPostId });
      return alert("Error: Post ID not found. Please refresh the page.");
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${URL}/api/comments/${editingId}`,
          { comment: commentText.trim() },
          getAuthHeaders()
        );
        setEditingId(null);
      } else {
        const payload = {
          postId: postId,
          comment: commentText.trim(),
          userId: user._id || user.id,
          author: user.username || user.name || "User",
        };

        await axios.post(`${URL}/api/comments/create`, payload, getAuthHeaders());
      }
      setCommentText("");
      fetchComments();
    } catch (err) {
      const serverError = err.response?.data?.error || "Fields missing or unauthorized";
      console.error("Submission error details:", err.response?.data);
      alert(serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      await axios.delete(`${URL}/api/comments/${id}`, getAuthHeaders());
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete comment");
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setCommentText(c.comment);
    const inputArea = document.getElementById("comment-textarea");
    inputArea?.focus();
    inputArea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (authLoading) return <div className="text-center py-10 text-gray-400">Verifying credentials...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-4 border-t border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-800">Discussion ({comments.length})</h3>
        {user && (
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs text-gray-500 font-medium">@{user.username || user.name}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col mb-8 bg-white transition-all duration-300">
        <textarea
          id="comment-textarea"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={user ? (editingId ? "Editing your comment..." : "Add to the discussion...") : "Please login to comment"}
          disabled={!user || loading}
          className={`w-full p-4 border rounded-xl outline-none transition-all resize-none shadow-sm placeholder:text-gray-300 ${
            editingId ? "border-blue-400 ring-2 ring-blue-50" : "border-gray-200 focus:ring-2 focus:ring-black"
          }`}
          rows={3}
        />
        <div className="flex justify-end space-x-2 mt-3">
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setCommentText(""); }}
              className="px-6 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all text-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !user}
            className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-md ${
              loading || !user ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "..." : editingId ? "Update" : "Post"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-sm italic">No thoughts shared yet.</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="group p-5 border border-transparent rounded-2xl hover:bg-gray-50/80 transition-all border-b border-gray-50 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                    {c.author ? c.author[0].toUpperCase() : "?"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-none">@{c.author}</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {user && c.userId && (user._id?.toString() === c.userId.toString() || user.id?.toString() === c.userId.toString()) && (
                  <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={() => startEdit(c)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-gray-300 hover:text-red-500">Delete</button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed ml-12 whitespace-pre-wrap">{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostDetails;