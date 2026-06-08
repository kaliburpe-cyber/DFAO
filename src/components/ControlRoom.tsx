/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Compass,
  Calendar,
  Layers,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Edit2,
  Inbox,
  Sparkles,
  TrendingUp,
  Award,
  AlertCircle,
  ChevronRight,
  Filter,
  BarChart3,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { Blog, Project, Program, ContactSubmission, ActivityLog } from '../types';

interface ControlRoomProps {
  blogs: Blog[];
  projects: Project[];
  programs: Program[];
  submissions: ContactSubmission[];
  logs: ActivityLog[];
  isNepali: boolean;
  onNavigateToTab: (tab: string) => void;
  onEditItem: (type: 'blog' | 'project' | 'program', id: string) => void;
  onAddNewItem: (type: 'blog' | 'project' | 'program') => void;
  onPublishShortcut: (type: 'blog' | 'project' | 'program', id: string) => void;
}

interface AnalyticsData {
  month: string;
  monthNp: string;
  blogs: number;
  projects: number;
  submissions: number;
  featured: number;
  insightsEn: string;
  insightsNp: string;
}

const ANALYTICS_DATA: AnalyticsData[] = [
  { 
    month: 'Jan', 
    monthNp: 'पुस/माघ', 
    blogs: 8, 
    projects: 2, 
    submissions: 11, 
    featured: 1,
    insightsEn: 'Initial Ramp Audit launched in Lalitpur',
    insightsNp: 'ललितपुरमा प्रारम्भिक र्‍याम्प अडिट सुरु'
  },
  { 
    month: 'Feb', 
    monthNp: 'माघ/फागुन', 
    blogs: 14, 
    projects: 3, 
    submissions: 16, 
    featured: 1,
    insightsEn: 'First Screen Reader NVDA Class Initiated',
    insightsNp: 'पहिलो स्क्रिन रिडर NVDA क्लास सुरुवात'
  },
  { 
    month: 'Mar', 
    monthNp: 'फागुन/चैत', 
    blogs: 12, 
    projects: 4, 
    submissions: 24, 
    featured: 2,
    insightsEn: 'DFAO Headquarters setup completed',
    insightsNp: 'DFAO केन्द्र कार्यालय को आन्तरिक व्यवस्थापन सम्पन्न'
  },
  { 
    month: 'Apr', 
    monthNp: 'चैत/बैशाख', 
    blogs: 22, 
    projects: 6, 
    submissions: 19, 
    featured: 3,
    insightsEn: 'Inclusive Primary School book drive',
    insightsNp: 'समावेशी प्राथमिक विद्यालय पुस्तक प्रवर्धन अभियान'
  },
  { 
    month: 'May', 
    monthNp: 'बैशाख/जेठ', 
    blogs: 32, 
    projects: 9, 
    submissions: 29, 
    featured: 4,
    insightsEn: 'Heritage crosswalk slope policy submit',
    insightsNp: 'सांस्कृतिक सम्पदा क्षेत्र सडक ढाल नीतिको प्रस्ताव दर्ता'
  },
  { 
    month: 'Jun', 
    monthNp: 'जेठ/असार', 
    blogs: 28, 
    projects: 14, 
    submissions: 38, 
    featured: 4,
    insightsEn: 'Kathmandu pedestrian accessibility peak intake',
    insightsNp: 'काठमाडौँ पैदल मार्ग र र्‍याम्प अडिट सर्वाधिक तथ्याङ्क प्राप्ति'
  }
];

