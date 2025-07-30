"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

type Match = {
  course: string;
  date: string;
  players: string[];
  scores: Record<string, number>;
  status: string;
  worstDay?: Record<string, boolean>;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const q = query(collection(db, "matches"), where("status", "==", "verified"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => doc.data() as Match);
      const sorted = fetched.sort((a, b) => b.date.localeCompare(a.date));
      setMatches(sorted);
    };

    fetchMatches();
  }, []);

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center bg-fixed px-6 py-12 text-white font-orbitron"
      style={{
        backgroundImage: "url('/RmecGolfClubBackground.png')",
      }}
    >
      <h1 className="text-4xl font-bold text-green-400 drop-shadow-[0_0_12px_#00FF80] text-center mb-10">
        Match History
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {matches.map((match, idx) => (
          <div
            key={idx}
            className="bg-black/60 border-2 border-green-500 shadow-[0_0_20px_#00FFAA] rounded-xl p-6 backdrop-blur-md"
          >
            <div className="flex justify-between mb-4 text-green-300">
              <div><strong>Date:</strong> {match.date}</div>
              <div><strong>Course:</strong> {match.course}</div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-green-400 uppercase text-sm border-b border-green-700">
                  <th className="pb-2">Player</th>
                  <th className="pb-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                    const entries = Object.entries(match.scores);
                    const minScore = Math.min(
                    ...entries
                        .map(([, score]) => score)
                        .filter((score) => score !== 999)
                    );

                    return entries
                    .sort(([, a], [, b]) => a - b)
                    .map(([player, score]) => {
                        const gaveUp = score === 999;
                        const isWinner = score === minScore && !gaveUp;
                        const hadWorstDay = match.worstDay?.[player] === true;

                        return (
                        <tr
                            key={player}
                            className={`border-b border-green-900/40 last:border-none ${
                            isWinner ? "text-green-400 font-bold" : ""
                            }`}
                        >
                            <td className="py-2 capitalize">
                            {isWinner && "🏆 "}
                            {player}
                            {hadWorstDay && (
                                <span className="ml-2 text-sm text-red-400 italic">☠ Worst Day</span>
                            )}
                            </td>
                            <td className="py-2 text-right text-green-200">
                            {gaveUp ? "Gave Up" : score}
                            </td>
                        </tr>
                        );
                    });
                })()}
                </tbody>


            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
