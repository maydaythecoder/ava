import HomePageWrapper from "@/components/HomePageWrapper";

// PERFORMANCE: Enable static generation and revalidation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function App() {
  return <HomePageWrapper />;
}