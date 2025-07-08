import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