export default function ControlRoom({
  blogs,
  projects,
  programs,
  submissions,
  logs,
  isNepali,
  onNavigateToTab,
  onEditItem,
  onAddNewItem,
  onPublishShortcut
}: ControlRoomProps) {
  const [activityFilter, setActivityFilter] = useState<'all' | 'blog' | 'project' | 'program' | 'submission'>('all');
  const [activeSeries, setActiveSeries] = useState<'blogs' | 'projects' | 'submissions'>('blogs');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'6m' | '3m'>('6m');

  // Filter logs
  const filteredLogs = activityFilter === 'all'
    ? logs
    : logs.filter(log => log.contentType === activityFilter);

  // Compute stat metrics
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter(b => b.status === 'published').length;
  const draftBlogs = blogs.filter(b => b.status === 'draft').length;
  const inReviewBlogs = blogs.filter(b => b.status === 'in_review').length;

  const totalProjects = projects.length;
  const ongoingProjects = projects.filter(p => p.statusEn.toLowerCase() === 'ongoing').length;

  const totalPrograms = programs.length;

  const pendingSubmissions = submissions.filter(s => !s.resolved).length;
  const totalSubmissions = submissions.length;

  // Compute Bilingual Completeness state for any drafts in review/draft status
  const evaluateCompleteness = (item: any, type: 'blog' | 'project' | 'program') => {
    let score = 0;
    let totalFields = 4; // Title EN/NP + Body/Desc EN/NP

    if (item.titleEn) score += 1;
    if (item.titleNp) score += 1;

    if (type === 'blog') {
      if (item.bodyEn) score += 1;
      if (item.bodyNp) score += 1;
    } else {
      if (item.descriptionEn || item.bodyEn) score += 1;
      if (item.descriptionNp || item.bodyNp) score += 1;
    }

    return Math.round((score / totalFields) * 100);
  };

  // Gathering drafts matching conditions
  const allDrafts: { id: string; title: string; type: 'blog' | 'project' | 'program'; timestamp: string; status: string; completeness: number }[] = [];
  blogs.filter(b => b.status === 'draft' || b.status === 'in_review').forEach(b => {
    allDrafts.push({
      id: b.id,
      title: isNepali ? b.titleNp : b.titleEn,
      type: 'blog',
      timestamp: b.updatedAt,
      status: b.status,
      completeness: evaluateCompleteness(b, 'blog')
    });
  });
  projects.filter(p => p.status === 'draft' || p.status === 'in_review').forEach(p => {
    allDrafts.push({
      id: p.id,
      title: isNepali ? p.titleNp : p.titleEn,
      type: 'project',
      timestamp: p.updatedAt,
      status: p.status,
      completeness: evaluateCompleteness(p, 'project')
    });
  });
  programs.filter(pr => pr.status === 'draft' || pr.status === 'in_review').forEach(pr => {
    allDrafts.push({
      id: pr.id,
      title: isNepali ? pr.titleNp : pr.titleEn,
      type: 'program',
      timestamp: pr.updatedAt,
      status: pr.status,
      completeness: evaluateCompleteness(pr, 'program')
    });
  });

  const displayDrafts = allDrafts.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 4);

  // Review Pipeline Group
  const reviewQueue: { id: string; title: string; type: 'blog' | 'project' | 'program'; category: string; completeness: number }[] = [];
  blogs.filter(b => b.status === 'in_review').forEach(b => {
    reviewQueue.push({ 
      id: b.id, 
      title: isNepali ? b.titleNp : b.titleEn, 
      type: 'blog', 
      category: isNepali ? b.categoryNp : b.categoryEn,
      completeness: evaluateCompleteness(b, 'blog')
    });
  });
  projects.filter(p => p.status === 'in_review').forEach(p => {
    reviewQueue.push({ 
      id: p.id, 
      title: isNepali ? p.titleNp : p.titleEn, 
      type: 'project', 
      category: isNepali ? p.locationNp : p.locationEn,
      completeness: evaluateCompleteness(p, 'project')
    });
  });
  programs.filter(pr => pr.status === 'in_review').forEach(pr => {
    reviewQueue.push({ 
      id: pr.id, 
      title: isNepali ? pr.titleNp : pr.titleEn, 
      type: 'program', 
      category: isNepali ? pr.venueNp : pr.venueEn,
      completeness: evaluateCompleteness(pr, 'program')
    });
  });

  // Series Plotting Config
  const chartData = chartTimeframe === '3m' ? ANALYTICS_DATA.slice(3) : ANALYTICS_DATA;
  const maxValues = { blogs: 40, projects: 16, submissions: 45 };
  const maxVal = maxValues[activeSeries];

  // SVG dimensions for main trend area plot
  const chartWidth = 640;
  const chartHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const pointsCount = chartData.length;
  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  // Generate coordinate points for active series
  const svgPoints = chartData.map((d, idx) => {
    const val = d[activeSeries];
    const x = paddingLeft + (idx / (pointsCount - 1)) * usableWidth;
    const y = chartHeight - paddingBottom - (val / maxVal) * usableHeight;
    return { x, y, value: val, month: d.month, monthNp: d.monthNp, item: d };
  });

  // Plot lines string
  const linePathString = svgPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Line smooth bezier plot curve alternative for elegant Salesforce view
  const bezierPathString = svgPoints.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = svgPoints[idx - 1];
    const cp1X = prev.x + (p.x - prev.x) / 3;
    const cp1Y = prev.y;
    const cp2X = prev.x + (2 * (p.x - prev.x)) / 3;
    const cp2Y = p.y;
    return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p.x} ${p.y}`;
  }, '');

  // Fill area string to create ambient gradient below curve
  const areaPathString = svgPoints.length > 0 
    ? `${bezierPathString} L ${svgPoints[svgPoints.length - 1].x} ${chartHeight - paddingBottom} L ${svgPoints[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  // Get Series Colors for chart lines and gradients
  const getSeriesColor = () => {
    if (activeSeries === 'blogs') return { stroke: '#0036B3', fillId: 'grad-blogs', badge: 'bg-[#0036B3]/10 text-[#0036B3] font-bold border border-[#0036B3]/20' };
    if (activeSeries === 'projects') return { stroke: '#076D36', fillId: 'grad-projects', badge: 'bg-[#076D36]/10 text-[#076D36] font-bold border border-[#076D36]/20' };
    return { stroke: '#A65500', fillId: 'grad-submissions', badge: 'bg-[#A65500]/10 text-[#A65500] font-bold border border-[#A65500]/20' };
  };

  const activeColorSet = getSeriesColor();

  return (
    <div className="space-y-6 relative selection:bg-[#BAD6FC] selection:text-text-primary">
      {/* Decorative radial top glow for beautiful Saas atmosphere */}
      <div className="absolute top-[-40px] right-[10%] w-[320px] h-[320px] bg-[#BAD6FC]/15 rounded-full blur-[90px] pointer-events-none z-0" />
      
      {/* 1. Page Header (Modern Enterprise Minimalist with context indicators) */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between border-b border-[#BACBE4]/40 pb-5 select-none z-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-link opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-link"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4C6488] font-bold">
              {isNepali ? 'सञ्चालन नियन्त्रण सञ्जाल' : 'DFAO CENTRAL OPERATIONS DEPT'}
            </span>
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight text-text-primary flex items-center gap-2">
            {isNepali ? 'शान्ति नियन्त्रण कक्ष' : 'DFAO Workspace Console'}
            <span className="text-xs bg-accent-link/10 text-accent-link font-sans font-extrabold px-2 py-0.5 rounded-[4px] border border-accent-link/25">
              v4.2
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1 max-w-2xl font-medium leading-relaxed">
            {isNepali 
              ? 'काठमाडौं सुगम भौतिक र डिजिटल NVDA स्क्रिन रिडर वकालतको अभिलेख तथा डिजिटल सम्पादकीय मञ्च।'
              : 'Enterprise CMS core powering inclusive pedestrian accessibility maps, NVDA instructional coordinates & verified community responses.'}
          </p>
        </div>

        {/* Quick action strip styled with premium buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onAddNewItem('blog')}
            className="px-3.5 h-9 bg-white hover:bg-[#EDF3FC] border border-[#BACBE4] text-xs font-bold text-[#041E42] rounded-[6px] shadow-sm transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer leading-none"
          >
            <FileText className="w-3.5 h-3.5 text-accent-link" />
            {isNepali ? 'ब्लग सम्पादकीय थप्नुहोस्' : 'Create Article'}
          </button>
          <button
            onClick={() => onAddNewItem('project')}
            className="px-3.5 h-9 bg-white hover:bg-[#EDF3FC] border border-[#BACBE4] text-xs font-bold text-[#041E42] rounded-[6px] shadow-sm transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer leading-none"
          >
            <Compass className="w-3.5 h-3.5 text-[#076D36]" />
            {isNepali ? 'नयाँ अभियान योजना' : 'Launch Project'}
          </button>
          <button
            onClick={() => onAddNewItem('program')}
            className="px-4 h-9 bg-accent-primary hover:bg-[#030C22] text-xs font-bold text-white rounded-[6px] shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.98] flex items-center gap-2 cursor-pointer leading-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700] animate-pulse" />
            {isNepali ? 'तालिम सत्र तालिका' : 'Schedule Summit'}
          </button>
        </div>
      </div>

      {/* 2. Interactive KPI Overview Stats Board */}
      <div className="relative glass-panel shadow-glass rounded-xl overflow-hidden select-none z-10 border border-[#BAD6FC]/50">
        <div className="px-5 py-3 border-b border-[#BAD6FC]/50 bg-gradient-to-r from-[#BAD6FC]/20 via-[#BAD6FC]/10 to-transparent flex items-center justify-between">
          <span className="text-[10px] font-sans font-black uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#0036B3] rounded-full inline-block"></span>
            {isNepali ? 'कार्यालय गतिविधि र संस्थागत म्याट्रिक्स' : 'DFAO System KPI Analytics Dashboard'}
          </span>
          <span className="text-[10px] text-text-muted font-mono font-bold bg-white/65 px-2 py-0.5 rounded border border-[#BAD6FC]/40">
            {isNepali ? 'अन्तिम सिंक्रोनाइज: भर्खरै' : 'Dynamic Auto-Sync: Active'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#BAD6FC]/40 bg-white/10">
          {/* KPI Card 1: Blogs */}
          <div 
            onClick={() => setActiveSeries('blogs')}
            className={`p-5 flex flex-col justify-between h-[120px] transition-all duration-200 cursor-pointer relative group overflow-hidden ${
              activeSeries === 'blogs' 
                ? 'bg-[#BEDFFF]/40 border-b-2 md:border-b-0 md:border-l-4 !border-accent-link shadow-inner' 
                : 'hover:bg-white/50 bg-[#EDF3FC]/10'
            }`}
          >
            {/* Soft decorative hover accent bar */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0036B3]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0036B3]/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-sans text-[#2C3E5A] uppercase font-black tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-accent-link group-hover:scale-110 transition-transform" />
                {isNepali ? 'ब्लग र सम्पादकीय समाचार' : 'Editorial Influx'}
              </span>
              <span className="text-[10px] font-mono text-green-800 bg-[#EAF5EE] border border-green-800/15 px-1.5 py-0.5 rounded font-extrabold">+18%</span>
            </div>
            <div className="flex items-end justify-between mt-2 relative z-10">
              <div>
                <span className="text-3xl font-sans font-black tracking-tight text-text-primary block leading-none">
                  {totalBlogs}
                </span>
                <span className="text-[10px] text-text-secondary font-bold mt-1.5 block">
                  {isNepali ? `${publishedBlogs} सक्रिय प्रकाशित` : `${publishedBlogs} Active Campaigns`}
                </span>
              </div>
              
              {/* Blogs Mini Sparkline */}
              <svg className="w-16 h-8 text-[#0036B3] shrink-0 opacity-90 filter drop-shadow-[0_1px_2px_rgba(0,54,179,0.15)]" viewBox="0 0 100 40">
                <path d="M 0 35 Q 20 20 40 28 T 80 5 T 100 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* KPI Card 2: Advocacy Projects */}
          <div 
            onClick={() => setActiveSeries('projects')}
            className={`p-5 flex flex-col justify-between h-[120px] transition-all duration-200 cursor-pointer relative group overflow-hidden ${
              activeSeries === 'projects' 
                ? 'bg-[#C6ECD2]/40 border-b-2 md:border-b-0 md:border-l-4 !border-[#076D36] shadow-inner' 
                : 'hover:bg-white/50 bg-[#EDF3FC]/10'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#076D36]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#076D36]/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-sans text-[#2C3E5A] uppercase font-black tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#076D36] group-hover:scale-110 transition-transform" />
                {isNepali ? 'वकालत तथा र्‍याम्प योजना' : 'Advocacy Ramps'}
              </span>
              <span className="text-[10px] font-mono text-green-800 bg-[#EAF5EE] border border-green-800/15 px-1.5 py-0.5 rounded font-extrabold">+24%</span>
            </div>
            <div className="flex items-end justify-between mt-2 relative z-10">
              <div>
                <span className="text-3xl font-sans font-black tracking-tight text-text-primary block leading-none">
                  {totalProjects}
                </span>
                <span className="text-[10px] text-text-secondary font-bold mt-1.5 block">
                  {isNepali ? `${ongoingProjects} अभियान जारी` : `${ongoingProjects} Auditted Zones`}
                </span>
              </div>
              
              {/* Projects Mini Sparkline */}
              <svg className="w-16 h-8 text-[#076D36] shrink-0 opacity-90 filter drop-shadow-[0_1px_2px_rgba(7,109,54,0.15)]" viewBox="0 0 100 40">
                <path d="M 0 38 L 15 32 L 35 34 L 55 18 L 75 22 L 100 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* KPI Card 3: Citizen Inquiries */}
          <div 
            onClick={() => setActiveSeries('submissions')}
            className={`p-5 flex flex-col justify-between h-[120px] transition-all duration-200 cursor-pointer relative group overflow-hidden ${
              activeSeries === 'submissions' 
                ? 'bg-[#FDEFCD]/40 border-b-2 md:border-b-0 md:border-l-4 !border-[#A65500] shadow-inner' 
                : 'hover:bg-white/50 bg-[#EDF3FC]/10'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A65500]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#A65500]/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-sans text-[#2C3E5A] uppercase font-black tracking-wider flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-[#A65500] group-hover:scale-110 transition-transform" />
                {isNepali ? 'नागरिक सहयोग अभिलेख' : 'Citizen Assistance'}
              </span>
              <span className="text-[10px] font-mono text-red-800 bg-[#FDF3DC] border border-red-800/10 px-1.5 py-0.5 rounded font-extrabold">{pendingSubmissions} {isNepali ? 'बाँकी' : 'alert'}</span>
            </div>
            <div className="flex items-end justify-between mt-2 relative z-10">
              <div>
                <span className="text-3xl font-sans font-black tracking-tight text-text-primary block leading-none">
                  {totalSubmissions}
                </span>
                <span className="text-[10px] text-text-secondary font-bold mt-1.5 block">
                  {isNepali ? `निकास दर: ${totalSubmissions > 0 ? Math.round(((totalSubmissions - pendingSubmissions)/totalSubmissions)*100) : 100}%` : `${totalSubmissions - pendingSubmissions} resolved cases`}
                </span>
              </div>
              
              {/* Inquiries Mini Sparkline */}
              <svg className="w-16 h-8 text-[#A65500] shrink-0 opacity-90 filter drop-shadow-[0_1px_2px_rgba(166,85,0,0.15)]" viewBox="0 0 100 40">
                <path d="M 0 32 C 15 38, 30 15, 45 28 C 60 40, 75 10, 100 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* KPI Card 4: Event Conferences */}
          <div 
            onClick={() => onNavigateToTab('programs')}
            className="p-5 flex flex-col justify-between h-[120px] transition-all hover:bg-white/50 bg-[#EDF3FC]/10 cursor-pointer relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0036B3]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0036B3]/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-sans text-[#2C3E5A] uppercase font-black tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent-link group-hover:scale-110 transition-transform" />
                {isNepali ? 'तालिम तथा सरोकारवाला सम्मेलन' : 'Summit Conferences'}
              </span>
              <span className="text-[10px] text-text-muted font-mono font-bold bg-white/70 border border-[#BAD6FC]/30 px-1 py-0.5 rounded leading-none">scheduled</span>
            </div>
            <div className="flex items-end justify-between mt-2 relative z-10">
              <div>
                <span className="text-3xl font-sans font-black tracking-tight text-text-primary block leading-none">
                  {totalPrograms}
                </span>
                <span className="text-[10px] text-text-secondary font-bold mt-1.5 block">
                  {isNepali ? 'वकालती महासभा' : 'Workshops / Action Meets'}
                </span>
              </div>
              
              {/* Static Event Sparkline */}
              <svg className="w-16 h-8 text-text-secondary opacity-65 shrink-0" viewBox="0 0 100 40">
                <path d="M 0 30 Q 25 35 50 15 T 100 8" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Salesforce-Level Interactive Analytics Panel */}
      <div className="relative glass-panel shadow-glass rounded-xl p-6 z-10 border border-[#BAD6FC]/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAD6FC]/50 pb-5 mb-5 select-none hover:cursor-default">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#041E42] font-black uppercase tracking-wider font-sans">
              <BarChart3 className="w-4 h-4 text-accent-link shrink-0" />
              {activeSeries === 'blogs' && (isNepali ? 'सम्पादकीय प्रकाशन म्याट्रिक्स (मासिक प्रवाह)' : 'Blogs & Editorial Production Trajectory')}
              {activeSeries === 'projects' && (isNepali ? 'भौतिक भौतिक र्‍याम्प अडिट योजना प्रगति रेखा' : 'Advocacy Action & Ramps Audited Trend')}
              {activeSeries === 'submissions' && (isNepali ? 'नागरिक जिज्ञासा र अभिलेख प्रवाह लेखाजोखा' : 'Inbound Civil Consulting Submissions Intake')}
            </div>
            <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-xl">
              {isNepali 
                ? 'जुन २०२६ सम्मको ६ महिनाको म्याट्रिक्स। चार्टको विन्दुहरूमा होभर गरेर विवरण हेर्नुहोस्।'
                : 'Aggregated trajectories across Kathmandu urban zones. Hover over data nodes for specific bilingual campaign milestones.'}
            </p>
          </div>

          {/* Timeframe toggles and category highlight */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className={`text-[9px] pl-2.5 pr-2 py-0.5 font-sans font-extrabold rounded-full uppercase tracking-wider ${activeColorSet.badge}`}>
              {activeSeries} path
            </span>
            <div className="flex bg-[#EDF3FC]/50 p-1 rounded-lg border border-[#BAD6FC]/70 text-xs select-none shadow-xs">
              <button
                onClick={() => setChartTimeframe('6m')}
                className={`px-3 py-1 rounded-[4px] font-bold text-[10px] transition-all cursor-pointer leading-none ${
                  chartTimeframe === '6m' ? 'bg-white text-text-primary border border-[#BAD6FC]/50 shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-white/20'
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setChartTimeframe('3m')}
                className={`px-3 py-1 rounded-[4px] font-bold text-[10px] transition-all cursor-pointer leading-none ${
                  chartTimeframe === '3m' ? 'bg-white text-text-primary border border-[#BAD6FC]/50 shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-white/20'
                }`}
              >
                Q2 Only
              </button>
            </div>
          </div>
        </div>

        {/* Master Chart Component plotted via native SVG lines & area gradients */}
        <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          {/* Main Plot canvas (Col span 3) */}
          <div className="lg:col-span-3 overflow-hidden">
            <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
              <svg 
                className="mx-auto select-none overflow-visible"
                width={chartWidth} 
                height={chartHeight}
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                {/* SVG Definitions for ambient dropshadow and filled area gradients */}
                <defs>
                  {/* Linear gradients */}
                  <linearGradient id="grad-blogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0036B3" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0036B3" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="grad-projects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#076D36" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#076D36" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="grad-submissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A65500" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#A65500" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Dashed Horizontal Gridlines representing scales of metrics */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = paddingTop + ratio * usableHeight;
                  const labelValue = Math.round(maxVal - ratio * maxVal);
                  return (
                    <g key={ratio} className="opacity-70">
                      <line 
                        x1={paddingLeft} 
                        y1={y} 
                        x2={chartWidth - paddingRight} 
                        y2={y} 
                        stroke="#BAD6FC" 
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={paddingLeft - 8} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="font-mono text-[9px] fill-[#4C6488] font-bold tracking-tighter"
                      >
                        {labelValue}
                      </text>
                    </g>
                  );
                })}

                {/* Plot Area Fill with Gradient */}
                {svgPoints.length > 0 && (
                  <path 
                    d={areaPathString} 
                    fill={`url(#${activeColorSet.fillId})`} 
                    className="transition-all duration-300"
                  />
                )}

                {/* Plot Line Path (Smooth cubic bezier curve) */}
                {svgPoints.length > 0 && (
                  <path 
                    d={bezierPathString} 
                    fill="none" 
                    stroke={activeColorSet.stroke} 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                  />
                )}

                {/* Vertical Interactive Tracking Line behind nodes */}
                {hoveredPointIndex !== null && svgPoints[hoveredPointIndex] && (
                  <line 
                    x1={svgPoints[hoveredPointIndex].x} 
                    y1={paddingTop - 10} 
                    x2={svgPoints[hoveredPointIndex].x} 
                    y2={chartHeight - paddingBottom} 
                    stroke="#8FB4DF" 
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* X Axis labels representing Months */}
                {svgPoints.map((p, idx) => (
                  <g key={idx}>
                    <text 
                      x={p.x} 
                      y={chartHeight - 12} 
                      className="font-sans text-[10px] fill-text-secondary select-none font-bold"
                      textAnchor="middle"
                    >
                      {isNepali ? p.monthNp : p.month}
                    </text>
                    {/* Tick mark */}
                    <line 
                      x1={p.x} 
                      y1={chartHeight - paddingBottom} 
                      x2={p.x} 
                      y2={chartHeight - paddingBottom + 4} 
                      stroke="#8FB4DF" 
                      strokeWidth="1.2" 
                      strokeOpacity="0.6"
                    />
                  </g>
                ))}

                {/* Circular Active Nodes representing months data coordinate */}
                {svgPoints.map((p, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      {/* Interactive hover hotspot target rectangle bounding box */}
                      <rect 
                        x={p.x - usableWidth / (pointsCount * 2)} 
                        y={paddingTop - 15} 
                        width={usableWidth / (pointsCount - 1)} 
                        height={usableHeight + 40} 
                        fill="transparent" 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                      />
                      
                      {/* Custom visual indicators representing actual data point */}
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={isHovered ? 7 : 4.5} 
                        fill={isHovered ? '#FFFFFF' : activeColorSet.stroke}
                        stroke={isHovered ? activeColorSet.stroke : '#FFFFFF'}
                        strokeWidth={isHovered ? 4 : 2.5}
                        className="transition-all duration-150 pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Contextual Insights and Detailed Metadata (Col span 1) */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-[#BAD6FC]/50 pt-5 lg:pt-0 lg:pl-6 space-y-4">
            <div className="bg-white/50 border border-[#BAD6FC]/50 rounded-lg p-4 select-none relative shadow-xs overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD700]/5 rounded-full blur-xl" />
              <Award className="w-5 h-5 text-[#C5A018] absolute top-3.5 right-3.5" />
              <h4 className="text-[10px] font-sans font-black tracking-widest uppercase text-text-secondary mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#C5A018] rounded-full inline-block"></span>
                {isNepali ? 'सञ्चालन टिपोट' : 'Milestone Ledger'}
              </h4>
              
              {hoveredPointIndex !== null && svgPoints[hoveredPointIndex] ? (
                <div className="animate-fade-in space-y-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-sans font-black text-text-primary leading-none tracking-tight">
                      {svgPoints[hoveredPointIndex].value}
                    </span>
                    <span className="text-xs text-text-secondary font-bold font-mono">
                      {activeSeries}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-[#041E42] block font-sans">
                      {isNepali ? svgPoints[hoveredPointIndex].monthNp : svgPoints[hoveredPointIndex].month} 2026 Milestone:
                    </span>
                    <p className="text-[11px] text-[#2C3E5A] leading-relaxed font-semibold">
                      {isNepali ? svgPoints[hoveredPointIndex].item.insightsNp : svgPoints[hoveredPointIndex].item.insightsEn}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-sans font-black text-accent-link leading-none tracking-tight">
                      {chartData[chartData.length - 1][activeSeries]}
                    </span>
                    <span className="text-[10px] text-text-secondary font-bold bg-[#BAD6FC]/30 border border-[#BAD6FC]/40 px-1.5 py-0.5 rounded ml-1.5 leading-none">Jun Latest</span>
                  </div>
                  <p className="text-[11px] text-[#2C3E5A] leading-relaxed font-semibold">
                    {isNepali 
                      ? 'काठमाडौँ महानगर सुशासन र सबै वडा र्‍याम्प अडिट कार्य तीव्र गतिमा अघि बढेको छ।' 
                      : 'Lalitpur & Kathmandu accessible ramp audits marked highest citizen coordinate intake during active monsoons.'}
                  </p>
                  <span className="text-[9px] text-[#4C6488] font-mono font-bold mt-1.5 block">
                    *Hover points to inspect coordinates
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 select-none">
              <span className="text-[10px] font-sans font-black text-text-secondary uppercase tracking-wider block">
                {isNepali ? 'अतिरिक्त विश्लेषण म्याट्रिक्स' : 'SYSTEM HEALTH METADATA'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white/40 border border-[#BAD6FC]/40 rounded-lg text-center shadow-xs">
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider block">Bilingual Index</span>
                  <span className="font-sans font-black text-text-primary text-sm">94.8%</span>
                </div>
                <div 
                  onClick={() => onNavigateToTab('submissions')}
                  className="p-3 bg-white/40 border border-[#BAD6FC]/40 hover:border-[#BAD6FC] rounded-lg text-center shadow-xs cursor-pointer transition-colors"
                >
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider block">Resolve Index</span>
                  <span className="font-sans font-black text-green-700 text-sm">82.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dual Workspace Panels: Approvals Task board & Live Inbound coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 z-10 relative">
        
        {/* LEFT COLUMN: Approvals & Draft Completeness Tracker Pane (Col Span 3) */}
        <div className="lg:col-span-3 glass-panel shadow-glass rounded-xl p-5 flex flex-col justify-between border border-[#BAD6FC]/50">
          <div>
            <div className="flex items-center justify-between border-b border-[#BAD6FC]/40 pb-3 mb-4 select-none">
              <h3 className="text-xs font-sans font-black uppercase tracking-widest text-[#041E42] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent-link shrink-0" />
                {isNepali ? 'प्रकाशन स्वीकृति र कार्यप्रवाह तालिका' : 'Bilingual Production Queue & Approvals'}
              </h3>
              <span className="text-[10px] font-mono text-[#0036B3] bg-white/80 border border-[#BAD6FC]/70 font-extrabold px-2.5 py-1 rounded-md shadow-xs shrink-0">
                {displayDrafts.length} {isNepali ? 'मस्यौदा बाँकी' : 'Drafts Pending Review'}
              </span>
            </div>

            {displayDrafts.length > 0 ? (
              <div className="space-y-4">
                {displayDrafts.map((draft) => (
                  <div 
                    key={`${draft.type}-${draft.id}`}
                    className="p-4 bg-white/50 hover:bg-white/90 border border-[#BAD6FC]/45 rounded-lg hover:border-[#BAD6FC] shadow-sm hover:shadow transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 select-none flex-wrap">
                          <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                            draft.type === 'blog' ? 'bg-[#0036B3]/10 text-[#0036B3] border-[#0036B3]/25' : draft.type === 'project' ? 'bg-[#076D36]/10 text-[#076D36] border-[#076D36]/25' : 'bg-white text-text-primary border-[#BAD6FC]'
                          }`}>
                            {draft.type}
                          </span>
                          <span className="text-[10px] font-sans font-extrabold text-[#4C6488] flex items-center gap-1">
                            <span className="w-1 h-1 bg-[#4C6488] rounded-full"></span>
                            {draft.status === 'in_review' ? (isNepali ? 'समीक्षामा' : 'IN REVIEW') : (isNepali ? 'मस्यौदा' : 'DRAFT')}
                          </span>
                        </div>
                        <h4 className="text-sm font-sans font-black text-text-primary text-left line-clamp-1 group-hover:text-accent-link transition-colors">
                          {draft.title}
                        </h4>
                      </div>

                      {/* Right button actions */}
                      <div className="flex items-center gap-1.5 justify-end shrink-0 sm:self-auto self-end">
                        <button
                          onClick={() => onEditItem(draft.type, draft.id)}
                          className="px-3 h-7 text-xs font-sans font-bold border border-[#BACBE4] text-text-secondary bg-white hover:bg-[#EDF3FC] rounded-md shadow-sm transition-all focus:outline-none cursor-pointer leading-none"
                        >
                          {isNepali ? 'विवरण समीक्षा' : 'Review Details'}
                        </button>
                        {draft.status === 'in_review' && (
                          <button
                            onClick={() => onPublishShortcut(draft.type, draft.id)}
                            className="px-3 h-7 bg-[#066332] hover:bg-[#044D26] text-xs text-white font-sans font-extrabold rounded-md shadow-sm flex items-center gap-1 transition-all focus:outline-none cursor-pointer leading-none"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {isNepali ? 'प्रकाशन गर्नुहोस्' : 'Publish'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bilingual Completeness Bar */}
                    <div className="mt-4 block select-none">
                      <div className="flex items-center justify-between text-[10px] mb-1.5 font-mono text-text-secondary">
                        <span className="font-bold flex items-center gap-1 text-[#2C3E5A]">
                          <span className="w-1 h-1 bg-[#2C3E5A] rounded-full inline-block"></span>
                          {isNepali ? 'द्विभाषी अनुवाद सम्पन्नता सूचक:' : 'Accessibility & Bilingual Integrity:'}
                        </span>
                        <span className="font-black text-[#076D36]">{draft.completeness}%</span>
                      </div>
                      <div className="h-1.5 bg-[#BAD6FC]/30 rounded-full overflow-hidden border border-[#BAD6FC]/30">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            draft.completeness === 100 ? 'bg-[#076D36]' : draft.completeness >= 50 ? 'bg-[#A65500]' : 'bg-text-secondary'
                          }`}
                          style={{ width: `${draft.completeness}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#BAD6FC] rounded-lg py-16 text-center select-none bg-[#EDF3FC]/10">
                <p className="text-sm font-sans font-black text-text-secondary">
                  {isNepali ? 'समीक्षाधीन प्रतीक्षा सूची खाली छ।' : 'All production queues are synchronized.'}
                </p>
                <p className="text-xs text-[#4C6488] mt-1.5 max-w-sm mx-auto leading-relaxed font-medium">
                  {isNepali 
                    ? 'कुनै मस्यौदा बाँकी छैनन्। प्रविष्टिहरू पूर्ण रूपमा प्रकाशित छन्।' 
                    : 'All editorial documents and advocacy campaigns are perfectly synced and active.'}
                </p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#BAD6FC]/50 bg-[#BAD6FC]/10 text-center select-none text-[11px] mt-4 rounded-b-lg">
            <button
              onClick={() => onNavigateToTab('blogs')}
              className="text-accent-link font-black hover:underline inline-flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-0.5"
            >
              {isNepali ? 'सम्पूर्ण सामग्री सम्पादकीय डेस्क खोल्नुहोस्' : 'Open Editorial Assembly Room'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Citizens Assistance Influx Panel (Col Span 2) */}
        <div className="lg:col-span-2 glass-panel shadow-glass rounded-xl p-5 flex flex-col justify-between border border-[#BAD6FC]/50">
          <div>
            <div className="flex items-center justify-between border-b border-[#BAD6FC]/40 pb-3 mb-4 select-none">
              <h3 className="text-xs font-sans font-black uppercase tracking-widest text-[#030C22] flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-[#A65500] shrink-0" />
                {isNepali ? 'नागरिक सोधपुछ प्रविष्टि र सुझाव' : 'Citizen Feed Intake'}
              </h3>
              <span className={`text-[10px] font-sans px-2.5 py-1 rounded-md font-extrabold border shadow-xs flex items-center gap-1 ${pendingSubmissions > 0 ? 'bg-red-800/10 text-red-800 border-red-800/25 animate-pulse' : 'bg-gray-100 text-gray-700 border-gray-300/30'}`}>
                {pendingSubmissions} {isNepali ? 'प्रतीक्षामा' : 'Pending'}
              </span>
            </div>

            {/* Submissions Inbox Queue */}
            <div className="space-y-3">
              {submissions.length > 0 ? (
                submissions.slice(0, 3).map((sub) => (
                  <div 
                    key={sub.id} 
                    className={`p-3.5 border rounded-lg space-y-2 transition-all duration-200 text-xs leading-relaxed shadow-sm ${
                      sub.resolved 
                        ? 'border-[#BACEE5]/65 bg-[#D4E4F7]/15 hover:bg-[#D4E4F7]/25' 
                        : 'border-[#F2C94C]/45 bg-[#FFFCE8]/60 hover:bg-[#FFFCE8]/90'
                    }`}
                  >
                    <div className="flex items-start justify-between select-none">
                      <div>
                        <span className="font-extrabold text-[#030C22] block font-sans text-[12px]">{sub.name}</span>
                        <span className="text-[10px] font-mono text-text-secondary font-bold">{sub.email} • {sub.phone}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 text-[8px] font-mono font-black rounded border ${
                        sub.resolved ? 'bg-green-800/10 text-[#076D36] border-green-800/20' : 'bg-red-800/10 text-red-800 border-red-800/20 animate-pulse'
                      }`}>
                        {sub.resolved ? (isNepali ? 'समाधान' : 'CLOSED') : (isNepali ? 'नयाँ' : 'PENDING')}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-primary text-left font-sans border-t border-black/5 pt-2">
                      <span className="font-extrabold text-[#030C22] block mb-1">
                        {isNepali ? 'विषय:' : 'Subject:'} {sub.subject}
                      </span>
                      <p className="text-text-secondary line-clamp-2 leading-relaxed font-semibold">
                        {sub.message}
                      </p>
                    </div>

                    {sub.resolved && sub.notes && (
                      <div className="text-[10px] text-[#0A4722] mt-1 bg-[#E2F0E7] border border-[#9DCCAD] p-2 rounded-[6px] font-bold leading-relaxed shadow-xs">
                        <strong>{isNepali ? 'समाधान नोट:' : 'DFAO Action Notes:'}</strong> {sub.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-text-muted font-bold">
                  {isNepali ? 'सम्पर्क परामर्श पेस खाली छ।' : 'Civil support queues are empty.'}
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-[#BAD6FC]/50 bg-[#BAD6FC]/10 text-center select-none text-[11px] mt-4 rounded-b-lg">
            <button
              onClick={() => onNavigateToTab('submissions')}
              className="text-accent-link font-black hover:underline inline-flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-0.5"
            >
              {isNepali ? 'सम्पूर्ण नागरिक परामर्श केन्द्र तालिका' : 'Open Civil Support Center'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Live Activity Stream (Full-width clean stream list) */}
      <div className="dark-glass-panel text-white shadow-glass-strong rounded-xl p-6 relative overflow-hidden z-10">
        {/* Soft background ambient shapes for darkness depth */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#0036B3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#076D36]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#BAD6FC]/15 pb-4 mb-4 select-none z-10 relative gap-3">
          <h3 className="text-xs font-sans font-black uppercase tracking-widest text-[#BCD2EE] flex items-center gap-2">
            <Clock className="w-4 h-4 text-white shrink-0 animate-spin-slow" />
            {isNepali ? 'प्रणाली सम्पादकीय अडिट लग' : 'System Activity Audit Ledger'}
          </h3>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-[#BCD2EE] font-mono mr-1 hidden sm:inline uppercase tracking-widest font-black">
              Filtered Stream:
            </span>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as any)}
              className="text-[10px] bg-[#091B3D] border border-white/20 text-[#F4F8FF] py-1 px-3 rounded-md outline-none font-bold cursor-pointer transition-colors hover:border-[#8FB4DF]/50"
            >
              <option value="all">{isNepali ? 'सबै लग गतिविधि' : 'System-wide Updates'}</option>
              <option value="blog">{isNepali ? 'लेखा प्रणाली (ब्लग)' : 'Blogs Editorial Only'}</option>
              <option value="project">{isNepali ? 'वकालत र र्‍याम्प अडिट' : 'Advocacy Projects Only'}</option>
              <option value="program">{isNepali ? 'सरोकारवाला तालिम' : 'Summit Workshops Only'}</option>
              <option value="submission">{isNepali ? 'सम्पर्क जिज्ञासा पेस' : 'Citizen Assistance'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-10 relative">
          {filteredLogs.slice(0, 6).map((log) => (
            <div 
              key={log.id} 
              className="p-4 bg-[#0E2551]/75 border border-[#14336B]/60 hover:border-[#2C5EA8] hover:bg-[#12316B] rounded-lg text-xs flex gap-3 items-start text-left leading-relaxed shadow-sm hover:shadow transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-[#05112E] text-white border border-[#1E4E9E]/45 flex items-center justify-center rounded-md shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                {log.contentType === 'blog' && <FileText className="w-4 h-4 text-[#8299BB]" />}
                {log.contentType === 'project' && <Compass className="w-4 h-4 text-[#82FACD]" />}
                {log.contentType === 'program' && <Calendar className="w-4 h-4 text-[#FAD782]" />}
                {log.contentType === 'submission' && <Inbox className="w-4 h-4 text-[#F89BCB]" />}
              </div>
              <div className="overflow-hidden">
                <span className="font-extrabold text-white block font-sans text-[12px] tracking-tight">
                  {isNepali ? log.userNp : log.userEn}
                </span>
                <p className="text-[#BCD2EE] mt-1 font-sans font-semibold leading-relaxed text-[11px]">
                  {isNepali ? log.actionNp : log.action}:{' '}
                  <span className="italic text-white font-extrabold">
                    "{isNepali ? log.contentNameNp : log.contentNameEn}"
                  </span>
                </p>
                <div className="text-[9px] text-[#8299BB] font-mono mt-2 select-none flex items-center gap-1 font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-[#BCD2EE]/80" />
                  {isNepali ? log.timeAgoNp : log.timeAgoEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
