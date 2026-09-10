import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import Button from './Button';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('paimana_cookie_consent');
      if (!consent) {
        setShowBanner(true);
      }
    } catch (e) {
      // Storage access disabled or private window
    }
  }, []);

  const handleConsent = (level) => {
    try {
      localStorage.setItem('paimana_cookie_consent', level);
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9990] p-4 rounded-xl bg-white border border-slate-200 shadow-2xl animate-slide-up text-xs font-sans space-y-3"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="flex items-start gap-2.5">
        <Cookie className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-semibold text-slate-900 text-xs">
            Infrastructure Surveillance Session Preferences
          </h5>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            PAIMANA AI uses local storage to maintain session states, GIS view filters, and telemetry preferences. No commercial third-party trackers are utilized.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleConsent('essential')}
          className="text-[11px] py-1 px-2.5"
        >
          Essential Only
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleConsent('all')}
          className="text-[11px] py-1 px-2.5"
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}
