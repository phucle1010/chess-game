import { Suspense } from "react";

import { LeaderboardPageContent } from "./components/LeaderboardPageContent";

function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 bg-white/10 rounded w-48 mb-4 animate-pulse" />
        <div className="h-12 bg-white/10 rounded w-64 mb-2 animate-pulse" />
        <div className="h-6 bg-white/10 rounded w-96 mb-8 animate-pulse" />
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardLoading />}>
      <LeaderboardPageContent />
    </Suspense>
  );
}
