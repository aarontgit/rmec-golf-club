import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function NavBar({ user }: { user: any }) {
  return (
    <nav className="flex justify-between items-center px-4 py-4 bg-white shadow">
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-xl font-bold">
          RMEC Golf Club
        </Link>
        <Link href="/submit" className="hover:underline">Submit</Link>
        <Link href="/matches" className="hover:underline">Matches</Link>
        <Link href="/verify" className="hover:underline">Verify</Link>
      </div>
      <AuthButtons user={user} />
    </nav>
  );
}
