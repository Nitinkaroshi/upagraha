import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';

// Lazy-load every secondary route. Home stays eager for fast initial paint.
const Tracker = lazy(() => import('@/pages/Tracker'));
const LifetimeCalculator = lazy(() => import('@/pages/LifetimeCalculator'));
const Conjunctions = lazy(() => import('@/pages/Conjunctions'));
const DeorbitAdvisor = lazy(() => import('@/pages/DeorbitAdvisor'));
const SustainabilityScore = lazy(() => import('@/pages/SustainabilityScore'));
const SatellitesOverYou = lazy(() => import('@/pages/SatellitesOverYou'));
const SatellitePage = lazy(() => import('@/pages/SatellitePage'));
const Compare = lazy(() => import('@/pages/Compare'));
const About = lazy(() => import('@/pages/About'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));

function PageLoader() {
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black relative">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tracker" element={<Tracker />} />
                <Route path="/lifetime-calculator" element={<LifetimeCalculator />} />
                <Route path="/conjunctions" element={<Conjunctions />} />
                <Route path="/deorbit-advisor" element={<DeorbitAdvisor />} />
                <Route path="/sustainability" element={<SustainabilityScore />} />
                <Route path="/satellites-over-you" element={<SatellitesOverYou />} />
                <Route path="/satellite/:noradId" element={<SatellitePage />} />
                <Route path="/satellite/:noradId/:slug" element={<SatellitePage />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
