/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_BLOGS,
  INITIAL_PROJECTS,
  INITIAL_PROGRAMS,
  INITIAL_GALLERY,
  INITIAL_SUBMISSIONS,
  INITIAL_LOGS,
  INITIAL_CAROUSEL,
  INITIAL_ABOUT
} from './mockData';
import { Blog, Project, Program, ContactSubmission, ActivityLog, GalleryCollection, CarouselSlide, AboutUsSettings } from './types';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ControlRoom from './components/ControlRoom';
import Ledger from './components/Ledger';
import DocumentEditor from './components/DocumentEditor';
import CommandPalette from './components/CommandPalette';
import SiteCustomizer from './components/SiteCustomizer';
import GuestPortal from './components/GuestPortal';
import { Sparkles, MessageSquare, AlertCircle, CheckCircle2, X, Bell, Trash2, Info, Plus } from 'lucide-react';

interface ToastNotify {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export default function App() {
  // 1. Language, View Mode and Notifications states
  const [isNepali, setIsNepali] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'guest' | 'admin'>('guest');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'notif-1',
      titleEn: 'Standard physical Wheelchair Ramp layout guidelines updated by DFAO Team.',
      titleNp: 'डि-एफ-ए-ओ टोलीद्वारा ह्विलचेयर र्‍याम्प निर्माण निर्देशिका अद्यावधिक गरियो।',
      timeAgoEn: '2 mins ago',
      timeAgoNp: '२ मिनेट अगाडि',
      type: 'success',
      read: false
    },
    {
      id: 'notif-2',
      titleEn: 'New contact submission from Ramila Thapa on public access query.',
      titleNp: 'रमिला थापाबाट सार्वजनिक स्थान पहुँच सुधार सम्बन्धी सोधपुछ प्राप्त भयो।',
      timeAgoEn: '15 mins ago',
      timeAgoNp: '१५ मिनेट अगाडि',
      type: 'info',
      read: false
    },
    {
      id: 'notif-3',
      titleEn: 'Physical accessibility road-block warning reported in Lazimpat Crossing.',
      titleNp: 'लाजिम्पाट चोकमा आकस्मिक मार्ग अवरोध सूचना दर्ता भयो।',
      timeAgoEn: '1 hour ago',
      timeAgoNp: '१ घण्टा अगाडि',
      type: 'warning',
      read: false
    }
  ]);

  // Editor Orchestration
  const [editingItem, setEditingItem] = useState<{
    type: 'blog' | 'project' | 'program' | 'gallery';
    id?: string;
  } | null>(null);

  // 2. Persistent State Engines
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [gallery, setGallery] = useState<GalleryCollection[]>([]);
  
  // Custom Site States
  const [carousel, setCarousel] = useState<CarouselSlide[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUsSettings | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastNotify[]>([]);

  const addToast = (message: string, type: ToastNotify['type'] = 'success') => {
    const id = 't-' + Math.floor(Math.random() * 10000);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove except for error variant
    if (type !== 'error') {
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Seed data from localStorage or initial mock datasets
  useEffect(() => {
    const localBlogs = localStorage.getItem('dfao_blogs');
    const localProjects = localStorage.getItem('dfao_projects');
    const localPrograms = localStorage.getItem('dfao_programs');
    const localSubmissions = localStorage.getItem('dfao_submissions');
    const localLogs = localStorage.getItem('dfao_logs');
    const localGallery = localStorage.getItem('dfao_gallery');

    if (localBlogs) setBlogs(JSON.parse(localBlogs));
    else {
      setBlogs(INITIAL_BLOGS);
      localStorage.setItem('dfao_blogs', JSON.stringify(INITIAL_BLOGS));
    }

    if (localProjects) setProjects(JSON.parse(localProjects));
    else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('dfao_projects', JSON.stringify(INITIAL_PROJECTS));
    }

    if (localPrograms) setPrograms(JSON.parse(localPrograms));
    else {
      setPrograms(INITIAL_PROGRAMS);
      localStorage.setItem('dfao_programs', JSON.stringify(INITIAL_PROGRAMS));
    }

    if (localSubmissions) setSubmissions(JSON.parse(localSubmissions));
    else {
      setSubmissions(INITIAL_SUBMISSIONS);
      localStorage.setItem('dfao_submissions', JSON.stringify(INITIAL_SUBMISSIONS));
    }

    if (localLogs) setLogs(JSON.parse(localLogs));
    else {
      setLogs(INITIAL_LOGS);
      localStorage.setItem('dfao_logs', JSON.stringify(INITIAL_LOGS));
    }

    if (localGallery) setGallery(JSON.parse(localGallery));
    else {
      setGallery(INITIAL_GALLERY);
      localStorage.setItem('dfao_gallery', JSON.stringify(INITIAL_GALLERY));
    }

    const localCarousel = localStorage.getItem('dfao_carousel');
    const localAbout = localStorage.getItem('dfao_about');

    if (localCarousel) setCarousel(JSON.parse(localCarousel));
    else {
      setCarousel(INITIAL_CAROUSEL);
      localStorage.setItem('dfao_carousel', JSON.stringify(INITIAL_CAROUSEL));
    }

    if (localAbout) setAboutUs(JSON.parse(localAbout));
    else {
      setAboutUs(INITIAL_ABOUT);
      localStorage.setItem('dfao_about', JSON.stringify(INITIAL_ABOUT));
    }
  }, []);

  // Sync to local storage on changes
  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSimulateNotification = (messageEn: string, messageNp?: string) => {
    const id = 'notif-' + Date.now();
    const newNotif = {
      id,
      titleEn: messageEn,
      titleNp: messageNp || messageEn,
      timeAgoEn: 'Just now',
      timeAgoNp: 'भर्खरै',
      type: 'info' as const,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(isNepali && messageNp ? messageNp : messageEn, 'info');

    // Also append to active CMS logging
    const newLog: ActivityLog = {
      id: 'log-' + Math.floor(Math.random() * 10000),
      action: 'Public Sim Action',
      actionNp: 'सार्वजनिक गतिविधि सूचना',
      contentType: 'submission',
      contentNameEn: messageEn,
      contentNameNp: messageNp || messageEn,
      userEn: 'Public Guest Visitor',
      userNp: 'सार्वजनिक नागरिक आगन्तुक',
      timeAgoEn: 'Just now',
      timeAgoNp: 'भर्खरै',
      createdAt: new Date().toISOString()
    };
    setLogs(prev => {
      const updated = [newLog, ...prev];
      saveToLocalStorage('dfao_logs', updated);
      return updated;
    });
  };

  const handleSubmitGuestContact = (newInquiry: Omit<ContactSubmission, 'id' | 'createdAt' | 'resolved'>) => {
    const id = 'sub-' + Date.now();
    const submissionItem: ContactSubmission = {
      ...newInquiry,
      id,
      createdAt: new Date().toISOString(),
      resolved: false
    };

    setSubmissions(prev => {
      const updated = [submissionItem, ...prev];
      saveToLocalStorage('dfao_submissions', updated);
      return updated;
    });
  };

  // Listen to CMD+K or Ctrl+K trigger global search
  useEffect(() => {
    const handleCmdKSearch = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleCmdKSearch);
    return () => window.removeEventListener('keydown', handleCmdKSearch);
  }, []);

  // Compute unread feedback count
  const unreadCount = submissions.filter(s => !s.resolved).length;

  // Navigation handlers
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setEditingItem(null); // Close editor if switching lists
  };

  const handleSelectSearchResult = (type: 'blog' | 'project' | 'program' | 'submission', id: string) => {
    if (type === 'submission') {
      setActiveTab('submissions');
      setEditingItem(null);
    } else {
      setActiveTab(type === 'blog' ? 'blogs' : type === 'project' ? 'projects' : 'programs');
      setEditingItem({ type, id });
    }
    addToast(isNepali ? `सामग्री लोड गरियो` : `Loaded query element successfully`, 'info');
  };

  // --- CONTENT CRUD EVENTS ---

  // Save content update/insert
  const handleSaveItem = (itemData: any) => {
    if (editingItem?.type === 'blog') {
      let isNew = !blogs.some(b => b.id === itemData.id);
      let nextBlogs = [];
      if (isNew) {
        nextBlogs = [itemData, ...blogs];
        // Insert Activity Log
        const newLog: ActivityLog = {
          id: 'log-' + Date.now(),
          action: 'Created blog draft',
          actionNp: 'ब्लग लेख मस्यौदा सिर्जना गरियो',
          contentType: 'blog',
          contentNameEn: itemData.titleEn,
          contentNameNp: itemData.titleNp,
          userEn: 'Supriya Devkota',
          userNp: 'सुप्रिया देवकोटा',
          timeAgoEn: 'Just now',
          timeAgoNp: 'भर्खरै',
          createdAt: new Date().toISOString()
        };
        const nextLogs = [newLog, ...logs];
        setLogs(nextLogs);
        saveToLocalStorage('dfao_logs', nextLogs);
      } else {
        nextBlogs = blogs.map(b => b.id === itemData.id ? itemData : b);
      }
      setBlogs(nextBlogs);
      saveToLocalStorage('dfao_blogs', nextBlogs);
      addToast(isNepali ? "ब्लग लेख सफलतापूर्वक सुरक्षित गरियो।" : "Blog item saved to workspace ledger.", 'success');
      
    } else if (editingItem?.type === 'project') {
      let isNew = !projects.some(p => p.id === itemData.id);
      let nextProjects = [];
      if (isNew) {
        nextProjects = [itemData, ...projects];
        const newLog: ActivityLog = {
          id: 'log-' + Date.now(),
          action: 'Initiated advocacy project',
          actionNp: 'पैरवी आयोजना सुरु गरियो',
          contentType: 'project',
          contentNameEn: itemData.titleEn,
          contentNameNp: itemData.titleNp,
          userEn: 'Supriya Devkota',
          userNp: 'सुप्रिया देवकोटा',
          timeAgoEn: 'Just now',
          timeAgoNp: 'भर्खरै',
          createdAt: new Date().toISOString()
        };
        const nextLogs = [newLog, ...logs];
        setLogs(nextLogs);
        saveToLocalStorage('dfao_logs', nextLogs);
      } else {
        nextProjects = projects.map(p => p.id === itemData.id ? itemData : p);
      }
      setProjects(nextProjects);
      saveToLocalStorage('dfao_projects', nextProjects);
      addToast(isNepali ? "पैरवी आयोजना सुरक्षित गरियो।" : "Advocacy project data updated.", 'success');

    } else if (editingItem?.type === 'program') {
      let isNew = !programs.some(pr => pr.id === itemData.id);
      let nextPrograms = [];
      if (isNew) {
        nextPrograms = [itemData, ...programs];
        const newLog: ActivityLog = {
          id: 'log-' + Date.now(),
          action: 'Scheduled campaign program',
          actionNp: 'पैरवी कार्यक्रम निर्धारित गरियो',
          contentType: 'program',
          contentNameEn: itemData.titleEn,
          contentNameNp: itemData.titleNp,
          userEn: 'Supriya Devkota',
          userNp: 'सुप्रिया देवकोटा',
          timeAgoEn: 'Just now',
          timeAgoNp: 'भर्खरै',
          createdAt: new Date().toISOString()
        };
        const nextLogs = [newLog, ...logs];
        setLogs(nextLogs);
        saveToLocalStorage('dfao_logs', nextLogs);
      } else {
        nextPrograms = programs.map(pr => pr.id === itemData.id ? itemData : pr);
      }
      setPrograms(nextPrograms);
      saveToLocalStorage('dfao_programs', nextPrograms);
      addToast(isNepali ? "तालिम कार्यक्रम विवरण सुरक्षित भयो।" : "Advocacy program details synchronized.", 'success');
    }

    setEditingItem(null); // Exit editor on success
  };

  // Hard Delete Content
  const handleDeleteItem = (type: any, id: string) => {
    if (type === 'blog') {
      const filtered = blogs.filter(b => b.id !== id);
      setBlogs(filtered);
      saveToLocalStorage('dfao_blogs', filtered);
    } else if (type === 'project') {
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      saveToLocalStorage('dfao_projects', filtered);
    } else if (type === 'program') {
      const filtered = programs.filter(pr => pr.id !== id);
      setPrograms(filtered);
      saveToLocalStorage('dfao_programs', filtered);
    } else if (type === 'submission') {
      const filtered = submissions.filter(s => s.id !== id);
      setSubmissions(filtered);
      saveToLocalStorage('dfao_submissions', filtered);
    }

    setEditingItem(null);
    addToast(isNepali ? "सामाग्री स्थायी रुपमा हटाइयो।" : "Content deleted from database files.", 'warning');
  };

  // Quick Archive
  const handleArchiveItem = (type: any, id: string) => {
    if (type === 'blog') {
      const updated = blogs.map(b => b.id === id ? { ...b, status: 'archived' as const } : b);
      setBlogs(updated);
      saveToLocalStorage('dfao_blogs', updated);
    } else if (type === 'project') {
      const updated = projects.map(p => p.id === id ? { ...p, status: 'archived' as const } : p);
      setProjects(updated);
      saveToLocalStorage('dfao_projects', updated);
    } else if (type === 'program') {
      const updated = programs.map(pr => pr.id === id ? { ...pr, status: 'archived' as const } : pr);
      setPrograms(updated);
      saveToLocalStorage('dfao_programs', updated);
    }

    setEditingItem(null);
    addToast(isNepali ? "सामाग्री संग्रहीत (Archived) गरियो।" : "Entry moved to archive catalog.", 'info');
  };

  // Toggle Featured status
  const handleToggleFeatured = (type: 'blog' | 'project' | 'program', id: string) => {
    if (type === 'blog') {
      const updated = blogs.map(b => b.id === id ? { ...b, featured: !b.featured } : b);
      setBlogs(updated);
      saveToLocalStorage('dfao_blogs', updated);
    } else if (type === 'project') {
      const updated = projects.map(p => p.id === id ? { ...p, featured: !p.featured } : p);
      setProjects(updated);
      saveToLocalStorage('dfao_projects', updated);
    } else if (type === 'program') {
      const updated = programs.map(pr => pr.id === id ? { ...pr, featured: !pr.featured } : pr);
      setPrograms(updated);
      saveToLocalStorage('dfao_programs', updated);
    }
    
    addToast(isNepali ? "विशेष सिफारिश ब्यापार परिवर्तन भयो।" : "Featured highlight status adjusted.", 'success');
  };

  // Quick Publish shortcut from Control Room list
  const handleQuickPublish = (type: 'blog' | 'project' | 'program', id: string) => {
    let title = '';
    if (type === 'blog') {
      const target = blogs.find(b => b.id === id);
      title = target ? target.titleEn : '';
      const updated = blogs.map(b => b.id === id ? { ...b, status: 'published' as const } : b);
      setBlogs(updated);
      saveToLocalStorage('dfao_blogs', updated);
    } else if (type === 'project') {
      const target = projects.find(p => p.id === id);
      title = target ? target.titleEn : '';
      const updated = projects.map(p => p.id === id ? { ...p, status: 'published' as const } : p);
      setProjects(updated);
      saveToLocalStorage('dfao_projects', updated);
    } else if (type === 'program') {
      const target = programs.find(pr => pr.id === id);
      title = target ? target.titleEn : '';
      const updated = programs.map(pr => pr.id === id ? { ...pr, status: 'published' as const } : pr);
      setPrograms(updated);
      saveToLocalStorage('dfao_programs', updated);
    }

    // Insert Log
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      action: 'Quick Published Item',
      actionNp: 'सामाग्री तुरुन्त प्रकाशित गरियो',
      contentType: type,
      contentNameEn: title,
      contentNameNp: title, 
      userEn: 'Supriya Devkota',
      userNp: 'सुप्रिया देवकोटा',
      timeAgoEn: 'Just now',
      timeAgoNp: 'भर्खरै',
      createdAt: new Date().toISOString()
    };
    const nextLogs = [newLog, ...logs];
    setLogs(nextLogs);
    saveToLocalStorage('dfao_logs', nextLogs);

    addToast(isNepali ? "सामाग्री सफलतापूर्वक प्रकाशित गरियो।" : "Review item quick published to public site.", 'success');
  };

  // Resolve Citizen Contact Submission
  const handleResolveSubmission = (id: string, notes?: string) => {
    const updated = submissions.map(s => s.id === id ? { ...s, resolved: true, notes } : s);
    setSubmissions(updated);
    saveToLocalStorage('dfao_submissions', updated);

    // Save Log
    const target = submissions.find(s => s.id === id);
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      action: 'Resolved inquiry notes',
      actionNp: 'सोधपुछ समाधान टिप्पणी दर्ता भयो',
      contentType: 'submission',
      contentNameEn: target ? target.subject : 'Citizen inquiry',
      contentNameNp: target ? target.subject : 'Inquiry details',
      userEn: 'Supriya Devkota',
      userNp: 'सुप्रिया देवकोटा',
      timeAgoEn: 'Just now',
      timeAgoNp: 'भर्खरै',
      createdAt: new Date().toISOString()
    };
    const nextLogs = [newLog, ...logs];
    setLogs(nextLogs);
    saveToLocalStorage('dfao_logs', nextLogs);

    addToast(isNepali ? "नागरिक जिज्ञासा सफलतापूर्वक समाधान भयो।" : "Citizens inquiry marked resolved.", 'success');
  };

  // Bulk operation actions handler (Ledger)
  const handleBulkAction = (action: 'publish' | 'archive' | 'delete', ids: string[]) => {
    if (activeTab === 'blogs') {
      let updated = [...blogs];
      if (action === 'publish') {
        updated = blogs.map(b => ids.includes(b.id) ? { ...b, status: 'published' as const } : b);
      } else if (action === 'archive') {
        updated = blogs.map(b => ids.includes(b.id) ? { ...b, status: 'archived' as const } : b);
      } else if (action === 'delete') {
        updated = blogs.filter(b => !ids.includes(b.id));
      }
      setBlogs(updated);
      saveToLocalStorage('dfao_blogs', updated);
    } else if (activeTab === 'projects') {
      let updated = [...projects];
      if (action === 'publish') {
        updated = projects.map(p => ids.includes(p.id) ? { ...p, status: 'published' as const } : p);
      } else if (action === 'archive') {
        updated = projects.map(p => ids.includes(p.id) ? { ...p, status: 'archived' as const } : p);
      } else if (action === 'delete') {
        updated = projects.filter(p => !ids.includes(p.id));
      }
      setProjects(updated);
      saveToLocalStorage('dfao_projects', updated);
    } else if (activeTab === 'programs') {
      let updated = [...programs];
      if (action === 'publish') {
        updated = programs.map(pr => ids.includes(pr.id) ? { ...pr, status: 'published' as const } : pr);
      } else if (action === 'archive') {
        updated = programs.map(pr => ids.includes(pr.id) ? { ...pr, status: 'archived' as const } : pr);
      } else if (action === 'delete') {
        updated = programs.filter(pr => !ids.includes(pr.id));
      }
      setPrograms(updated);
      saveToLocalStorage('dfao_programs', updated);
    } else if (activeTab === 'submissions') {
      if (action === 'delete') {
        const updated = submissions.filter(s => !ids.includes(s.id));
        setSubmissions(updated);
        saveToLocalStorage('dfao_submissions', updated);
      }
    }

    addToast(isNepali ? `${ids.length} वटा सामाग्रीमा सामूहिक कार्य पूरा भयो।` : `Administrative action ${action} applied to ${ids.length} rows.`, 'success');
  };

  if (viewMode === 'guest') {
    return (
      <GuestPortal
        blogs={blogs}
        projects={projects}
        programs={programs}
        carousel={carousel}
        about={aboutUs || INITIAL_ABOUT}
        isNepali={isNepali}
        setIsNepali={setIsNepali}
        onSwitchToAdmin={() => setViewMode('admin')}
        onSubmitContact={handleSubmitGuestContact}
        onSimulateNotification={(msg, msgNp) => handleSimulateNotification(msg, msgNp)}
      />
    );
  }

  return (
    <div className="cms-shell min-h-screen grid grid-cols-[auto_1fr] grid-rows-[52px_1fr] bg-canvas overflow-hidden relative">
      {/* Decorative ambient background glowing blue blobs for beautiful glassmorphism depth */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#9EC2F5] rounded-full blur-[140px] opacity-[0.38] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[25%] w-[50%] h-[50%] bg-[#B5D4FF] rounded-full blur-[120px] opacity-[0.32] pointer-events-none z-0" />
      <div className="absolute top-[25%] right-[-10%] w-[45%] h-[45%] bg-[#C8E1FF] rounded-full blur-[130px] opacity-[0.35] pointer-events-none z-0" />
      
      {/* 1. Global Search Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        blogs={blogs}
        projects={projects}
        programs={programs}
        submissions={submissions}
        onSelectResult={handleSelectSearchResult}
        isNepali={isNepali}
      />

      {/* 2. Topbar sticky segment */}
      <div className="col-span-2 row-span-1">
        <Topbar
          currentTab={activeTab}
          isNepali={isNepali}
          setIsNepali={setIsNepali}
          onOpenSearch={() => setIsSearchOpen(true)}
          activeEditorName={editingItem ? (editingItem.id ? 'Edit Item' : 'New Entry') : undefined}
          onSwitchToGuest={() => setViewMode('guest')}
          onToggleNotifications={() => setIsNotificationsOpen(prev => !prev)}
          unreadNotificationsCount={notifications.filter(n => !n.read).length}
        />
      </div>

      {/* 3. Navigation Sidebar Fixed Column */}
      <Sidebar
        currentTab={activeTab}
        setTab={handleSelectTab}
        isNepali={isNepali}
        onQuickCreate={(type) => setEditingItem({ type })}
        unreadCount={unreadCount}
      />

      {/* 4. Fluid Scrolling Main Area Content canvas */}
      <main className="overflow-y-auto no-scrollbar max-h-[calc(100vh-52px)]">
        <div className="p-6 md:p-8 max-w-[1280px] mx-auto w-full">
          
          {/* Active Workstation conditional router */}
          {editingItem ? (
            <DocumentEditor
              type={editingItem.type as any}
              itemId={editingItem.id}
              blogs={blogs}
              projects={projects}
              programs={programs}
              isNepali={isNepali}
              onSave={handleSaveItem}
              onCancel={() => setEditingItem(null)}
              onDelete={(id) => handleDeleteItem(editingItem.type, id)}
              onArchive={(id) => handleArchiveItem(editingItem.type, id)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <ControlRoom
                  blogs={blogs}
                  projects={projects}
                  programs={programs}
                  submissions={submissions}
                  logs={logs}
                  isNepali={isNepali}
                  onNavigateToTab={handleSelectTab}
                  onEditItem={(type, id) => setEditingItem({ type, id })}
                  onAddNewItem={(type) => setEditingItem({ type })}
                  onPublishShortcut={handleQuickPublish}
                />
              )}

              {activeTab === 'blogs' && (
                <Ledger
                  tab="blogs"
                  blogs={blogs}
                  projects={projects}
                  programs={programs}
                  submissions={submissions}
                  isNepali={isNepali}
                  onEditItem={(type, id) => setEditingItem({ type, id })}
                  onAddNewItem={(type) => setEditingItem({ type })}
                  onArchiveItem={handleArchiveItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleFeatured={handleToggleFeatured}
                  onResolveSubmission={handleResolveSubmission}
                  onBulkAction={handleBulkAction}
                />
              )}

              {activeTab === 'projects' && (
                <Ledger
                  tab="projects"
                  blogs={blogs}
                  projects={projects}
                  programs={programs}
                  submissions={submissions}
                  isNepali={isNepali}
                  onEditItem={(type, id) => setEditingItem({ type, id })}
                  onAddNewItem={(type) => setEditingItem({ type })}
                  onArchiveItem={handleArchiveItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleFeatured={handleToggleFeatured}
                  onResolveSubmission={handleResolveSubmission}
                  onBulkAction={handleBulkAction}
                />
              )}

              {activeTab === 'programs' && (
                <Ledger
                  tab="programs"
                  blogs={blogs}
                  projects={projects}
                  programs={programs}
                  submissions={submissions}
                  isNepali={isNepali}
                  onEditItem={(type, id) => setEditingItem({ type, id })}
                  onAddNewItem={(type) => setEditingItem({ type })}
                  onArchiveItem={handleArchiveItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleFeatured={handleToggleFeatured}
                  onResolveSubmission={handleResolveSubmission}
                  onBulkAction={handleBulkAction}
                />
              )}

              {activeTab === 'gallery' && (
                <div className="border border-dashed border-border-strong rounded-[3px] py-24 text-center bg-surface max-w-4xl mx-auto p-4">
                  <Sparkles className="w-8 h-8 text-accent-link mx-auto mb-3" />
                  <h2 className="text-base font-sans font-bold uppercase tracking-tight text-text-primary">
                    {isNepali ? 'अभियान तस्बिर संग्रह व्यवस्थापन' : 'Campaign Gallery Organizer'}
                  </h2>
                  <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                    {isNepali 
                      ? 'तस्बिर ग्यालरी संग्रह सिधै ब्लग वा वकालत योजना सम्पादन गर्दा "छवि प्रवर्धन उपकरण" प्रयोग गरी एकीकृत रूपमा व्यवस्थित गरिन्छ।'
                      : 'Campaign gallery photographs are managed inline inside the Blogs or Advocacy Projects editor for immediate structural layout integrity.'}
                  </p>
                  <button
                    onClick={() => handleSelectTab('blogs')}
                    className="mt-4 px-3.5 h-[32px] bg-accent-primary text-white text-xs font-sans font-medium rounded-[3px] focus:outline-none focus:ring-1 focus:ring-accent-primary transition-colors"
                  >
                    {isNepali ? 'ब्लग सम्पादकमा जानुहोस्' : 'Open Blogs Workspace'}
                  </button>
                </div>
              )}

              {activeTab === 'submissions' && (
                <Ledger
                  tab="submissions"
                  blogs={blogs}
                  projects={projects}
                  programs={programs}
                  submissions={submissions}
                  isNepali={isNepali}
                  onEditItem={(type, id) => setEditingItem({ type, id })}
                  onAddNewItem={(type) => setEditingItem({ type })}
                  onArchiveItem={handleArchiveItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleFeatured={handleToggleFeatured}
                  onResolveSubmission={handleResolveSubmission}
                  onBulkAction={handleBulkAction}
                />
              )}

              {activeTab === 'site-customizer' && carousel.length > 0 && aboutUs && (
                <SiteCustomizer
                  carousel={carousel}
                  about={aboutUs}
                  blogs={blogs}
                  projects={projects}
                  programs={programs}
                  gallery={gallery}
                  isNepali={isNepali}
                  onUpdateCarousel={(slides) => {
                    setCarousel(slides);
                    saveToLocalStorage('dfao_carousel', slides);
                  }}
                  onUpdateAbout={(aboutObj) => {
                    setAboutUs(aboutObj);
                    saveToLocalStorage('dfao_about', aboutObj);
                  }}
                  onToggleFeatured={handleToggleFeatured}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* 5. Custom Notifications Toasts Overlap (Slide-in Right, Position absolute top-right) */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none select-none">
        {toasts.map(t => (
          <div
            key={t.id}
            id={`toast-elem-${t.id}`}
            className="w-80 p-3 bg-sidebar-bg text-text-inverse border border-[#2E2E2B] rounded-[3px] shadow-md flex items-start gap-2.5 pointer-events-auto animate-slide-in-right select-all"
          >
            <div className="pt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {t.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
              {t.type === 'info' && <MessageSquare className="w-4 h-4 text-accent-link" />}
            </div>
            <div className="grow">
              <p className="text-xs font-sans font-medium leading-relaxed">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-0.5 hover:bg-[#1A1A18] text-text-inverse-secondary hover:text-white rounded-[2px]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* 6. SYSTEM ALERTS & NOTIFICATIONS DRAWER OVERLAY */}
      {isNotificationsOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setIsNotificationsOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed right-0 top-0 bottom-0 w-84 md:w-96 bg-[#091B3D]/95 backdrop-blur-md border-l border-white/10 text-white z-50 flex flex-col justify-between shadow-2xl p-6 select-none animate-slide-in-right">
            <div className="space-y-6 overflow-y-auto no-scrollbar grow">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xs font-sans font-black tracking-tight text-[#F4F8FF] uppercase">
                    {isNepali ? 'सूचना नियन्त्रण केन्द्र' : 'System Command Alerts'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action operations row */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    addToast('All system notifications flagged read.', 'info');
                  }}
                  className="py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 rounded text-center"
                >
                  {isNepali ? 'सबै पढिएको चिन्ह' : 'Mark All Read'}
                </button>
                <button
                  onClick={() => {
                    setNotifications([]);
                    addToast('Notifications repository cleared.', 'info');
                  }}
                  className="py-1.5 bg-red-950/45 hover:bg-red-950/60 border border-red-900/35 text-red-300 rounded text-center flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isNepali ? 'सबै खाली गर्नुहोस्' : 'Clear Repository'}</span>
                </button>
              </div>

              {/* Simulation Trigger button - SUPER TACTILE & ENGAGING */}
              <div className="bg-[#132D5C]/65 border border-white/15 p-4 rounded space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-[#B5D4FF] font-black uppercase block">Interactive Simulator Control</span>
                <p className="text-[10px] text-slate-300 leading-normal">Press the button below to randomly queue custom public citizen interactions and view live system trigger updates!</p>
                <button
                  onClick={() => {
                    const samples = [
                      { en: "Anonymous citizen reported a ramp physical obstruction on Lazimpat Lane.", np: "अज्‍ज्ञात नागरिकले लाजिम्पाट लेनमा र्‍याम्प अवरोध रिपोर्ट दर्ता गरे।" },
                      { en: "Supriya Devkota completed RSVP Seat securing for Blind Braille program.", np: "सुप्रिया देवकोटाले दृष्टिविहीन ब्रेल कार्यक्रमको लागि सिट आरक्षित गर्नुभयो।" },
                      { en: "DFAO Admin modified standard access checklist document values.", np: "डि-एफ-ए-ओ प्रमुखले पहुँचयोग्यता परीक्षण मापदण्ड परिमार्जन गर्नुभयो।" },
                      { en: "New contact query ticket logged: 'Ramp slope consulting on Lazimpat pharmacy'", np: "नयाँ सोधपुछ दर्ता: 'लाजिम्पाट फार्मेसीमा र्‍याम्प भिरालो परामर्श'" }
                    ];
                    const pick = samples[Math.floor(Math.random() * samples.length)];
                    handleSimulateNotification(pick.en, pick.np);
                  }}
                  className="w-full text-center py-2 bg-[#0036B3] hover:bg-blue-700 text-white font-black text-[10.5px] rounded border border-blue-500 shadow-sm"
                >
                  ⚡ Trigger Simulated Live Event
                </button>
              </div>

              {/* Notification Stream Card lists */}
              <div className="space-y-3 pt-2">
                {notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                    }}
                    className={`p-3 rounded border text-left cursor-pointer transition-all ${
                      notif.read 
                        ? 'bg-slate-950/10 border-white/5 opacity-55 hover:opacity-85' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        notif.type === 'success' ? 'bg-green-400' :
                        notif.type === 'warning' ? 'bg-red-400' :
                        notif.type === 'info' ? 'bg-blue-400' : 'bg-slate-400'
                      }`} />
                      <span className="text-[8.5px] font-mono text-slate-400 font-medium">{isNepali ? notif.timeAgoNp : notif.timeAgoEn}</span>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed text-slate-100">
                      {isNepali ? notif.titleNp : notif.titleEn}
                    </p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="py-12 border border-dashed border-white/10 text-center text-slate-400 text-xs rounded">
                    All notifications cleared. Try triggering simulated activity above!
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10.5px] text-slate-400">
              <span>Read: {notifications.filter(n => n.read).length} • Unread: {notifications.filter(n => !n.read).length}</span>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="text-white hover:underline font-bold"
              >
                Close Panel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
