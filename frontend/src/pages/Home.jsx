import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { TrendingUp, Sparkles, Code, Users } from "lucide-react";

const Home = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handlePostProject = () => {
    if (user) {
      navigate("/post-project");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing <span className="text-yellow-300">Projects</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
              Explore, share, and get inspired by incredible projects from
              developers around the world
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-indigo-100">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6" />
                <span className="font-medium">Open Source</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span className="font-medium">Community Driven</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6" />
                <span className="font-medium">Innovative Ideas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Projects
            </h2>
            <p className="text-gray-600">
              Discover the newest and most innovative projects
            </p>
          </div>
          <div className="flex items-center space-x-2 text-indigo-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Trending Now</span>
          </div>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your amazing project with the community!
            </p>
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              onClick={handlePostProject}
            >
              Post Your Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
