import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ComparisonTable from './components/ComparisonTable';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DownloadModal from './components/DownloadModal';
import './App.css';

function App() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const openDownloadModal = () => setIsDownloadModalOpen(true);
  const closeDownloadModal = () => setIsDownloadModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onDownloadClick={openDownloadModal} />
      <Hero onDownloadClick={openDownloadModal} />
      <Features />
      <ComparisonTable />
      <Testimonials onDownloadClick={openDownloadModal} />
      <Footer />
      <DownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={closeDownloadModal} 
      />
    </div>
  );
}

export default App;
