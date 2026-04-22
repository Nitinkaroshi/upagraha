import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpaceBackground from '@/components/SpaceBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Tracker from '@/pages/Tracker';
import LifetimeCalculator from '@/pages/LifetimeCalculator';
import Conjunctions from '@/pages/Conjunctions';
import DeorbitAdvisor from '@/pages/DeorbitAdvisor';
import SustainabilityScore from '@/pages/SustainabilityScore';
import SatellitesOverYou from '@/pages/SatellitesOverYou';
import SatellitePage from '@/pages/SatellitePage';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black relative">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
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
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
