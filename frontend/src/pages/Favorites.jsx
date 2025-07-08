import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useProjectStore } from "../store/useProjectStore";
import ProjectCard from "../components/ProjectCard";
import { Heart, Bookmark, Star, Grid, List } from "lucide-react";

const Favorites = () => {
  const { user } = useAuthStore();
  const {
    userFavorites,
    userBookmarks,
    fetchUserFavorites,
    fetchUserBookmark,
  } = useUserStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favorites");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (user) {
      fetchUserFavorites(user._id);
      fetchUserBookmark(user._id);
    }
  }, [user, fetchUserFavorites, fetchUserBookmark]);

  useEffect(() => {
    if (user) {
      fetchUserFavorites(user._id);
      fetchUserBookmark(user._id);
    }
  }, [projects, user, fetchUserFavorites, fetchUserBookmark]);

  const filteredFavorites = userFavorites
    ? userFavorites.filter(
        (project) => projects && projects.some((p) => p._id === project._id)
      )
    : [];

  const filteredBookmarks = userBookmarks
    ? userBookmarks.filter(
        (project) => projects && projects.some((p) => p._id === project._id)
      )
    : [];

  const tabs = [
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      count: filteredFavorites ? filteredFavorites.length : 0,
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
      count: filteredBookmarks ? filteredBookmarks.length : 0,
    },
  ];

  const currentProjects =
    activeTab === "favorites" ? filteredFavorites : filteredBookmarks;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Collection
            </h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              All your favorite and bookmarked projects in one place
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "favorites"
                ? "Favorite Projects"
                : "Bookmarked Projects"}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>
                {currentProjects ? currentProjects.length : 0} project
                {(currentProjects ? currentProjects.length : 0) !== 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            {activeTab === "favorites"
              ? "Projects you've marked as favorites"
              : "Projects you've bookmarked for later"}
          </p>
        </div>

        {currentProjects && currentProjects.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {currentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "favorites" ? (
                <Heart className="h-12 w-12 text-gray-400" />
              ) : (
                <Bookmark className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === "favorites" ? "favorites" : "bookmarks"} yet
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "favorites"
                ? "Start exploring projects and mark your favorites!"
                : "Bookmark projects you want to revisit later."}
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Explore Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
