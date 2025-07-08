import { create } from "zustand";
import toast from "react-hot-toast";
import { Axios } from "../utils/Axios";

export const useUserStore = create((set) => ({
  userProfile: null,
  userBookmarks: null,
  userFavorites: null,
  userProjects: null,
  isFetchingUserProfile: false,
  isFetchingUserBookmarks: false,
  isFetchingUserFavorites: false,
  isFetchingUserProjects: false,
  isUpdatingUserProfile: false,

  fetchUserprofile: async (id) => {
    set({ isFetchingUserProfile: true });
    try {
      const response = await Axios.get(`/user/get/profile/${id}`);
      if (response.data.success) {
        set({ userProfile: response.data.user });
      }
    } catch (err) {
      console.log(`Error in Fetching User Profile - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingUserProfile: false });
    }
  },

  fetchUserBookmark: async (id) => {
    set({ isFetchingUserBookmarks: true });
    try {
      const response = await Axios.get(`/user/get/bookmarks/${id}`);
      if (response.data.success) {
        set({ userBookmarks: response.data.bookmarks });
      }
    } catch (err) {
      console.log(`Error in Fetching User Bookmark - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingUserBookmarks: false });
    }
  },

  fetchUserFavorites: async (id) => {
    set({ isFetchingUserFavorites: true });
    try {
      const response = await Axios.get(`/user/get/favorites/${id}`);
      if (response.data.success) {
        set({ userFavorites: response.data.favorites });
      }
    } catch (err) {
      console.log(`Error in Fetching User Favorites - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingUserFavorites: false });
    }
  },

  fetchUserProjects: async (id) => {
    set({ isFetchingUserProjects: true });
    try {
      const response = await Axios.get(`/user/get/projects/${id}`);
      if (response.data.success) {
        set({ userProjects: response.data.userProjects });
      }
    } catch (err) {
      console.log(`Error in Fetching User Projects - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingUserProjects: false });
    }
  },

  updateUserProfile: async (id, formData) => {
    set({ isUpdatingUserProfile: true });
    try {
      const response = await Axios.put(`/user/update/profile/${id}`, formData);
      if (response.data.success) {
        set({ userProfile: response.data.updatedUserProfile });
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Updating User Profile - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isUpdatingUserProfile: false });
    }
  },

  getUserProfile: async (userId) => {
    try {
      const response = await Axios.get(`/user/get/profile/${userId}`);
      if (response.data.success) {
        return response.data.user;
      }
      return null;
    } catch (err) {
      console.log(`Error in Get User Profile - ${err.message}`);
      return null;
    }
  },

  getUserProjects: async (userId) => {
    try {
      const response = await Axios.get(`/user/get/projects/${userId}`);
      if (response.data.success) {
        return response.data.userProjects;
      }
      return [];
    } catch (err) {
      console.log(`Error in Get User Projects - ${err.message}`);
      return [];
    }
  },
}));
