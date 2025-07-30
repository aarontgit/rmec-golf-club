"use client";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function AuthButtons({ user }: { user: any }) {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Hi, {user.displayName}</span>
        <button onClick={handleLogout} className="text-blue-600 underline">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} className="text-blue-600 underline">
      Sign In with Google
    </button>
  );
}
