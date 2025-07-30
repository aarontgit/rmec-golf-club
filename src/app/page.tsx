"use client";

import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Podium from "@/components/Podium";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

type Match = {
  players: string[];
  scores: Record<string, number>;
  status: "verified";
  date: string;
  course: string;
};

type PlayerRecord = {
  name: string;
  points: number;
};

const PLAYER_NAMES = ["aaron", "luis", "brian"];

export default function LeaderboardPage() {
  const [records, setRecords] = useState<Record<string, PlayerRecord>>({});
  const [lastMatch, setLastMatch] = useState<Match | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const q = query(collection(db, "matches"), where("status", "==", "verified"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const matches = snapshot.docs.map((doc) => doc.data() as Match);

      const validMatches = matches.filter(
        (match) =>
          PLAYER_NAMES.every((p) => match.players.includes(p)) &&
          match.players.length === 3
      );

      // Get last match by latest date (YYYY/MM/DD)
      const sortedByDate = [...validMatches].sort((a, b) => b.date.localeCompare(a.date));
      const latest = sortedByDate[0];
      if (latest) {
        setLastMatch(latest);
        const scores = Object.entries(latest.scores).sort(([, a], [, b]) => a - b);
        setWinner(scores[0][0]);
      }

      const totals: Record<string, PlayerRecord> = {
        aaron: { name: "Aaron", points: 0 },
        luis: { name: "Luis", points: 0 },
        brian: { name: "Brian", points: 0 },
      };

      for (const match of validMatches) {
        const sorted = Object.entries(match.scores).sort(([, a], [, b]) => a - b);
        sorted.forEach(([name], idx) => {
          if (!PLAYER_NAMES.includes(name)) return;
          const points = idx === 0 ? 2 : idx === 1 ? 1 : 0;
          totals[name].points += points;
        });
      }

      setRecords(totals);
    };

    fetchMatches();
  }, []);

  const sortedPlayers = Object.values(records).sort((a, b) => b.points - a.points);

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center px-4 py-12"
      style={{
        backgroundImage: "url('/RmecGolfClubBackground.png')",
      }}
    >
      {/* Match summary row */}
      <div className="flex w-full justify-between px-4 md:px-24 text-sm md:text-base font-orbitron mb-6">
        {/* Left side block */}
        <div className="space-y-1 bg-black text-green-300 p-4 rounded-lg shadow-[0_0_15px_#00FF88]">
          {lastMatch && (
            <>
              <p>
                Last Played: <span className="text-white">{lastMatch.date}</span>
              </p>
              <p>
                Course: <span className="text-white">{lastMatch.course}</span>
              </p>
              <p>
                Winner: <span className="text-white capitalize">{winner}</span>
              </p>
            </>
          )}
        </div>

        {/* Right side block */}
        <div className="bg-black text-green-300 px-4 py-2 rounded-lg shadow-[0_0_15px_#00FF88] text-right self-start">
          <p>
            Next: <span className="text-white">Denver</span>
          </p>
        </div>
      </div>

      <div className="relative flex flex-col items-center -mt-12">
        {/* Podium */}
        <Podium players={sortedPlayers} />

        {/* Leaderboard table */}
        <table className="absolute z-30 -bottom-5 w-[300px] text-base font-orbitron text-white rounded-xl overflow-hidden border-2 border-green-400 shadow-[0_0_20px_#00FFAA] backdrop-blur-md bg-black/40">
          <thead className="bg-black border-b border-green-500 text-green-400 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Player</th>
              <th className="px-6 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, idx) => (
              <tr key={player.name} className="border-b border-green-900/40 last:border-none">
                <td className="px-6 py-3">{player.name}</td>
                <td className="px-6 py-3 text-right text-green-300">{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
