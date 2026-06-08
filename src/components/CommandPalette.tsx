/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Calendar, Compass, MessageSquare, CornerDownLeft } from 'lucide-react';
import { Blog, Project, Program, ContactSubmission } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  blogs: Blog[];
  projects: Project[];
  programs: Program[];
  submissions: ContactSubmission[];
  onSelectResult: (type: 'blog' | 'project' | 'program' | 'submission', id: string) => void;
  isNepali: boolean;
}

export default function CommandPalette({
  isOpen,
  onClose,
  blogs,
  projects,
  programs,
  submissions,
  onSelectResult,
  isNepali
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle ESC and keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          const res = results[selectedIndex];
          onSelectResult(res.type, res.id);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  // Search results compilation
  const results: {
    id: string;
    type: 'blog' | 'project' | 'program' | 'submission';
    title: string;
    sublabel: string;
    status?: string;
  }[] = [];

  const lowerQuery = query.toLowerCase();

  // Filter Blogs
  blogs.forEach(b => {
    if (
      b.titleEn.toLowerCase().includes(lowerQuery) ||
      b.titleNp.toLowerCase().includes(lowerQuery) ||
      b.categoryEn.toLowerCase().includes(lowerQuery) ||
      b.categoryNp.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: b.id,
        type: 'blog',
        title: isNepali ? b.titleNp : b.titleEn,
        sublabel: isNepali ? `ब्लग • ${b.categoryNp}` : `Blog • ${b.categoryEn}`,
        status: b.status
      });
    }
  });

  // Filter Projects
  projects.forEach(p => {
    if (
      p.titleEn.toLowerCase().includes(lowerQuery) ||
      p.titleNp.toLowerCase().includes(lowerQuery) ||
      p.locationEn.toLowerCase().includes(lowerQuery) ||
      p.locationNp.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: p.id,
        type: 'project',
        title: isNepali ? p.titleNp : p.titleEn,
        sublabel: isNepali ? `आयोजना • ${p.locationNp}` : `Project • ${p.locationEn}`,
        status: p.status
      });
    }
  });

  // Filter Programs
  programs.forEach(pr => {
    if (
      pr.titleEn.toLowerCase().includes(lowerQuery) ||
      pr.titleNp.toLowerCase().includes(lowerQuery) ||
      pr.venueEn.toLowerCase().includes(lowerQuery) ||
      pr.venueNp.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: pr.id,
        type: 'program',
        title: isNepali ? pr.titleNp : pr.titleEn,
        sublabel: isNepali ? `कार्यक्रम • ${pr.venueNp}` : `Program • ${pr.venueEn}`,
        status: pr.status
      });
    }
  });

  // Filter Submissions
  submissions.forEach(s => {
    if (
      s.name.toLowerCase().includes(lowerQuery) ||
      s.subject.toLowerCase().includes(lowerQuery) ||
      s.message.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: s.id,
        type: 'submission',
        title: s.subject,
        sublabel: isNepali ? `सम्पर्क जिज्ञासा • ${s.name}` : `Inquiry • ${s.name}`,
        status: s.resolved ? 'resolved' : 'pending'
      });
    }
  });

  // Limit to 8 items in display
  const displayedResults = results.slice(0, 8);

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="w-4 h-4 text-text-secondary" />;
      case 'project': return <Compass className="w-4 h-4 text-text-secondary" />;
      case 'program': return <Calendar className="w-4 h-4 text-text-secondary" />;
      case 'submission': return <MessageSquare className="w-4 h-4 text-text-secondary" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/45 backdrop-none animate-fade-in">
      <div
        id="cmd-palette-container"
        ref={containerRef}
        className="w-full max-w-xl bg-surface border border-border-default shadow-md overflow-hidden"
        style={{ borderRadius: '5px' }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-default bg-surface">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            id="cmd-palette-input"
            ref={inputRef}
            type="text"
            className="w-full text-base font-sans text-text-primary placeholder-text-muted bg-transparent border-none outline-none focus:outline-none focus:ring-0"
            placeholder={isNepali ? "शीर्षक, श्रेणी वा सामाग्री खोज्नुहोस्..." : "Search anything (blogs, projects, inquiries...)"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-medium text-text-muted bg-section-rail border border-border-default rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 no-scrollbar bg-surface/95">
          {displayedResults.length > 0 ? (
            <div className="space-y-0.5">
              <div className="px-3 py-1.5 text-[11px] font-sans font-medium uppercase tracking-wider text-text-muted">
                {isNepali ? 'खोज परिणामहरू' : 'Search Results'} ({results.length})
              </div>
              {displayedResults.map((res, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${res.type}-${res.id}`}
                    id={`cmd-result-item-${index}`}
                    onClick={() => {
                      onSelectResult(res.type, res.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-[3px] transition-colors focus:outline-none ${
                      isSelected ? 'bg-canvas text-accent-link' : 'text-text-primary hover:bg-canvas/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getIcon(res.type)}
                      <div className="overflow-hidden">
                        <div className="text-sm font-sans font-medium truncate">
                          {res.title}
                        </div>
                        <div className="text-[11px] font-sans text-text-secondary truncate">
                          {res.sublabel}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {res.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-sans font-medium uppercase tracking-wider border ${
                          res.status === 'published' || res.status === 'resolved'
                            ? 'bg-[var(--semantic-success-bg,#EAF5EE)] text-[#1A6640] border-[#9FDCBA]'
                            : res.status === 'in_review'
                            ? 'bg-[var(--semantic-warning-bg,#FDF3DC)] text-[#7A4F00] border-[#F0D89A]'
                            : res.status === 'archived'
                            ? 'bg-canvas text-text-muted border-border-default'
                            : 'bg-canvas text-text-secondary border-border-default'
                        }`}>
                          {res.status === 'resolved' && (isNepali ? 'समाधान' : 'RESOLVED')}
                          {res.status === 'pending' && (isNepali ? 'बाँकी' : 'PENDING')}
                          {res.status !== 'resolved' && res.status !== 'pending' && res.status.replace('_', ' ')}
                        </span>
                      )}
                      
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-text-muted" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <p className="text-sm text-text-secondary">
                {isNepali ? 'कुनै नतिजा फेला परेन' : 'No results found matching your query'}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {isNepali ? 'अन्य कभर वा कन्ट्रास्ट कीवर्ड प्रयास गर्नुहोस्' : 'Try searching for other words like "ramp", "screen reader", or "accessible"'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border-default bg-section-rail text-[11px] text-text-muted">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="font-mono bg-surface border border-border-strong px-1 rounded">↓↑</kbd>{' '}
              {isNepali ? 'हिँड्न' : 'to navigate'}
            </span>
            <span>
              <kbd className="font-mono bg-surface border border-border-strong px-1 rounded">Enter</kbd>{' '}
              {isNepali ? 'खोल्न' : 'to select'}
            </span>
          </div>
          <div>
            {isNepali ? 'DFAO संस्थागत खोज' : 'Institutional DFAO Search'}
          </div>
        </div>
      </div>
    </div>
  );
}
