import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const OAuth = ({ login }) => {
  const navigate = useNavigate();

  const { googleAuth, isSigningUp } = useAuthStore();

  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const generatedPassword = Math.random().toString(36).slice(-8);
      const authResult = await googleAuth(
        result.user.displayName,
        result.user.email,
        generatedPassword
      );
      if (authResult && authResult.success) {
        navigate("/");
      }
    } catch (err) {
      console.log(`Error in Handle Google Click - ${err.message}`);
    }
  }

  return (
    <button
      type="button"
      disabled={isSigningUp}
      onClick={() => handleGoogleClick()}
      className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 border border-gray-300 rounded-xl shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <path
          fill="#fbc02d"
          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.4-5.7 7.5-10.6 7.5-6.2 0-11.3-5.1-11.3-11.5S18.5 12.5 24.7 12.5c2.6 0 5 0.9 6.8 2.4l6-5.8C34.3 5.6 29.7 4 24.7 4 13.9 4 5.3 12.6 5.3 23.5S13.9 43 24.7 43c10.6 0 18.9-8.3 18.9-18.5 0-1.5-0.1-2.7-0.4-4z"
        />
        <path
          fill="#e53935"
          d="M6.3 14.5l6.6 4.9C14.4 16.2 18.5 14 24.7 14c2.6 0 5 0.9 6.8 2.4l6-5.8C34.3 5.6 29.7 4 24.7 4 15.9 4 8.6 9.7 6.3 14.5z"
        />
        <path
          fill="#4caf50"
          d="M24.7 43c5 0 9.5-1.9 12.9-5l-6-5.9c-2.1 1.5-4.8 2.4-6.9 2.4-4.9 0-9-3.1-10.6-7.5l-6.6 5.1C9.1 39.1 16.2 43 24.7 43z"
        />
        <path
          fill="#1565c0"
          d="M43.6 20.5H42V20H24v8h11.3c-0.7 2.1-2 3.9-3.6 5.3l6 5.9c3.4-3.1 5.8-7.7 5.8-13.2 0-1.5-0.1-2.7-0.4-4z"
        />
      </svg>
      Sign {login ? "in" : "up"} with Google
    </button>
  );
};

export default OAuth;
