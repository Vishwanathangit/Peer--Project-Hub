import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { useUserStore } from "../store/useUserStore";
import {
  Heart,
  Bookmark,
  MessageSquare,
  ExternalLink,
  Github,
  Edit3,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectCard = ({ project }) => {
  const { user } = useAuthStore();
  const { userFavorites, userBookmarks } = useUserStore();
  const { toggleLike, toggleBookmark, toggleFavorite, deleteProject, setUser } =
    useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser, userFavorites, userBookmarks]);

  const handleAction = async (action, id) => {
    if (!user) {
      toast.error("Please login to perform this action");
      navigate("/login");
      return;
    }
    try {
      await action(id);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      toast.error("Please login to perform this action");
      navigate("/login");
      return;
    }

    if (user._id !== project.authorId) {
      toast.error("You can only delete your own projects");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (confirmed) {
      try {
        const result = await deleteProject(project._id);
        if (result && result.success) {
        }
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const isLiked =
    project.likes?.some((like) => {
      const likeId = typeof like === "object" ? like._id : like;
      return likeId === user?._id;
    }) || false;

  const isBookmarked =
    project.bookmarks?.some((bookmark) => {
      const bookmarkId = typeof bookmark === "object" ? bookmark._id : bookmark;
      return bookmarkId === user?._id;
    }) || false;

  const isFavorited =
    project.favorites?.some((favorite) => {
      const favoriteId = typeof favorite === "object" ? favorite._id : favorite;
      return favoriteId === user?._id;
    }) || false;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative">
        <Link to={`/project/${project._id}`}>
          <img
            src={
              project.previewImage ||
              "https://via.placeholder.com/400x200?text=No+Image"
            }
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-medium text-gray-700">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <Link to={`/project/${project._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
            <button
              onClick={() => handleAction(toggleLike, project._id)}
              disabled={user?._id === project.authorId}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                !user
                  ? "Login to like"
                  : user?._id === project.authorId
                  ? "Cannot like your own project"
                  : "Like project"
              }
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-medium">
                {project.likes?.length || 0}
              </span>
            </button>

            <button
              onClick={() => handleAction(toggleBookmark, project._id)}
              className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              title={!user ? "Login to bookmark" : "Bookmark project"}
            >
              <Bookmark
                size={16}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={() => handleAction(toggleFavorite, project._id)}
              className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full transition-colors ${
                isFavorited
                  ? "bg-pink-50 text-pink-600"
                  : "bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              }`}
              title={!user ? "Login to favorite" : "Add to favorites"}
            >
              <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
            </button>

            <Link
              to={`/project/${project._id}`}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              title="View project details"
            >
              <MessageSquare size={16} />
              <span className="text-sm font-medium">
                {project.comments?.length || 0}
              </span>
            </Link>
          </div>

          {user?._id === project.authorId && (
            <div className="flex items-center space-x-2 justify-end">
              <Link
                to={`/edit-project/${project._id}`}
                className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                title="Edit project"
              >
                <Edit3 size={16} />
                <span className="text-sm font-medium hidden sm:inline">
                  Edit
                </span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Delete project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
