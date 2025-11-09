import { Suspense } from "react";
import { HomePageContent } from "./components/HomePageContent";

function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="h-16 w-16 bg-amber-400/20 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-purple-200/20 rounded w-96 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomePageContent />
    </Suspense>
  );
}
