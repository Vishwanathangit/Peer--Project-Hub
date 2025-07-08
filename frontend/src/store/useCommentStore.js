import { create } from "zustand";
import toast from "react-hot-toast";
import { Axios } from "../utils/Axios";

export const useCommentStore = create((set, get) => ({
  comments: [],
  isCreatingComment: false,
  isFetchingComment: false,
  isDeletingComment: false,

  fetchComment: async (id) => {
    set({ isFetchingComment: true });
    try {
      const response = await Axios.get(`/comment/get/${id}`);
      if (response.data.success) {
        set({ comments: response.data.comments });
      }
    } catch (err) {
      console.log(`Error in Fetch Comment - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isFetchingComment: false });
    }
  },

  createComment: async (id, content) => {
    set({ isCreatingComment: true });
    const { comments } = get();
    try {
      const response = await Axios.post(`/comment/create/${id}`, {
        content: content,
      });
      if (response.data.success) {
        set({ comments: [...comments, response.data.newComment] });
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Create Comment - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isCreatingComment: false });
    }
  },

  deleteComment: async (id) => {
    set({ isDeletingComment: true });
    const { comments } = get();
    try {
      const response = await Axios.delete(`/comment/delete/${id}`);
      let tempComments = comments.filter((element) => element._id != id);
      if (response.data.success) {
        set({ comments: tempComments });
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error in Delete Comment - ${err.message}`);
      toast.error(err.response?.data?.error);
    } finally {
      set({ isDeletingComment: false });
    }
  },

  // Additional functions for compatibility
  getComments: async (projectId) => {
    try {
      const response = await Axios.get(`/comment/get/${projectId}`);
      if (response.data.success) {
        return response.data.comments;
      }
      return [];
    } catch (err) {
      console.log(`Error in Get Comments - ${err.message}`);
      return [];
    }
  },
}));
