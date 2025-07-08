import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Home,
  Search,
  PlusCircle,
  Heart,
  BarChart2,
  User,
  LogIn,
  LogOut,
  Loader2,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isLoggingOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              CodeConnect
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <Search size={20} />
              <span>Explore</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/post-project"
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <PlusCircle size={20} />
                  <span>Post Project</span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <Heart size={20} />
                  <span>Favorites</span>
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <BarChart2 size={20} />
                  <span>Analytics</span>
                </Link>
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="animate-spin size-5" />
                  ) : (
                    <LogOut size={20} />
                  )}
                  <span>Logout</span>
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <User size={20} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                to="/explore"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search size={20} />
                <span>Explore</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/post-project"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusCircle size={20} />
                    <span>Post Project</span>
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart size={20} />
                    <span>Favorites</span>
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart2 size={20} />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </Link>
                  <button
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="animate-spin size-5" />
                    ) : (
                      <LogOut size={20} />
                    )}
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={20} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
