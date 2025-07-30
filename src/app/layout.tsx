"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import NavBar from "@/components/NavBar";
import { Orbitron } from "next/font/google";

// 👇 Import Orbitron
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <html lang="en" className={orbitron.variable}>
      <body>
        <div className="min-h-screen w-full text-grey">
          <NavBar user={user} />
          <main className="w-full h-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
