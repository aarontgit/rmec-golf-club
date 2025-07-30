"use client";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const ALLOWED_EMAILS = [
  "aaronbtiktin@gmail.com",
  "luis@example.com",
  "brian@example.com",
  "0093520@gmail.com"
];

export default function AuthButtons({ user }: { user: any }) {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!email || !ALLOWED_EMAILS.includes(email)) {
        alert("You're not authorized to access RMEC Golf Club.");
        await signOut(auth);
      }
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
