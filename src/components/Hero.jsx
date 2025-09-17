import React from 'react';
import { Button } from "./ui/button";

const Hero = ({ onDownloadClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
                     <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6 leading-tight">
                       Stop Paying for Studio3T
                       <br />
                       Build Free with Xquery.io
                     </h1>
                     <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl">
                     AI-powered MongoDB development
                     <br />
                     Free for 12 months for individuals, teams, and enterprises.                     </p>
            <div className="flex justify-center lg:justify-start">
                       <Button
                         size="lg"
                         variant="secondary"
                         className="shadow-primary px-12 py-4 text-xl font-bold hover:scale-105 transition-transform duration-200"
                         onClick={onDownloadClick}
                       >
                         Download Now!
                       </Button>
            </div>
                     <div className="mt-8 text-primary-foreground/80">
                       <p className="text-sm">✨ AI-Powered Queries • 🚀 Lightning Fast • 💰 Free for Commercial Use</p>
                       <p className="text-xs mt-3 text-primary-foreground/60 max-w-lg">
                         Xquery.io is currently free for 12 months of full commercial use.
                         <br />
                         Renewals may be free or paid depending on future plans. No credit card required to start.
                       </p>
                     </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-primary">
              {/* YouTube video embed */}
              <div className="w-full h-96 rounded-xl overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/kcwrXAxooik?autoplay=0&mute=1&controls=1&showinfo=0&rel=0&modestbranding=1"
                  title="Xquery.io Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-primary rounded-xl blur opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
