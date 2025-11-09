import { Suspense } from "react";

import { RoomsPageContent } from "./components/RoomsPageContent";

function RoomsLoading() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-xl rounded-lg p-6 animate-pulse"
            >
              <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-700/30 rounded w-1/2 mb-4" />
              <div className="h-10 bg-slate-700/40 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<RoomsLoading />}>
      <RoomsPageContent />
    </Suspense>
  );
}
