import React, { useState } from 'react';
import Modal from './ui/modal';
import { Button } from './ui/button';
import { Download, Monitor, Smartphone, HardDrive, Mail, CheckCircle, Loader2 } from 'lucide-react';

const DownloadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('os-selection'); // 'os-selection', 'email-input', 'confirmation'
  const [selectedOS, setSelectedOS] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const downloadOptions = [
    {
      os: 'macOS',
      icon: <Monitor className="w-8 h-8" />,
      version: 'Apple Silicon & Intel',
      file: 'Xquery-1.0.0-mac.dmg',
      size: '85 MB'
    },
    {
      os: 'Windows',
      icon: <HardDrive className="w-8 h-8" />,
      version: 'Windows 10/11',
      file: 'Xquery-1.0.0-win.exe',
      size: '92 MB'
    },
    {
      os: 'Linux',
      icon: <Smartphone className="w-8 h-8" />,
      version: 'Ubuntu/Debian',
      file: 'Xquery-1.0.0-linux.AppImage',
      size: '88 MB'
    }
  ];

  const handleOSSelection = (option) => {
    setSelectedOS(option);
    setStep('email-input');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    
    try {
      // Simulate API call for license generation
      await simulateLicenseGeneration(email, selectedOS);
      setStep('confirmation');
    } catch (error) {
      setEmailError('Failed to generate license. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateLicenseGeneration = async (email, osOption) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Example API call structure:
    /*
    const response = await fetch('/api/generate-license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        os: osOption.os,
        product: 'xquery',
        version: '1.0.0'
      })
    });
    
    if (!response.ok) {
      throw new Error('License generation failed');
    }
    
    const data = await response.json();
    return data;
    */
    
    console.log(`License generated for ${email} - ${osOption.os}`);
    
    // Trigger the download after license generation
    triggerDownload(osOption);
    
    return { success: true, licenseId: 'XQ-' + Math.random().toString(36).substr(2, 9).toUpperCase() };
  };

  const triggerDownload = (option) => {
    // For demo purposes, create a text file with installation instructions
    // In production, replace this with your actual download URLs
    
    const createDemoFile = (osOption) => {
      const instructions = `Xquery.io Installation Instructions
==========================================

Thank you for downloading Xquery.io for ${osOption.os}!

Your license key will be sent to your email shortly.

Installation Steps:
1. Run the installer: ${osOption.file}
2. Follow the installation wizard
3. Enter your license key when prompted
4. Start building amazing MongoDB queries!

System Requirements:
- ${osOption.version}
- 8GB RAM minimum
- 200MB free disk space
- MongoDB 4.0+ supported

Need help? Visit: https://docs.xquery.io
Support: support@xquery.io

Version: 1.0.0
Date: ${new Date().toISOString().split('T')[0]}
`;

      const blob = new Blob([instructions], { type: 'text/plain' });
      return URL.createObjectURL(blob);
    };

    // Create download link
    const link = document.createElement('a');
    link.href = createDemoFile(option);
    link.download = `Xquery-${option.os}-Installation-Instructions.txt`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after download
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);
    
    console.log(`Demo download initiated for ${option.os} - Installation instructions file created`);
    
    // TODO: Replace with actual download URLs when ready:
    /*
    const productionUrls = {
      'macOS': `https://releases.xquery.io/v1.0.0/${option.file}`,
      'Windows': `https://releases.xquery.io/v1.0.0/${option.file}`,
      'Linux': `https://releases.xquery.io/v1.0.0/${option.file}`
    };
    link.href = productionUrls[option.os];
    */
  };

  const resetModal = () => {
    setStep('os-selection');
    setSelectedOS(null);
    setEmail('');
    setEmailError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderOSSelection = () => (
    <>
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <Download className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Download Xquery.io
        </h2>
        <p className="text-muted-foreground">
          Choose your operating system to get started
        </p>
      </div>

      <div className="space-y-3">
        {downloadOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOSSelection(option)}
            className="w-full p-4 border border-border rounded-lg hover:bg-accent hover:border-primary transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="text-primary group-hover:text-primary">
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground group-hover:text-primary">
                  {option.os}
                </div>
                <div className="text-sm text-muted-foreground">
                  {option.version}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {option.size}
                </div>
                <div className="text-xs text-muted-foreground">
                  v1.0.0
                </div>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">System Requirements:</span> 
            <span className="block mt-1">
              8GB RAM minimum, 200MB free disk space. MongoDB 4.0+ supported.
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const renderEmailInput = () => (
    <>
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Generate License
        </h2>
        <p className="text-muted-foreground">
          Enter your email to receive your free license for {selectedOS?.os}
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            placeholder="your.email@example.com"
            required
          />
          {emailError && (
            <p className="mt-2 text-sm text-destructive">{emailError}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('os-selection')}
            className="flex-1"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-primary hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating License...
              </>
            ) : (
              'Generate & Send License'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
          <div className="text-sm text-muted-foreground">
            Your license will be sent to your email with download instructions
          </div>
        </div>
      </div>
    </>
  );

  const renderConfirmation = () => (
    <>
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          License Sent!
        </h2>
        <p className="text-muted-foreground">
          Your Xquery.io license has been sent to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800 mb-1">Download Starting!</p>
              <ul className="text-green-700 space-y-1">
                <li>• Your download for {selectedOS?.os} should start automatically</li>
                <li>• Check your email for the license key</li>
                <li>• Use the license key during installation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => triggerDownload(selectedOS)}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Again
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      {step === 'os-selection' && renderOSSelection()}
      {step === 'email-input' && renderEmailInput()}
      {step === 'confirmation' && renderConfirmation()}
    </Modal>
  );
};

export default DownloadModal;
