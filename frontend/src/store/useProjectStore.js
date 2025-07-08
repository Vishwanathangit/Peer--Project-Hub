import { create } from "zustand";
import toast from "react-hot-toast";
import { Axios } from "../utils/Axios";

export const useProjectStore = create((set, get) => ({
  projects: [],
  singleProject: null,
  user: null,
  isFetchingProject: false,
  isFetchingEachProject: false,
  isCreatingProject: false,
  isEditingProject: false,
  isDeletingProject: false,
  isToggleLike: false,
  isToggleBookmark: false,
  isToggleFavorites: false,

  setUser: (user) => {
    set({ user });
  },

  createProject: async (formData) => {
    set({ isCreatingProject: true });
    const { projects } = get();
    try {
      const response = await Axios.post(`/project/create`, formData);
      if (response.data.success) {
        set({ projects: [...projects, response.data.newProject] });
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Creating Project - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isCreatingProject: false });
    }
  },

  fetchProjects: async () => {
    set({ isFetchingProject: true });
    try {
      const response = await Axios.get(`/project/get/all`);
      if (response.data.success) {
        set({ projects: response.data.projects });
      }
    } catch (err) {
      console.log(`Error in Fetch Projects - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingProject: false });
    }
  },

  fetchSingleProject: async (id) => {
    set({ isFetchingEachProject: true });
    try {
      const response = await Axios.get(`/project/get/${id}`);
      if (response.data.success) {
        set({ singleProject: response.data.project });
      }
    } catch (err) {
      console.log(`Error in Fetch Single Project - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingEachProject: false });
    }
  },

  editProject: async (id, formData) => {
    set({ isEditingProject: true });
    const { projects } = get();
    try {
      const response = await Axios.put(`/project/edit/${id}`, formData);
      if (response.data.success) {
        const updatedProjects = projects.map((element) =>
          element._id == id ? response.data.editedProject : element
        );
        set({ projects: updatedProjects });
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Edit Project - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isEditingProject: false });
    }
  },

  deleteProject: async (id) => {
    set({ isDeletingProject: true });
    const { projects, singleProject } = get();
    try {
      const response = await Axios.delete(`/project/delete/${id}`);
      if (response.data.success) {
        let tempProjects = projects.filter((element) => element._id != id);
        set({ projects: tempProjects });

        if (singleProject && singleProject._id === id) {
          set({ singleProject: null });
        }

        toast.success(response.data.message);
        return { success: true };
      }
    } catch (err) {
      console.log(`Error in Delete Project - ${err.message}`);
      toast.error(err.response?.data?.error);
      return { success: false };
    } finally {
      set({ isDeletingProject: false });
    }
  },

  toggleLike: async (id) => {
    set({ isToggleLike: true });
    const { projects, singleProject, user } = get();
    try {
      const response = await Axios.put(`/project/toggle/like/${id}`);
      if (response.data.success) {
        const updatedProjectResponse = await Axios.get(`/project/get/${id}`);
        if (updatedProjectResponse.data.success) {
          const updatedProject = updatedProjectResponse.data.project;

          const updatedProjects = projects.map((project) =>
            project._id === id ? updatedProject : project
          );
          set({ projects: updatedProjects });

          if (singleProject && singleProject._id === id) {
            set({ singleProject: updatedProject });
          }
        }
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Toggle Like - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isToggleLike: false });
    }
  },

  toggleBookmark: async (id) => {
    set({ isToggleBookmark: true });
    const { projects, singleProject, user } = get();
    try {
      const response = await Axios.put(`/project/toggle/bookmark/${id}`);
      if (response.data.success) {
        const updatedProjectResponse = await Axios.get(`/project/get/${id}`);
        if (updatedProjectResponse.data.success) {
          const updatedProject = updatedProjectResponse.data.project;

          const updatedProjects = projects.map((project) =>
            project._id === id ? updatedProject : project
          );
          set({ projects: updatedProjects });

          if (singleProject && singleProject._id === id) {
            set({ singleProject: updatedProject });
          }
        }
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Toggle Bookmark - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isToggleBookmark: false });
    }
  },

  toggleFavorite: async (id) => {
    set({ isToggleFavorites: true });
    const { projects, singleProject, user } = get();
    try {
      const response = await Axios.put(`/project/toggle/favorite/${id}`);
      if (response.data.success) {
        const updatedProjectResponse = await Axios.get(`/project/get/${id}`);
        if (updatedProjectResponse.data.success) {
          const updatedProject = updatedProjectResponse.data.project;

          const updatedProjects = projects.map((project) =>
            project._id === id ? updatedProject : project
          );
          set({ projects: updatedProjects });

          if (singleProject && singleProject._id === id) {
            set({ singleProject: updatedProject });
          }
        }
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Toggle Favorite - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isToggleFavorites: false });
    }
  },

  getAllProjects: async () => {
    return get().fetchProjects();
  },

  getProject: async (id) => {
    try {
      console.log("Making request to:", `/project/get/${id}`);
      const response = await Axios.get(`/project/get/${id}`);
      console.log("Response:", response.data);
      if (response.data.success) {
        set({ singleProject: response.data.project });
        return response.data.project;
      }
      throw new Error("Failed to fetch project");
    } catch (err) {
      console.log(`Error in Get Project - ${err.message}`);
      console.log("Error details:", err);
      toast.error(err.response?.data?.error || "Failed to fetch project");
      throw err;
    }
  },

  getFilteredProjects: () => {
    const { projects } = get();
    return projects;
  },

  setSearchQuery: () => {},
  setSelectedCategory: () => {},
  setSortBy: () => {},

  favorites: [],
  bookmarks: [],
  getUserFavorites: async (userId) => {
    try {
      const response = await Axios.get(`/user/get/favorites/${userId}`);
      if (response.data.success) {
        set({ favorites: response.data.favorites });
      }
    } catch (err) {
      console.log(`Error in Get User Favorites - ${err.message}`);
      toast.error(err.response?.data?.error);
    }
  },

  getUserBookmarks: async (userId) => {
    try {
      const response = await Axios.get(`/user/get/bookmarks/${userId}`);
      if (response.data.success) {
        set({ bookmarks: response.data.bookmarks });
      }
    } catch (err) {
      console.log(`Error in Get User Bookmarks - ${err.message}`);
      toast.error(err.response?.data?.error);
    }
  },
}));
