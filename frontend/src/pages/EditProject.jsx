import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Upload, Link, Tag, Loader2 } from "lucide-react";
import { useProjectStore } from "../store/useProjectStore";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, editProject } = useProjectStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    liveLink: "",
    repoLink: "",
    previewImage: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingProject, setFetchingProject] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setFetchingProject(true);
      try {
        console.log("Fetching project with ID:", id);
        const project = await getProject(id);
        console.log("Fetched project:", project);
        if (project) {
          setFormData({
            title: project.title || "",
            description: project.description || "",
            category: project.category || "",
            tags: project.tags || [],
            liveLink: project.liveLink || "",
            repoLink: project.repoLink || "",
            previewImage: null,
          });
          setCurrentImage(project.previewImage || "");
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        toast.error("Failed to load project");
      } finally {
        setFetchingProject(false);
      }
    };
    fetchProject();
  }, [id, getProject]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "previewImage") {
      setFormData({ ...formData, previewImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      e.stopPropagation();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("tags", JSON.stringify(formData.tags));
      data.append("liveLink", formData.liveLink);
      data.append("repoLink", formData.repoLink);
      if (formData.previewImage) {
        data.append("previewImage", formData.previewImage);
      }

      await editProject(id, data);
      toast.success("Project updated successfully");
      navigate(`/project/${id}`);
    } catch (error) {
      console.error("Project update failed:", error);
      toast.error("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProject) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              <span className="ml-3 text-lg text-gray-600">
                Loading project...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Edit Project
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Project Title"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y min-h-[150px]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Apps">Mobile Apps</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="AI">AI</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagAdd}
                  placeholder="Add tags (press Enter)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(index)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="liveLink"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Live Demo Link
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="url"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  placeholder="https://your-live-demo.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="repoLink"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                GitHub Repository Link
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="url"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleChange}
                  placeholder="https://github.com/your-repo"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="previewImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preview Image
              </label>
              {currentImage && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={currentImage}
                    alt="Current preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="file"
                  name="previewImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to keep the current image
              </p>
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
                "Update Project"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
