import React, { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { useProjectStore } from "../store/useProjectStore";
import { Search, Filter, SortAsc, Grid, List, X } from "lucide-react";

const Explore = () => {
  const { projects, fetchProjects } = useProjectStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

 
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.tags?.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory = !category || project.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sort) {
        case "popular":
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "latest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const categories = [
    "Web Development",
    "Mobile Apps",
    "Data Analysis",
    "AI",
    "Others",
  ];

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("latest");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Projects
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Discover amazing projects from our talented community
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>

              <div className="hidden lg:flex items-center gap-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="oldest">Oldest</option>
                </select>

                {(search || category || sort !== "latest") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex flex-col gap-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="oldest">Oldest</option>
                </select>

                {(search || category || sort !== "latest") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <SortAsc className="h-5 w-5 text-indigo-600" />
            <span className="text-gray-700 font-medium">
              {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {(search || category) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {search && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  "{search}"
                </span>
              )}
              {category && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {category}
                </span>
              )}
            </div>
          )}
        </div>

        {filteredProjects && filteredProjects.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6">
              {search || category
                ? "Try adjusting your search criteria or filters."
                : "No projects available at the moment."}
            </p>
            {(search || category) && (
              <button
                onClick={clearFilters}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
