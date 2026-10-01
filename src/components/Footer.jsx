import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">X</span>
              </div>
              <span className="text-xl font-bold text-foreground">Xquery.io</span>
            </div>
            <p className="text-muted-foreground text-sm">
              The modern MongoDB tool built for developers who demand more at less cost.
            </p>
          </div>
          
          <div>
            {/* <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
            </ul> */}
          </div>
          
          
          
          <div>
            {/* <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
            </ul> */}
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button type="button" className="hover:text-foreground transition-colors">About</button></li>
              {/* <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li> */}
              {/* <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li> */}
              <li><button type="button" className="hover:text-foreground transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Xquery.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
