import { create } from "zustand";
import { Axios } from "../utils/Axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoggingIn: false,
  isSigningUp: false,
  isLoggingOut: false,
  isCheckingAuth: true,

  signUp: async (username, email, password) => {
    set({ isSigningUp: true });
    try {
      const response = await Axios.post(`/auth/signup`, {
        username: username,
        email: email,
        password: password,
      });
      if (response.data.success) {
        set({ user: response.data.user });
        return { success: true };
      }
    } catch (err) {
      console.log(`Error in SignUp - ${err.message}`);
      toast.error(err.response?.data?.error || "SignUp failed");
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const response = await Axios.post(`/auth/login`, {
        email: email,
        password: password,
      });
      if (response.data.success) {
        set({ user: response.data.user });
        return { success: true };
      }
    } catch (err) {
      console.log(`Error in Login - ${err.message}`);
      toast.error(err.response?.data?.error || "Login failed");
      return { success: false };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const response = await Axios.post(`/auth/logout`);
      if (response.data.success) {
        set({ user: null });
      }
    } catch (err) {
      console.log(`Error in Logout - ${err.message}`);
      toast.error(err.response?.data?.error || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  verifyToken: async () => {
    try {
      const response = await Axios.get(`/auth/verify/token`);
      if (response.data.success) {
        set({ user: response.data.user, isCheckingAuth: false });
      } else {
        set({ user: null, isCheckingAuth: false });
      }
    } catch (err) {
      console.log(`Error in Verify Token - ${err.message}`);

      set({ user: null, isCheckingAuth: false });
    }
  },

  googleAuth: async (username, email, password) => {
    set({ isSigningUp: true });
    try {
      const response = await Axios.post(`/auth/google`, {
        username: username,
        email: email,
        password: password,
      });
      if (response.data.success) {
        set({ user: response.data.user });
        return { success: true };
      }
    } catch (err) {
      console.log(`Error in Google Auth - ${err.message}`);
      toast.error(err.response?.data?.error || "Login failed");
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
