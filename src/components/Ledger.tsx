/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Check,
  Edit2,
  Trash2,
  Archive,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  List,
  Grid
} from 'lucide-react';
import { Blog, Project, Program, ContactSubmission } from '../types';

interface LedgerProps {
  tab: 'blogs' | 'projects' | 'programs' | 'submissions';
  blogs: Blog[];
  projects: Project[];
  programs: Program[];
  submissions: ContactSubmission[];
  isNepali: boolean;
  onEditItem: (type: 'blog' | 'project' | 'program', id: string) => void;
  onAddNewItem: (type: 'blog' | 'project' | 'program') => void;
  onArchiveItem: (type: 'blog' | 'project' | 'program', id: string) => void;
  onDeleteItem: (type: 'blog' | 'project' | 'program' | 'submission', id: string) => void;
  onToggleFeatured: (type: 'blog' | 'project' | 'program', id: string) => void;
  onResolveSubmission: (id: string, notes?: string) => void;
  onBulkAction: (action: 'publish' | 'archive' | 'delete', ids: string[]) => void;
}

export default function Ledger({
  tab,
  blogs,
  projects,
  programs,
  submissions,
  isNepali,
  onEditItem,
  onAddNewItem,
  onArchiveItem,
  onDeleteItem,
  onToggleFeatured,
  onResolveSubmission,
  onBulkAction
}: LedgerProps) {
  // Local ledger states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const itemsPerPage = 8;
  
  // Local submission note dialog
  const [showResolveModal, setShowResolveModal] = useState<string | null>(null);
  const [resNotes, setResNotes] = useState('');

  // Clear selections when tab changes
  React.useEffect(() => {
    setSelectedIds([]);
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  }, [tab]);

  // Determine page structure
  const getPageTitle = () => {
    switch (tab) {
      case 'blogs': return isNepali ? 'ब्लग र समाचार प्रविष्टिहरू' : 'Blogs & Editorial Entries';
      case 'projects': return isNepali ? 'DFAO वकालत आयोजनाहरू' : 'DFAO Advocacy & Ramp Projects';
      case 'programs': return isNepali ? 'तालिम, कार्यशाला र कार्यक्रमहरू' : 'Workshops & Advocacy Programs';
      case 'submissions': return isNepali ? 'नागरिक जिज्ञासा र सोधपुछ' : 'Citizens Inquiries & Consultancy Request Inbox';
    }
  };

  // Get source array
  const getRawItems = () => {
    if (tab === 'blogs') return blogs;
    if (tab === 'projects') return projects;
    if (tab === 'programs') return programs;
    return submissions;
  };

  const rawItems = getRawItems();

  // Distinct category choices for filter bar
  const getCategories = () => {
    if (tab === 'blogs') {
      const cats = Array.from(new Set(blogs.map(b => isNepali ? b.categoryNp : b.categoryEn)));
      return cats;
    }
    if (tab === 'projects') {
      const locs = Array.from(new Set(projects.map(p => isNepali ? p.locationNp : p.locationEn)));
      return locs;
    }
    if (tab === 'programs') {
      const vens = Array.from(new Set(programs.map(p => isNepali ? p.venueNp : p.venueEn)));
      return vens;
    }
    return [];
  };

  const categories = getCategories();

  // Search, filter, page slicing
  const filteredItems = rawItems.filter((item: any) => {
    // 1. Search Query Match
    let searchMatch = false;
    const q = search.toLowerCase();
    if (tab === 'blogs') {
      searchMatch =
        item.titleEn.toLowerCase().includes(q) ||
        item.titleNp.toLowerCase().includes(q) ||
        item.bodyEn.toLowerCase().includes(q) ||
        item.categoryEn.toLowerCase().includes(q);
    } else if (tab === 'projects') {
      searchMatch =
        item.titleEn.toLowerCase().includes(q) ||
        item.titleNp.toLowerCase().includes(q) ||
        item.locationEn.toLowerCase().includes(q) ||
        item.statusEn.toLowerCase().includes(q);
    } else if (tab === 'programs') {
      searchMatch =
        item.titleEn.toLowerCase().includes(q) ||
        item.titleNp.toLowerCase().includes(q) ||
        item.venueEn.toLowerCase().includes(q);
    } else {
      // Submissions
      searchMatch =
        item.name.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q);
    }

    if (search && !searchMatch) return false;

    // 2. Status Filter Match
    if (statusFilter !== 'all') {
      if (tab === 'submissions') {
        const isResolved = statusFilter === 'resolved';
        if (item.resolved !== isResolved) return false;
      } else {
        if (item.status !== statusFilter) return false;
      }
    }

    // 3. Category/Mapping Field Match
    if (categoryFilter !== 'all') {
      if (tab === 'blogs') {
        const itemCat = isNepali ? item.categoryNp : item.categoryEn;
        if (itemCat !== categoryFilter) return false;
      } else if (tab === 'projects') {
        const itemLoc = isNepali ? item.locationNp : item.locationEn;
        if (itemLoc !== categoryFilter) return false;
      } else if (tab === 'programs') {
        const itemVen = isNepali ? item.venueNp : item.venueEn;
        if (itemVen !== categoryFilter) return false;
      }
    }

    return true;
  });

  // Calculate pages
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Selection state helpers
  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const paginatedIds = paginatedItems.map((item: any) => item.id);
    const allSelectedInView = paginatedIds.every(id => selectedIds.includes(id));
    
    if (allSelectedInView) {
      setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...paginatedIds])));
    }
  };

  // Perform bulk processes
  const handleBulkSubmit = (action: 'publish' | 'archive' | 'delete') => {
    if (selectedIds.length === 0) return;
    onBulkAction(action, selectedIds);
    setSelectedIds([]);
  };

  // Submissions resolver custom input helper
  const handleOpenResolve = (id: string) => {
    const sub = submissions.find(s => s.id === id);
    setResNotes(sub?.notes || '');
    setShowResolveModal(id);
  };

  const handleSaveResolution = () => {
    if (showResolveModal) {
      onResolveSubmission(showResolveModal, resNotes);
      setShowResolveModal(null);
      setResNotes('');
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header (Model B layout start) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between select-none pb-1">
        <div>
          <h1 className="text-xl font-display italic text-text-primary">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {isNepali 
              ? `दर्ता सूची: कुल ${filteredItems.length} प्रविष्टिहरू लोड गरियो`
              : `Worktable Ledgers: Showing ${filteredItems.length} of ${rawItems.length} total entries`
            }
          </p>
        </div>

        {tab !== 'submissions' && (
          <button
            onClick={() => onAddNewItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program')}
            className="mt-3 sm:mt-0 px-3.5 h-[34px] bg-accent-primary text-white text-xs font-sans font-medium rounded-[3px] hover:bg-accent-primary/90 focus:outline-none focus:ring-1 focus:ring-accent-primary inline-flex items-center gap-1 transition-colors shrink-0"
          >
            + {isNepali ? 'सामाग्री थप्नुहोस्' : `Create New ${tab.substring(0, tab.length - 1)}`}
          </button>
        )}
      </div>

      {/* 2. Search & Filters Bar (Model B: horizontal strip, no sidebars) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3 bg-surface border border-border-default rounded-[3px] select-none">
        
        {/* Search input */}
        <div className="flex items-center gap-2 bg-canvas border border-border-default px-3 py-1.5 rounded-[3px] grow max-w-xl">
          <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-sans text-text-primary bg-transparent border-none outline-none focus:outline-none focus:ring-0"
            placeholder={isNepali ? "शीर्षक वा विवरणमा खोज्नुहोस्..." : `Filter current entries in worklist...`}
          />
        </div>

        {/* Filters group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 border-r border-border-default pr-3">
            <span className="text-[10px] uppercase font-sans font-medium tracking-wide text-text-muted">
              {isNepali ? 'अवस्था:' : 'Status:'}
            </span>
            <div className="flex bg-canvas p-0.5 rounded-[3px] border border-border-default">
              <button
                onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${
                  statusFilter === 'all' ? 'bg-surface text-text-primary border border-border-default' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isNepali ? 'सबै' : 'All'}
              </button>
              {tab !== 'submissions' ? (
                <>
                  <button
                    onClick={() => { setStatusFilter('draft'); setCurrentPage(1); }}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${
                      statusFilter === 'draft' ? 'bg-surface text-text-primary border border-border-default' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {isNepali ? 'मस्यौदा' : 'Draft'}
                  </button>
                  <button
                    onClick={() => { setStatusFilter('in_review'); setCurrentPage(1); }}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${
                      statusFilter === 'in_review' ? 'bg-surface text-text-primary border border-border-default' : 'text-text-secondary hover:text-text-with-review'
                    }`}
                  >
                    {isNepali ? 'समीक्षा' : 'Review'}
                  </button>
                  <button
                    onClick={() => { setStatusFilter('published'); setCurrentPage(1); }}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${
                      statusFilter === 'published' ? 'bg-surface text-[#1A6640] border border-border-default' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {isNepali ? 'प्रकाशित' : 'Published'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${
                      statusFilter === 'pending' ? 'bg-surface text-red-700 border border-border-default' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {isNepali ? 'बाँकी' : 'Pending'}
                  </button>
                  <button
                    onClick={() => { setStatusFilter('resolved'); setCurrentPage(1); }}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${
                      statusFilter === 'resolved' ? 'bg-surface text-[#1A6640] border border-border-default' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {isNepali ? 'समाधान' : 'Resolved'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Contextual Category/Location filter dropdown */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-sans font-medium tracking-wide text-text-muted">
                {isNepali ? 'दायर:' : 'Scope:'}
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-canvas border border-border-default py-1 px-2 rounded-[3px] text-text-secondary outline-none focus:border-accent-link"
              >
                <option value="all">{isNepali ? 'सबै विभागहरू' : 'All Departments'}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset button */}
          {(search || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setCurrentPage(1);
              }}
              className="text-[11px] text-accent-link hover:underline font-medium hover:text-accent-link/85 focus:outline-none"
            >
              {isNepali ? 'फिल्टरहरू हटाउनुहोस्' : 'Clear Filters'}
            </button>
          )}

          {/* List vs Grid View Toggle */}
          <div className="flex bg-canvas p-0.5 rounded-[3px] border border-border-default ml-auto sm:ml-0 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-[2px] transition-colors focus:outline-none ${viewMode === 'list' ? 'bg-surface text-text-primary border border-border-default shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              title={isNepali ? "सूची दृश्य" : "List view"}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-[2px] transition-colors focus:outline-none ${viewMode === 'grid' ? 'bg-surface text-text-primary border border-border-default shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              title={isNepali ? "ग्रिड दृश्य" : "Grid view"}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bulk Action Sliding Indicator Panel */}
      {selectedIds.length > 0 && (
        <div
          id="bulk-action-panel"
          className="flex items-center justify-between p-3.5 bg-accent-primary text-white border border-border-strong rounded-[3px] select-none animate-slide-down"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs font-sans">
              <strong>{selectedIds.length}</strong> {isNepali ? 'प्रविष्टिहरू चयन गरियो। सामूहिक सम्पादन गर्न सकिन्छ।' : 'rows selected. Apply administrative bulk actions:'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tab !== 'submissions' && (
              <>
                <button
                  onClick={() => handleBulkSubmit('publish')}
                  className="px-2.5 py-1 text-xs font-sans font-medium bg-white text-accent-primary hover:bg-gray-100 rounded-[3px] focus:outline-none"
                >
                  {isNepali ? 'प्रकाशन' : 'Bulk Publish'}
                </button>
                <button
                  onClick={() => handleBulkSubmit('archive')}
                  className="px-2.5 py-1 text-xs font-sans font-medium bg-[#5C5C58] text-white hover:bg-gray-700/80 rounded-[3px] border border-[#2E2E2B] focus:outline-none"
                >
                  {isNepali ? 'अभिलेखागार' : 'Bulk Archive'}
                </button>
              </>
            )}
            <button
              onClick={() => handleBulkSubmit('delete')}
              className="px-2.5 py-1 text-xs font-sans font-medium bg-red-700 hover:bg-red-800 text-white rounded-[3px] focus:outline-none"
            >
              {isNepali ? 'सामूहिक हटाउने' : 'Delete Selected'}
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-xs font-sans text-gray-300 hover:text-white"
            >
              {isNepali ? 'रद्द' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* 4. Table Grid Area (Standard 100% full width, top+bottom borders only, NO custom floating card shadows) */}
      <div className="border-t border-b border-border-default bg-surface rounded-[2px] overflow-x-auto">
        {paginatedItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-canvas/30">
              {paginatedItems.map((item: any) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group bg-surface border border-border-default hover:border-border-strong rounded-[4px] overflow-hidden flex flex-col justify-between transition-all duration-200 relative ${
                      isSelected ? 'ring-1 ring-accent-link border-accent-link shadow-sm' : 'shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    {/* Top checkbox and star header */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 select-none">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(item.id)}
                        className="rounded-sm border-border-strong h-3.5 w-3.5 bg-surface accent-accent-primary focus:ring-0"
                      />
                      {tab !== 'submissions' && (
                        <button
                          onClick={() => onToggleFeatured(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                          className={`p-1 bg-surface rounded-[3px] border border-border-default hover:bg-canvas transition-colors ${
                            item.featured ? 'text-[#7A4F00]' : 'text-text-muted hover:text-text-secondary'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Card Content wrapper */}
                    <div>
                      {tab !== 'submissions' && (
                        <div className="h-40 bg-canvas overflow-hidden border-b border-border-default relative">
                          <img
                            src={isNepali ? item.imageNp : item.imageEn}
                            alt={isNepali ? item.imageAltNp : item.imageAltEn}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-2 right-2">
                            <span className={`px-2 py-0.5 text-[9px] tracking-wider rounded-[3px] border uppercase font-sans font-bold bg-white/95 backdrop-blur-none inline-block ${
                              item.status === 'published'
                                ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                                : item.status === 'in_review'
                                ? 'bg-[#FDF3DC] text-[#7A4F00] border-[#F0D89A]'
                                : 'bg-canvas text-text-secondary border-border-default'
                            }`}>
                              {item.status === 'published' && (isNepali ? 'प्रकाशित' : 'PUBLISHED')}
                              {item.status === 'in_review' && (isNepali ? 'समीक्षा' : 'IN REVIEW')}
                              {item.status === 'draft' && (isNepali ? 'मस्यौदा' : 'DRAFT')}
                              {item.status === 'archived' && (isNepali ? 'संग्रहीत' : 'ARCHIVED')}
                            </span>
                          </div>
                        </div>
                      )}

                      {tab === 'submissions' && (
                        <div className="p-4 bg-section-rail/30 border-b border-border-default flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-text-secondary uppercase select-none block">Contact Citizen</span>
                            <div className="text-xs font-bold text-text-primary mt-0.5">{item.name}</div>
                          </div>
                          <div>
                            {item.resolved ? (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-[#EAF5EE] text-[#1A6640] border border-[#9FDCBA] rounded-sm">
                                RESOLVED
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-red-100 text-red-700 border border-red-300 rounded-sm animate-pulse">
                                PENDING
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="p-4 space-y-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-text-muted font-bold block">
                          {tab === 'blogs' && (isNepali ? item.categoryNp : item.categoryEn)}
                          {tab === 'projects' && (isNepali ? item.locationNp : item.locationEn)}
                          {tab === 'programs' && (isNepali ? item.venueNp : item.venueEn)}
                          {tab === 'submissions' && `Citizen Inquiry`}
                        </span>
                        <h4 className="text-xs font-sans font-bold text-text-primary group-hover:text-accent-link line-clamp-1">
                          {tab === 'submissions' ? item.subject : (isNepali ? item.titleNp : item.titleEn)}
                        </h4>
                        <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                          {tab === 'submissions' ? item.message : (isNepali ? item.bodyNp : item.bodyEn)}
                        </p>

                        {tab === 'submissions' && item.notes && (
                          <div className="text-[10px] bg-[#EAF5EE] text-[#1A6640] p-1.5 rounded-[2px] border border-[#9FDCBA] font-sans">
                            <strong>{isNepali ? 'समाधान नोट:' : 'DFAO Note:'}</strong> {item.notes}
                          </div>
                        )}

                        {tab === 'projects' && (
                          <div className="flex items-center justify-between pt-1.5 text-[10px] font-mono select-none border-t border-border-default/30">
                            <span className="text-text-muted">{isNepali ? 'स्थान / स्थिति:' : 'Zone / Phase:'}</span>
                            <span className="text-text-primary font-bold">
                              {isNepali ? item.locationNp : item.locationEn} • {isNepali ? item.statusNp : item.statusEn}
                            </span>
                          </div>
                        )}

                        {tab === 'programs' && (
                          <div className="flex items-center justify-between pt-1.5 text-[10px] font-mono select-none border-t border-border-default/30">
                            <span className="text-text-muted">{isNepali ? 'मिति / स्थान:' : 'Date / Venue:'}</span>
                            <span className="text-[#1847A8] font-bold">
                              {isNepali ? item.dateNp : item.dateEn} • {isNepali ? item.venueNp : item.venueEn}
                            </span>
                          </div>
                        )}

                        {tab === 'blogs' && (
                          <div className="flex items-center justify-between pt-1.5 text-[10px] font-sans select-none border-t border-border-default/30 text-text-muted">
                            <span>Author: <strong className="text-text-primary font-medium">{isNepali ? item.authorNp : item.authorEn}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-section-rail/35 border-t border-border-default/60 flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {tab === 'submissions' ? (
                        <>
                          {!item.resolved && (
                            <button
                              onClick={() => handleOpenResolve(item.id)}
                              className="px-2 py-1 bg-[#1A6640] text-white text-[10px] font-sans font-semibold rounded-[3px] hover:bg-[#134D30] flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                              {isNepali ? 'उत्तर दिनुहोस्' : 'Resolve'}
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteItem('submission', item.id)}
                            className="p-1 hover:bg-red-50 text-text-muted hover:text-red-700 rounded-[3px] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onEditItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                            className="p-1 hover:bg-canvas text-text-secondary hover:text-accent-link rounded-[3px] transition-colors"
                            title="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onArchiveItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                            className="p-1 hover:bg-canvas text-text-secondary hover:text-text-primary rounded-[3px] transition-colors"
                            title="Archive item"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                            className="p-1 hover:bg-red-50 text-text-secondary hover:text-red-700 rounded-[3px] transition-colors"
                            title="Hard Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-border-strong bg-section-rail/45 text-[11px] font-sans font-semibold uppercase tracking-wider text-text-secondary select-none">
                <th className="px-5 py-3 w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      paginatedItems.length > 0 &&
                      paginatedItems.every((item: any) => selectedIds.includes(item.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded-sm border-border-strong accent-accent-primary"
                  />
                </th>
                
                {/* Dynamic Columns based on Tab */}
                {tab === 'blogs' && (
                  <>
                    <th className="px-4 py-3">{isNepali ? 'कभर' : 'Cover Image'}</th>
                    <th className="px-4 py-3">{isNepali ? 'शीर्षक' : 'Title'}</th>
                    <th className="px-4 py-3">{isNepali ? 'अनुभाग / श्रेणी' : 'Category'}</th>
                    <th className="px-4 py-3">{isNepali ? 'लेखक' : 'Author'}</th>
                    <th className="px-4 py-3">{isNepali ? 'अवस्था' : 'Status'}</th>
                  </>
                )}

                {tab === 'projects' && (
                  <>
                    <th className="px-4 py-3">{isNepali ? 'कभर' : 'Cover'}</th>
                    <th className="px-4 py-3">{isNepali ? 'आयोजनाको शीर्षक' : 'Advocacy Project Title'}</th>
                    <th className="px-4 py-3">{isNepali ? 'स्थानिय क्षेत्र' : 'Location Zone'}</th>
                    <th className="px-4 py-3">{isNepali ? 'स्थिति' : 'Project Phase'}</th>
                    <th className="px-4 py-3">{isNepali ? 'अवस्था' : 'Status'}</th>
                  </>
                )}

                {tab === 'programs' && (
                  <>
                    <th className="px-4 py-3">{isNepali ? 'कार्यशाला शीर्षक' : 'Workshop Title'}</th>
                    <th className="px-4 py-3">{isNepali ? 'मिति' : 'Scheduled Date'}</th>
                    <th className="px-4 py-3">{isNepali ? 'सम्पर्क स्थान' : 'Venue Target'}</th>
                    <th className="px-4 py-3">{isNepali ? 'अवस्था' : 'Status'}</th>
                  </>
                )}

                {tab === 'submissions' && (
                  <>
                    <th className="px-4 py-3">{isNepali ? 'पूछताछ नागरिक' : 'Citizen Contact'}</th>
                    <th className="px-4 py-3">{isNepali ? 'विषय' : 'Subject'}</th>
                    <th className="px-4 py-3">{isNepali ? 'ब्यहोरा' : 'Inbound Inquiry Message'}</th>
                    <th className="px-4 py-3">{isNepali ? 'कारबाही' : 'Status'}</th>
                  </>
                )}

                {tab !== 'submissions' && <th className="px-4 py-3 text-center">{isNepali ? 'विशेष' : 'Featured'}</th>}
                <th className="px-4 py-3 text-right">{isNepali ? 'सम्पादन कार्य' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item: any) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    id={`ledger-row-${item.id}`}
                    className={`border-b border-border-default/60 hover:bg-canvas/25 text-sm transition-colors group ${
                      isSelected ? 'bg-canvas/40 border-l-2 border-accent-link pl-1' : ''
                    }`}
                  >
                    {/* Checkbox cell */}
                    <td className="px-5 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(item.id)}
                        className="rounded-sm border-border-strong accent-accent-primary focus:ring-accent-primary"
                      />
                    </td>

                    {/* Blogs Specific Cells */}
                    {tab === 'blogs' && (
                      <>
                        <td className="px-4 py-3">
                          <img
                            src={isNepali ? item.imageNp : item.imageEn}
                            alt={isNepali ? item.imageAltNp : item.imageAltEn}
                            className="w-12 h-8 object-cover rounded-[2px]"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="px-4 py-3 max-w-[280px]">
                          <div className="font-sans font-semibold text-text-primary truncate">
                            {isNepali ? item.titleNp : item.titleEn}
                          </div>
                          <div className="text-[10px] text-text-muted mt-0.5 truncate max-w-[260px]">
                            {isNepali ? item.bodyNp.substring(0, 90) : item.bodyEn.substring(0, 90)}...
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary">
                          {isNepali ? item.categoryNp : item.categoryEn}
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary select-none font-medium text-text-primary">
                          {isNepali ? item.authorNp : item.authorEn}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] tracking-wider rounded-[3px] border uppercase font-sans font-medium text-center inline-block ${
                            item.status === 'published'
                              ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                              : item.status === 'in_review'
                              ? 'bg-[#FDF3DC] text-[#7A4F00] border-[#F0D89A]'
                              : item.status === 'archived'
                              ? 'bg-canvas text-text-muted border-border-default'
                              : 'bg-canvas text-text-secondary border-border-default'
                          }`}>
                            {item.status === 'published' && (isNepali ? 'प्रकाशित' : 'PUBLISHED')}
                            {item.status === 'in_review' && (isNepali ? 'समीक्षा' : 'IN REVIEW')}
                            {item.status === 'draft' && (isNepali ? 'मस्यौदा' : 'DRAFT')}
                            {item.status === 'archived' && (isNepali ? 'संग्रहीत' : 'ARCHIVED')}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Projects Specific Cells */}
                    {tab === 'projects' && (
                      <>
                        <td className="px-4 py-3">
                          <img
                            src={isNepali ? item.imageNp : item.imageEn}
                            alt={isNepali ? item.imageAltNp : item.imageAltEn}
                            className="w-12 h-8 object-cover rounded-[2px]"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="px-4 py-3 max-w-[280px]">
                          <div className="font-sans font-semibold text-text-primary truncate">
                            {isNepali ? item.titleNp : item.titleEn}
                          </div>
                          <div className="text-[10px] text-text-muted truncate max-w-[260px]">
                            {isNepali ? item.descriptionNp : item.descriptionEn}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary">
                          {isNepali ? item.locationNp : item.locationEn}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] rounded-[3px] border uppercase font-mono font-medium ${
                            item.statusEn === 'Ongoing'
                              ? 'bg-[#EEF3FC] text-[#1847A8] border-[#9DB8EC]'
                              : 'bg-canvas text-[#1D1D1B] border-border-strong'
                          }`}>
                            {isNepali ? item.statusNp : item.statusEn}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] tracking-wider rounded-[3px] border uppercase font-sans font-medium text-center inline-block ${
                            item.status === 'published'
                              ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                              : item.status === 'in_review'
                              ? 'bg-[#FDF3DC] text-[#7A4F00] border-[#F0D89A]'
                              : 'bg-canvas text-text-muted border-border-default'
                          }`}>
                            {item.status === 'published' && (isNepali ? 'प्रकाशित' : 'PUBLISHED')}
                            {item.status === 'in_review' && (isNepali ? 'समीक्षा' : 'IN REVIEW')}
                            {item.status === 'draft' && (isNepali ? 'मस्यौदा' : 'DRAFT')}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Programs Specific Cells */}
                    {tab === 'programs' && (
                      <>
                        <td className="px-4 py-3 max-w-[260px]">
                          <div className="font-sans font-semibold text-text-primary truncate">
                            {isNepali ? item.titleNp : item.titleEn}
                          </div>
                          <div className="text-[10px] text-text-muted truncate mt-0.5">
                            {isNepali ? item.descriptionNp : item.descriptionEn}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-text-secondary select-all">
                          {isNepali ? item.dateNp : item.dateEn}
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary font-medium">
                          {isNepali ? item.venueNp : item.venueEn}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] tracking-wider rounded-[3px] border uppercase font-sans font-medium text-center inline-block ${
                            item.status === 'published'
                              ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                              : 'bg-canvas text-text-secondary border-border-default'
                          }`}>
                            {item.status === 'published' && (isNepali ? 'प्रकाशित' : 'PUBLISHED')}
                            {item.status === 'draft' && (isNepali ? 'मस्यौदा' : 'DRAFT')}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Contact Submissions Specific Cells */}
                    {tab === 'submissions' && (
                      <>
                        <td className="px-4 py-3">
                          <div className="font-sans font-bold text-text-primary">{item.name}</div>
                          <div className="text-[10px] text-text-secondary font-mono mt-0.5 select-all">{item.email} • {item.phone}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-text-primary max-w-[180px] truncate">
                          {item.subject}
                        </td>
                        <td className="px-4 py-3 max-w-[240px]">
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          {item.notes && (
                            <div className="mt-1 text-[10px] text-[#1A6640] bg-[#EAF5EE] border border-[#9FDCBA] p-1 rounded-[3px] font-sans truncate">
                              <strong>{isNepali ? 'समाधान नोट:' : 'DFAO Note:'}</strong> {item.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.resolved ? (
                            <span className="px-2 py-0.5 text-[10px] rounded-[3px] font-semibold bg-[#EAF5EE] text-[#1A6640] border border-[#9FDCBA] inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {isNepali ? 'समाधान' : 'RESOLVED'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] rounded-[3px] font-semibold bg-red-100 text-red-700 border border-red-300 inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 animate-pulse" />
                              {isNepali ? 'बाँकी' : 'PENDING'}
                            </span>
                          )}
                        </td>
                      </>
                    )}

                    {/* Featured Star toggle (All files except submissions) */}
                    {tab !== 'submissions' && (
                      <td className="px-4 py-3 text-center align-middle">
                        <button
                          onClick={() => onToggleFeatured(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                          className={`p-1 rounded-[3px] hover:bg-canvas transition-colors focus:outline-none ${
                            item.featured ? 'text-[#7A4F00]' : 'text-text-muted hover:text-text-secondary'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${item.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                    )}

                    {/* Inline actions (appear on hovering row) */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                        {tab === 'submissions' ? (
                          <>
                            {!item.resolved && (
                              <button
                                onClick={() => handleOpenResolve(item.id)}
                                className="px-2 py-1 bg-[#1A6640] hover:bg-[#134D30] text-xs font-sans text-white font-medium rounded-[3px] hover:shadow-sm inline-flex items-center gap-1 hover:scale-101 border border-transparent"
                                title="Solve query with advisory notes"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                {isNepali ? 'उत्तर दिनुहोस्' : 'Resolve'}
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteItem('submission', item.id)}
                              className="p-1 hover:bg-red-50 text-text-muted hover:text-red-700 rounded-[3px] focus:outline-none"
                              title="Delete Submission Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onEditItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                              className="p-1 hover:bg-canvas text-text-secondary hover:text-accent-link rounded-[3px] focus:outline-none"
                              title={isNepali ? "सम्पादन" : "Edit details"}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onArchiveItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                              className="p-1 hover:bg-canvas text-text-secondary hover:text-text-primary rounded-[3px] focus:outline-none"
                              title={isNepali ? "अभिलेखागार" : "Archive item"}
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteItem(tab === 'blogs' ? 'blog' : tab === 'projects' ? 'project' : 'program', item.id)}
                              className="p-1 hover:bg-red-50 text-text-secondary hover:text-red-700 rounded-[3px] focus:outline-none"
                              title={isNepali ? "हटाउनुहोस्" : "Hard delete entry"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )
        ) : (
          <div className="border border-dashed border-border-strong rounded-[3px] m-4 py-16 text-center select-none bg-canvas/20">
            <p className="text-sm font-sans font-medium text-text-secondary">
              {isNepali ? 'कुनै डेटा रेकर्डहरू फेला परेन' : 'No entries available in this filtered view'}
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
              {isNepali 
                ? 'माथिको खोज सर्तहरू बदल्नुहोस् वा दायाँ शीर्षबाट नयाँ डेटा प्रविष्टि थप्नुहोस्।'
                : 'Modify active filter tags, reset searching words or insert a brand new item entry into ledger database.'
              }
            </p>
          </div>
        )}
      </div>

      {/* 5. Pagination Bar (Model B: simple, bottom-right) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between select-none pt-2">
          <span className="text-xs text-text-secondary">
            {isNepali 
              ? `${totalItems} मध्ये ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, totalItems)} देखाउँदै`
              : `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, totalItems)} of ${totalItems} entries`
            }
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-border-default hover:bg-canvas bg-surface disabled:opacity-40 disabled:hover:bg-surface rounded-[3px] focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-sans text-text-primary px-2 font-semibold">
              {isNepali ? `पृष्ठ ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-border-default hover:bg-canvas bg-surface disabled:opacity-40 disabled:hover:bg-surface rounded-[3px] focus:outline-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Minimal Resolve Modal Option for Submissions */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-none animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border-default rounded-[3px] p-5 shadow-md">
            <h3 className="text-sm font-sans font-bold uppercase tracking-tight text-text-primary mb-3">
              {isNepali ? 'नागरिक सोधपुछ समाधान परामर्श नोट' : 'Consultancy Resolve Inquiry Note'}
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              {isNepali 
                ? 'यस नागरिकको जिज्ञासा समाधान गर्नका लागि चालिएका कदमहरूको संक्षिप्त टिप्पणी दर्ता गर्नुहोस्।'
                : 'Write down action logs or technical notes regarding this consultation request. This will be saved internally in DFAO database.'}
            </p>
            <textarea
              value={resNotes}
              onChange={(e) => setResNotes(e.target.value)}
              className="w-full h-28 p-2.5 text-xs text-text-primary placeholder-text-muted bg-canvas border border-border-default rounded-[3px] focus:border-border-focus outline-none leading-normal"
              placeholder={isNepali ? "उदाहरण: लाजिम्पाट केन्द्र कार्यालयमा आवश्यक र्याम्प परामर्श सेवा प्रदान गरियो।" : "Type advice, blue-prints provided or scholarship confirmation..."}
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => { setShowResolveModal(null); setResNotes(''); }}
                className="px-3 py-1.5 text-xs font-sans text-text-secondary border border-border-default rounded-[3px] hover:bg-canvas focus:outline-none"
              >
                {isNepali ? 'रद्द' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveResolution}
                className="px-3 py-1.5 text-xs font-sans text-white bg-[#1A6640] hover:bg-[#145232] rounded-[3px] font-medium focus:outline-none"
              >
                {isNepali ? 'समाधान दर्ता गर्नुहोस्' : 'Confirm Resolved Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
