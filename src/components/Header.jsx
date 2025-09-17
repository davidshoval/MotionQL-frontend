import React from 'react';
import { Button } from "./ui/button";

const Header = ({ onDownloadClick }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">X</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Xquery.io</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('comparison')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Comparison
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </button>
          </nav>
        </div>
        <div className="flex items-center">
                   <Button
                     className="bg-gradient-primary hover:opacity-90"
                     onClick={onDownloadClick}
                   >
                     Download Now!
                   </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
