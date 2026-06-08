/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Compass,
  Calendar,
  Image,
  Inbox,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  CompassIcon,
  Accessibility,
  Sliders
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isNepali: boolean;
  onQuickCreate: (type: 'blog' | 'project' | 'program' | 'gallery') => void;
  unreadCount: number;
}

export default function Sidebar({
  currentTab,
  setTab,
  isNepali,
  onQuickCreate,
  unreadCount
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const groups = [
    {
      titleEn: 'Editorial Desk',
      titleNp: 'सम्पादकीय डेस्क',
      items: [
        { id: 'dashboard', nameEn: 'Dashboard Home', nameNp: 'मुख्य नियन्त्रण कक्ष', icon: LayoutDashboard },
        { id: 'blogs', nameEn: 'Blogs & News', nameNp: 'ब्लग र समाचार', icon: FileText },
        { id: 'projects', nameEn: 'Advocacy Projects', nameNp: 'पैरवी आयोजनाहरू', icon: Compass },
        { id: 'programs', nameEn: 'Workshops & Events', nameNp: 'तालिम र सम्मेलनहरू', icon: Calendar },
        { id: 'gallery', nameEn: 'Campaign Gallery', nameNp: 'अभियान तस्बिर संग्रह', icon: Image }
      ]
    },
    {
      titleEn: 'Citizen Feedback',
      titleNp: 'नागरिक सुझाव',
      items: [
        {
          id: 'submissions',
          nameEn: 'Contact Inquiries',
          nameNp: 'परामर्श र सोधपुछ',
          icon: Inbox,
          badge: unreadCount > 0 ? unreadCount : undefined
        }
      ]
    },
    {
      titleEn: 'Theme & Customizer',
      titleNp: 'वेबसाइट सजावट',
      items: [
        {
          id: 'site-customizer',
          nameEn: 'Core Pages Editor',
          nameNp: 'गृहपृष्ठ र मुख्य पृष्ठहरू',
          icon: Sliders
        }
      ]
    }
  ];

  return (
    <aside
      id="aistudio-sidebar"
      className="bg-sidebar-bg text-text-inverse h-screen sticky top-0 flex flex-col justify-between transition-all duration-200 ease-out z-40 select-none border-r border-[#102B5B]"
      style={{ width: isCollapsed ? '56px' : '240px' }}
    >
      {/* Top Identity Block */}
      <div>
        <div className="h-[52px] px-3.5 flex items-center justify-between border-b border-[#102B5B]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 bg-accent-link text-white flex items-center justify-center shrink-0 rounded-[3px]">
              <Accessibility className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col select-none">
                <span className="text-sm font-sans font-bold tracking-tight text-white leading-tight shrink-0 truncate">
                  DFAO CMS
                </span>
                <span className="text-[10px] font-sans font-bold text-text-inverse-secondary tracking-wider uppercase leading-none">
                  KATHMANDU • काठमाडौं
                </span>
              </div>
            )}
          </div>
          
          <button
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-[#15305B] text-text-inverse-secondary hover:text-white transition-colors rounded-[3px] focus:outline-none"
            title={isCollapsed ? "Expand Sidebar (⌘/)" : "Collapse Sidebar (⌘/)"}
          >
            {isCollapsed ? <ChevronsRight className="w-4 h-4 text-text-inverse-secondary" /> : <ChevronsLeft className="w-4 h-4 text-text-inverse-secondary" />}
          </button>
        </div>

        {/* Quick Launch Button */}
        <div className="p-2 border-b border-[#102B5B] relative">
          {isCollapsed ? (
            <button
              id="collapsed-quick-add"
              onClick={() => {
                setIsCollapsed(false);
                setShowQuickAdd(true);
              }}
              className="w-full h-8 flex items-center justify-center bg-accent-link text-white rounded-[3px] hover:bg-[#002D9C] transition-colors focus:ring-1 focus:ring-accent-link focus:outline-none"
              title="Quick Add Menu"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          ) : (
            <div>
              <button
                id="sidebar-quick-add-btn"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="w-full h-[34px] flex items-center justify-between px-3 bg-accent-link text-white text-xs font-sans font-bold rounded-[3px] hover:bg-[#002D9C] transition-colors focus:ring-1 focus:ring-accent-link focus:outline-none"
              >
                <span className="flex items-center gap-1.5 text-white">
                  <Plus className="w-3.5 h-3.5 text-white" />
                  {isNepali ? 'नयाँ सामाग्री' : 'Quick Create'}
                </span>
                <span className="text-[10px] opacity-75 text-white">▼</span>
              </button>

              {showQuickAdd && (
                <div
                  id="sidebar-quick-add-popover"
                  className="absolute left-2 right-2 mt-1 py-1.5 bg-sidebar-bg border border-[#1B3E7A] rounded-[3px] shadow-lg z-50 text-xs text-text-inverse"
                >
                  <button
                    onClick={() => {
                      onQuickCreate('blog');
                      setShowQuickAdd(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-text-inverse font-semibold hover:bg-sidebar-active block"
                  >
                    + {isNepali ? 'नयाँ ब्लग समाचार' : 'Blog Entry'}
                  </button>
                  <button
                    onClick={() => {
                      onQuickCreate('project');
                      setShowQuickAdd(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-text-inverse font-semibold hover:bg-sidebar-active block"
                  >
                    + {isNepali ? 'नयाँ वकालत आयोजना' : 'Advocacy Project'}
                  </button>
                  <button
                    onClick={() => {
                      onQuickCreate('program');
                      setShowQuickAdd(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-text-inverse font-semibold hover:bg-sidebar-active block"
                  >
                    + {isNepali ? 'नयाँ वकालत कार्यक्रम' : 'Workshop Event'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav aria-label="Primary navigation" className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar">
          {groups.map((grp) => (
            <div key={grp.titleEn} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-2 pt-2 text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#BACBE4] select-none">
                  {isNepali ? grp.titleNp : grp.titleEn}
                </h3>
              )}
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const isActive = currentTab === item.id;
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => setTab(item.id)}
                      className={`w-full h-9 flex items-center px-2 text-left relative focus:outline-none select-none transition-all rounded-[3px] group ${
                        isActive
                          ? 'bg-sidebar-active text-[#F4F8FF] font-bold border-l-[3px] border-accent-link shadow-inner'
                          : 'text-[#BACBE4] hover:text-white hover:bg-[#132D5C]/60'
                      }`}
                      title={isCollapsed ? (isNepali ? item.nameNp : item.nameEn) : undefined}
                    >
                      <span className="flex items-center gap-2.5 overflow-hidden w-full">
                        <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#879CBD] group-hover:text-white'}`} />
                        {!isCollapsed && (
                          <span className="text-sm font-semibold tracking-tight truncate leading-none pt-0.5">
                            {isNepali ? item.nameNp : item.nameEn}
                          </span>
                        )}
                      </span>
                      
                      {item.badge !== undefined && !isCollapsed && (
                        <span className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono leading-none bg-[#0036B3] text-white rounded-[3px] tabular-nums font-extrabold border border-white/20">
                          {item.badge}
                        </span>
                      )}

                      {/* Floating tooltip only on collapsed hover */}
                      {isCollapsed && (
                        <div className="hidden group-hover:block absolute left-14 px-3 py-1.5 text-xs text-white bg-[#06132C] border border-[#1B3E7A] rounded-[3px] whitespace-nowrap shadow-md z-50 animate-fade-in pointer-events-none font-sans font-bold">
                          {isNepali ? item.nameNp : item.nameEn}
                          {item.badge !== undefined && ` (${item.badge})`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Pinned User Section */}
      <div className="p-2 border-t border-[#102B5B] bg-[#051128]">
        <div className="flex items-center gap-2.5 p-1 rounded-[3px] overflow-hidden">
          <div className="w-7 h-7 rounded-sm bg-[#132D5C] text-white flex items-center justify-center font-extrabold font-sans text-xs shrink-0 uppercase border border-[#1B3E7A]">
            SD
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-sans font-bold text-white leading-tight truncate">
                {isNepali ? 'सुप्रिया देवकोटा' : 'Supriya Devkota'}
              </div>
              <div className="text-[10px] font-sans font-bold text-[#BCD2EE] tracking-wide uppercase truncate leading-none mt-0.5">
                {isNepali ? 'डिजाइन प्रमुख' : 'Design Head'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
