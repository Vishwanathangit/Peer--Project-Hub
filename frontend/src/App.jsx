import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import PostProject from "./pages/PostProject";
import Favorites from "./pages/Favorites";
import Analytics from "./pages/Analytics";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfileEdit from "./pages/ProfileEdit";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import ProtectedRoute2 from "./components/ProtectedRoute2";

const App = () => {
  const { user, verifyToken, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    verifyToken();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route element={<ProtectedRoute2 />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/edit-project/:id" element={<EditProject />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;