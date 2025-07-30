"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

type PlayerName = "aaron" | "luis" | "brian";

const ALLOWED_EMAILS = [
  "aaronbtiktin@gmail.com",
  "luis@example.com",
  "brian@example.com",
  "0093520@gmail.com"
];

export default function SubmitPage() {
  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [scores, setScores] = useState<Record<PlayerName, string>>({
    aaron: "",
    luis: "",
    brian: "",
  });
  const [worstDay, setWorstDay] = useState<Record<PlayerName, boolean>>({
    aaron: false,
    luis: false,
    brian: false,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleSubmit = async () => {
    if (!user || !ALLOWED_EMAILS.includes(user.email)) return;
  
    if (!date || !course || Object.values(scores).some((s) => s === "")) {
      setMessage("Please fill out all fields.");
      return;
    }
  
    try {
      const scoreNums = Object.fromEntries(
        Object.entries(scores).map(([name, val]) => [name, Number(val)])
      );
  
      const otherTwo = ALLOWED_EMAILS.filter((email) => email !== user.email);
  
      await addDoc(collection(db, "matches"), {
        date,
        course,
        players: ["aaron", "luis", "brian"],
        scores: scoreNums,
        worstDay,
        status: "pending",
        submittedBy: user.email,
        needsVerificationFrom: otherTwo,
      });
  
      setMessage("Match submitted for verification.");
      setCourse("");
      setDate("");
      setScores({ aaron: "", luis: "", brian: "" });
      setWorstDay({ aaron: false, luis: false, brian: false });
    } catch (err) {
      setMessage("Error submitting match.");
      console.error(err);
    }
  };
  
  

  if (!user || !ALLOWED_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Only RMEC players can access this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-lg border border-green-500">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-400">Submit Match</h1>

        <label className="block mb-2 text-sm text-gray-300">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-4 p-2 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-green-500"
        />

        <label className="block mb-2 text-sm text-gray-300">Course</label>
        <input
          type="text"
          placeholder="Course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full mb-4 p-2 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-green-500"
        />

        {(["aaron", "luis", "brian"] as PlayerName[]).map((name) => (
          <div key={name} className="mb-4">
            <label className="block mb-2 capitalize text-sm text-gray-300">{name} Score</label>
            <input
              type="number"
              value={scores[name]}
              onChange={(e) =>
                setScores((prev) => ({ ...prev, [name]: e.target.value }))
              }
              className="w-full p-2 mb-2 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-green-500"
            />
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={worstDay[name]}
                onChange={(e) =>
                  setWorstDay((prev) => ({ ...prev, [name]: e.target.checked }))
                }
                className="mr-2 accent-green-500"
              />
              Worst Day?
            </label>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition"
        >
          Submit Match
        </button>

        {message && <p className="text-center mt-4 text-green-400">{message}</p>}
      </div>
    </div>
  );
}
