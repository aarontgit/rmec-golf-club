"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Match = {
  id: string;
  date: string;
  course: string;
  scores: Record<string, number>;
  status: "pending" | "verified";
  submittedBy: string;
  needsVerificationFrom: string[];
  verifiedBy?: string;
};

export default function VerifyPage() {
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) return;

      const q = query(
        collection(db, "matches"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      const snapshotData = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Match, "id">;
        return { id: doc.id, ...data };
      });

      const pending = snapshotData.filter(
        (match) =>
          currentUser.email &&
          match.needsVerificationFrom
            .map((email) => email.toLowerCase())
            .includes(currentUser.email.toLowerCase())
      );

      setMatches(pending);
    });

    return unsubscribe;
  }, []);

  const handleVerify = async (matchId: string) => {
    if (!user) return;

    const ref = doc(db, "matches", matchId);
    await updateDoc(ref, {
      status: "verified",
      verifiedBy: user.email,
      needsVerificationFrom: [],
    });

    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Please sign in to verify matches.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">Verify Matches</h1>

      {matches.length === 0 ? (
        <p className="text-center">No matches to verify.</p>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {matches.map((match) => (
            <div
              key={match.id}
              className="border border-green-500 rounded-xl p-4 bg-zinc-900 shadow"
            >
              <p className="mb-1"><strong>Date:</strong> {match.date}</p>
              <p className="mb-1"><strong>Course:</strong> {match.course}</p>
              <p className="mb-1"><strong>Submitted by:</strong> {match.submittedBy}</p>
              <p className="mb-1">
                <strong>Needs verification from:</strong>{" "}
                {match.needsVerificationFrom.join(", ")}
              </p>
              <p className="mb-2">
                <strong>Scores:</strong>{" "}
                {Object.entries(match.scores)
                  .map(([name, score]) => `${name}: ${score}`)
                  .join(", ")}
              </p>
              <button
                onClick={() => handleVerify(match.id)}
                className="bg-green-500 text-black font-bold px-4 py-2 rounded hover:bg-green-400"
              >
                Verify Match
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
