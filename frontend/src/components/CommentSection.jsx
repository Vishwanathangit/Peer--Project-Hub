import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/useCommentStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";

const CommentSection = ({ projectId }) => {
  const { user } = useAuthStore();
  const {
    fetchComment,
    createComment,
    deleteComment,
    comments,
    isCreatingComment,
    isDeletingComment,
  } = useCommentStore();
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        await fetchComment(projectId);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    loadComments();
  }, [projectId, fetchComment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await createComment(projectId, content);
      setContent("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Comment creation failed:", error);
      toast.error("Failed to post comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!user) {
      toast.error("Please login to delete comments");
      return;
    }
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Comment deletion failed:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
        Comments ({comments.length})
      </h3>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y min-h-[100px]"
            />
          </div>
          <button
            type="submit"
            disabled={isCreatingComment}
            className="mt-3 flex items-center justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isCreatingComment ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">
            Please{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              log in
            </Link>{" "}
            to add a comment.
          </p>
          <p className="text-sm text-gray-500">
            Join the conversation and share your thoughts!
          </p>
        </div>
      )}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b border-gray-200 py-4 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    By {comment.commentedBy?.username} •{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {user?._id === comment.commentedBy?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                    disabled={isDeletingComment}
                    title="Delete comment"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No comments yet.</p>
            {!user && (
              <p className="text-sm text-gray-500 mt-1">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>{" "}
                to be the first to comment!
              </p>
            )}
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Be the first to comment!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
