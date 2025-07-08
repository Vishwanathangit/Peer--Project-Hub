import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useProjectStore } from "../store/useProjectStore";
import ProjectCard from "../components/ProjectCard";
import {
  Edit3,
  Mail,
  MapPin,
  Link as LinkIcon,
  Code,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const { getUserProfile, getUserProjects } = useUserStore();
  const { projects } = useProjectStore();
  const [userProfile, setUserProfile] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile(userId);
        const projects = await getUserProjects(userId);
        setUserProfile(profile);
        setUserProjects(projects);
      } catch (error) {
        console.error("Failed to fetch profile or projects:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndProjects();
  }, [userId, getUserProfile, getUserProjects]);

  useEffect(() => {
    if (user && userId === user._id) {
      getUserProjects(userId).then(setUserProjects);
    }
  }, [projects, user, userId, getUserProjects]);

  useEffect(() => {
    setImageError(false);
  }, [userProfile]);

  const handleImageError = () => {
    setImageError(true);
  };

  const getDefaultAvatar = (username) => {
    const initials = username ? username.charAt(0).toUpperCase() : "U";
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#6366f1"/>
        <text x="75" y="75" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
              text-anchor="middle" dominant-baseline="middle" fill="white">${initials}</text>
      </svg>
    `)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {userProfile.username}'s Profile
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Explore {userProfile.username}'s projects and contributions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={
                imageError || !userProfile.profilePic
                  ? getDefaultAvatar(userProfile.username)
                  : userProfile.profilePic
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
              onError={handleImageError}
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {userProfile.username}
              </h2>
              <p className="text-gray-600 mt-2">
                {userProfile.bio || "No bio provided"}
              </p>
              <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm text-gray-600">
                {userProfile.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                    <span>{userProfile.email}</span>
                  </div>
                )}
                {userProfile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
                {userProfile.website && (
                  <div className="flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {userProfile.website}
                    </a>
                  </div>
                )}
              </div>
              {user?._id === userId && (
                <Link
                  to="/profile-edit"
                  className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Edit3 className="h-5 w-5 mr-2" />
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Projects ({userProjects.length})
          </h2>
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
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
                Share your amazing projects with the community!
              </p>
              {user?._id === userId && (
                <Link
                  to="/post-project"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Post Your Project
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
