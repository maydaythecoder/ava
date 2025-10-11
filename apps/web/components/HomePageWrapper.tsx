"use client";
import dynamicImport from 'next/dynamic';
import HomePage from "./HomePage";

// PERFORMANCE: Lazy load Spline component after initial render
const SplineComponent = dynamicImport(
  () => import('./Spline'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[110vh] bg-gradient-to-b from-gray-50 to-white" />
  }
);

export default function HomePageWrapper() {
  return (
    <>
    <div className="w-full h-screen">
      <HomePage />
      <SplineComponent />
      </div>
    </>
  );
}

