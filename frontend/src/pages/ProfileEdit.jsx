import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import toast from "react-hot-toast";
import { User, Upload, Loader2 } from "lucide-react";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getUserProfile, updateUserProfile } = useUserStore();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const profile = await getUserProfile(user._id);
          if (profile) {
            setFormData({
              username: profile.username || "",
              bio: profile.bio || "",
              profilePic: null,
            });
            setProfileImage(profile.profilePic || "");
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast.error("Failed to load profile");
        }
      };
      fetchProfile();
    }
  }, [user, getUserProfile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      await updateUserProfile(user._id, data);
      toast.success("Profile updated successfully");
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y min-h-[150px]"
              />
            </div>
            <div>
              <label
                htmlFor="profilePic"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Picture
              </label>
              {profileImage && (
                <div className="mb-4">
                  <img
                    src={profileImage}
                    alt="Current profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80?text=Profile";
                    }}
                  />
                </div>
              )}
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
