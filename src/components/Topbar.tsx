/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Globe, Bell, User } from 'lucide-react';

interface TopbarProps {
  currentTab: string;
  isNepali: boolean;
  setIsNepali: (val: boolean) => void;
  onOpenSearch: () => void;
  activeEditorName?: string;
  onSwitchToGuest?: () => void;
  onToggleNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export default function Topbar({
  currentTab,
  isNepali,
  setIsNepali,
  onOpenSearch,
  activeEditorName,
  onSwitchToGuest,
  onToggleNotifications,
  unreadNotificationsCount = 0
}: TopbarProps) {
  // Format simulated UTC clock
  const systemTime = "2026-06-07 13:32 UTC";

  const getBreadcrumbName = () => {
    switch (currentTab) {
      case 'dashboard': return isNepali ? 'नियन्त्रण कक्ष' : 'Control Room';
      case 'blogs': return isNepali ? 'ब्लग र समाचार डेस्क' : 'Blogs & News Desk';
      case 'projects': return isNepali ? 'पैरवी आयोजना प्रणाली' : 'Advocacy Projects Manager';
      case 'programs': return isNepali ? 'तालिम कार्यशाला डेस्क' : 'Workshop & Events Console';
      case 'gallery': return isNepali ? 'अभियान तस्बिर ग्यालरी' : 'Campaign Gallery Library';
      case 'submissions': return isNepali ? 'नागरिक जिज्ञासा पेस' : 'Contact Submissions Inbox';
      default: return 'Editorial Desk';
    }
  };

  return (
    <header className="h-[52px] px-6 glass-panel shadow-glass flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Breadcrumb Area */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <span className="font-sans text-text-muted font-medium">DFAO CMS</span>
        <span className="text-text-muted font-bold">/</span>
        <span className="font-sans font-bold text-accent-link">
          {getBreadcrumbName()}
        </span>
        {activeEditorName && (
          <>
            <span className="text-text-muted font-bold">/</span>
            <span className="font-sans font-semibold text-text-primary max-w-[150px] truncate">
              {activeEditorName}
            </span>
          </>
        )}
      </div>

      {/* Global Search Field Trigger */}
      <button
        id="topbar-search-trigger"
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 w-72 h-8 bg-white/45 border border-border-default hover:border-border-strong text-left transition-colors rounded-[3px] text-xs text-text-secondary font-medium focus:outline-none"
      >
        <Search className="w-3.5 h-3.5 text-text-secondary" />
        <span className="grow">
          {isNepali ? "सामाग्री खोज्नुहोस्... (⌘K)" : "Search database... (⌘K)"}
        </span>
        <kbd className="hidden sm:inline-block font-mono bg-white/80 border border-border-default px-1 text-[10px] rounded">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* UTC Clock Block */}
        <div className="hidden lg:flex items-center gap-1 bg-white/50 border border-[#B1C9EA] px-2 py-1 rounded-[3px] text-[10px] font-mono text-text-secondary whitespace-nowrap">
          {systemTime}
        </div>

        {/* Switch back to Public Portal layout */}
        {onSwitchToGuest && (
          <button
            onClick={onSwitchToGuest}
            className="hidden sm:inline-flex px-3 h-8 bg-accent-link/10 hover:bg-accent-link/15 text-accent-link items-center justify-center text-[10.5px] font-sans font-extrabold uppercase tracking-wide rounded-[3px] border border-accent-link/25"
            title="Switch back to Public Portal Layout"
          >
            🌐 {isNepali ? 'अतिथी पोर्टल' : 'Public Portal'}
          </button>
        )}

        {/* Bilingual Selector */}
        <div className="flex border border-border-default p-0.5 rounded-[3px] bg-white/30 backdrop-blur-xs overflow-hidden shrink-0">
          <button
            id="lang-select-en"
            onClick={() => setIsNepali(false)}
            className={`px-2 py-0.5 text-[10px] font-sans font-bold rounded-[3px] transition-all focus:outline-none ${
              !isNepali
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            EN
          </button>
          <button
            id="lang-select-np"
            onClick={() => setIsNepali(true)}
            className={`px-2 py-0.5 text-[10px] font-sans font-bold rounded-[3px] transition-all focus:outline-none ${
              isNepali
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            नेपाली
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="topbar-alerts-btn"
            onClick={onToggleNotifications}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-white/40 rounded-[3px] transition-colors focus:outline-none relative"
            title={isNepali ? "चेतावनी र सूचनाहरू" : "Notifications"}
          >
            <Bell className="w-4 h-4 text-text-secondary" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 px-1 py-0.5 text-[8.5px] font-bold bg-amber-600 text-white rounded-full leading-none scale-90">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          
          <div className="w-px h-4 bg-border-default"></div>

          <div className="flex items-center gap-2 select-none shrink-0 pl-1">
            <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center text-white text-xs font-bold uppercase">
              S
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
