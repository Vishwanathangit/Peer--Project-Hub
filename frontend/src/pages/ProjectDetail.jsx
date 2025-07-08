import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import CommentSection from "../components/CommentSection";
import {
  Heart,
  Bookmark,
  ExternalLink,
  Github,
  Trash2,
  Edit3,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    singleProject,
    fetchSingleProject,
    toggleLike,
    toggleBookmark,
    toggleFavorite,
    deleteProject,
    setUser,
  } = useProjectStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        await fetchSingleProject(id);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, fetchSingleProject]);

  const handleAction = async (action) => {
    if (!user) {
      toast.error("Please login to perform this action");
      return;
    }
    try {
      await action(id);
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    if (!user) {
      toast.error("Please login to delete this project");
      return;
    }

    if (user._id !== singleProject.authorId) {
      toast.error("You can only delete your own projects");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${singleProject.title}"?\n\nThis action cannot be undone and will permanently remove the project from the platform.`
    );

    if (confirmed) {
      setLoading(true);
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Project deletion failed:", error);
        toast.error("Failed to delete project");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!singleProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Project not found</p>
      </div>
    );
  }

  const isLiked =
    singleProject.likes?.some((like) => like._id === user?._id) || false;
  const isBookmarked =
    singleProject.bookmarks?.some((bookmark) => bookmark._id === user?._id) ||
    false;
  const isFavorited =
    singleProject.favorites?.some((favorite) => favorite._id === user?._id) ||
    false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {singleProject.title}
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            By {singleProject.authorId?.username || "Unknown"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <img
            src={
              singleProject.previewImage ||
              "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={singleProject.title}
            className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-xl mb-6"
          />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Project Details
              </h2>
              <p className="text-gray-600 mb-6">{singleProject.description}</p>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Category
                </h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {singleProject.category}
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {singleProject.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                {singleProject.liveLink && (
                  <a
                    href={singleProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Live Demo
                  </a>
                )}
                <a
                  href={singleProject.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleAction(toggleLike)}
                  disabled={user?._id === singleProject.authorId}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    isLiked
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={
                    !user
                      ? "Login to like"
                      : user?._id === singleProject.authorId
                      ? "Cannot like your own project"
                      : "Like project"
                  }
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  <span>{singleProject.likes?.length || 0} Likes</span>
                </button>
                <button
                  onClick={() => handleAction(toggleBookmark)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    isBookmarked
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  title={!user ? "Login to bookmark" : "Bookmark project"}
                >
                  <Bookmark
                    size={20}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                  <span>Bookmark</span>
                </button>
                <button
                  onClick={() => handleAction(toggleFavorite)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    isFavorited
                      ? "bg-pink-50 text-pink-600"
                      : "bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                  title={!user ? "Login to favorite" : "Add to favorites"}
                >
                  <Heart
                    size={20}
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                  <span>Favorite</span>
                </button>
              </div>
            </div>
            {user?._id === singleProject.authorId && (
              <div className="w-full lg:w-1/4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Project
                </h3>
                <div className="flex flex-col gap-4">
                  <Link
                    to={`/edit-project/${id}`}
                    className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <Edit3 className="h-5 w-5 mr-2" />
                    Edit Project
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <CommentSection projectId={id} />
      </div>
    </div>
  );
};

export default ProjectDetail;
