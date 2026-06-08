import React, { useState, useEffect } from 'react';
import { 
  Compass, FileText, Calendar, Inbox, Image, Accessibility, Globe, Sparkles, 
  Send, Phone, Mail, MapPin, Eye, CheckCircle2, ChevronRight, X, Heart, Search, HelpCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { Blog, Project, Program, CarouselSlide, AboutUsSettings, ContactSubmission } from '../types';

interface GuestPortalProps {
  blogs: Blog[];
  projects: Project[];
  programs: Program[];
  carousel: CarouselSlide[];
  about: AboutUsSettings;
  isNepali: boolean;
  setIsNepali: (val: boolean) => void;
  onSwitchToAdmin: () => void;
  onSubmitContact: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'resolved'>) => void;
  onSimulateNotification: (message: string, actionNp?: string) => void;
}

// Helper calculations for WCAG AA/AAA Color Contrast Compliance
function getRelativeLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function parseHex(hex: string) {
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16)
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16)
    };
  }
  return null;
}

function calculateContrastRatio(hex1: string, hex2: string) {
  const rgb1 = parseHex(hex1);
  const rgb2 = parseHex(hex2);
  if (!rgb1 || !rgb2) return 1.0;
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export default function GuestPortal({
  blogs,
  projects,
  programs,
  carousel,
  about,
  isNepali,
  setIsNepali,
  onSwitchToAdmin,
  onSubmitContact,
  onSimulateNotification
}: GuestPortalProps) {
  // Navigation: 'home' | 'projects' | 'programs' | 'gallery' | 'about' | 'contact' | 'blog'
  const [activeGuestTab, setActiveGuestTab] = useState<string>('home');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Hero Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Search & Filter state for sections
  const [blogSearch, setBlogSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [programSearch, setProgramSearch] = useState('');
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // RSVP Form State
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', programId: '' });
  const [registeredProgramEn, setRegisteredProgramEn] = useState('');
  const [isRsvpDone, setIsRsvpDone] = useState(false);

  // Gallery Modal Lightbox
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);

  // INTERACTIVE ACCESSIBILITY TOOLKIT STATES
  const [toolkitActiveTab, setToolkitActiveTab] = useState<'ramp' | 'contrast' | 'barrier'>('ramp');
  
  // Ramp Calculator state (Rise in inches, Run in inches)
  const [rampRise, setRampRise] = useState<number>(12);
  const [rampRun, setRampRun] = useState<number>(144);
  
  // Color Contrast state
  const [contrastText, setContrastText] = useState<string>('#0036B3');
  const [contrastBg, setContrastBg] = useState<string>('#FFFFFF');
  
  // Sidewalk Barrier state
  const [barrierForm, setBarrierForm] = useState({
    reporterName: '',
    category: 'Sidewalk Obstruction',
    location: 'Lazimpat Lane',
    description: ''
  });
  const [isBarrierSubmitted, setIsBarrierSubmitted] = useState<boolean>(false);
  const [customBarriers, setCustomBarriers] = useState([
    {
      id: 'bar-1',
      reporter: 'Anuj Shrestha',
      category: 'Steep Sidewalk Ramp',
      location: 'Lazimpat Lane (Near Shangri-La)',
      description: 'The entrance ramp is steeper than 12 degrees. Wheelchair users need extra assistance here.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isVerified: true
    },
    {
      id: 'bar-2',
      reporter: 'Nisha Pathak',
      category: 'Blocked Tactile Path',
      location: 'Koteshwor Underpass Junction',
      description: 'Motorbikes are parked on top of the yellow guide brick path for blind individuals.',
      createdAt: new Date(Date.now() - 10000000).toISOString(),
      isVerified: false
    }
  ]);

  // Toggle Auto carousel rotation
  useEffect(() => {
    if (activeGuestTab !== 'home' || carousel.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carousel.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeGuestTab, carousel.length]);

  // Handle Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    onSubmitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'General Inquiry',
      message: formData.message
    });

    onSimulateNotification(
      `New public inquiry submitted by ${formData.name}`,
      `${formData.name} द्वारा नयाँ सोधपुछ दर्ता गरिएको छ`
    );

    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 4000);
  };

  // Handle RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.email) return;

    const prog = programs.find(p => p.id === rsvpData.programId);
    if (!prog) return;

    setRegisteredProgramEn(prog.titleEn);
    onSimulateNotification(
      `Seat reserved: ${rsvpData.name} RSVP-ed for "${prog.titleEn}"`,
      `सिट आरक्षित: ${rsvpData.name} ले "${prog.titleNp}" मा भाग लिन दर्ता गर्नुभयो`
    );

    setIsRsvpDone(true);
    setTimeout(() => {
      setRsvpData({ name: '', email: '', programId: '' });
      setIsRsvpDone(false);
    }, 4000);
  };

  // Published Filtered Streams
  const publishedBlogs = blogs.filter(b => b.status === 'published');
  const publishedProjects = projects.filter(p => p.status === 'published');
  const publishedPrograms = programs.filter(pr => pr.status === 'published');

  // Search Results
  const filteredBlogsList = publishedBlogs.filter(b => 
    b.titleEn.toLowerCase().includes(blogSearch.toLowerCase()) || 
    b.titleNp.includes(blogSearch) ||
    b.bodyEn.toLowerCase().includes(blogSearch.toLowerCase()) ||
    b.bodyNp.includes(blogSearch)
  );

  const filteredProjectsList = publishedProjects.filter(p => 
    p.titleEn.toLowerCase().includes(projectSearch.toLowerCase()) || 
    p.titleNp.includes(projectSearch) || 
    p.locationEn.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredProgramsList = publishedPrograms.filter(pr => 
    pr.titleEn.toLowerCase().includes(programSearch.toLowerCase()) || 
    pr.titleNp.includes(programSearch) ||
    pr.venueEn.toLowerCase().includes(programSearch.toLowerCase())
  );

  // Simulated SEO Check Calculations
  const getSeoAudit = (blog: Blog) => {
    const checks = [
      { id: 1, labelEn: "Focus keyphrase in SEO Title", resolved: !!blog.seoFocusKeyphrase && (blog.seoTitleEn?.includes(blog.seoFocusKeyphrase) || blog.titleEn.includes(blog.seoFocusKeyphrase)), score: 20 },
      { id: 2, labelEn: "SEO Title length (optimal 45-65 characters)", resolved: ((blog.seoTitleEn?.length || blog.titleEn.length) > 40 && (blog.seoTitleEn?.length || blog.titleEn.length) < 70), score: 20 },
      { id: 3, labelEn: "Meta description found and length correct", resolved: !!blog.seoDescriptionEn && blog.seoDescriptionEn.length > 50, score: 20 },
      { id: 4, labelEn: "Focus keyphrase found in article first line", resolved: !!blog.seoFocusKeyphrase && blog.bodyEn.toLowerCase().includes((blog.seoFocusKeyphrase || '').toLowerCase()), score: 20 },
      { id: 5, labelEn: "Canonical URL pointing correctly", resolved: !!blog.seoCanonicalUrl && blog.seoCanonicalUrl.startsWith('http'), score: 20 },
    ];
    const totalScore = checks.reduce((sum, item) => sum + (item.resolved ? item.score : 0), 0);
    return { checks, score: totalScore };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* GUEST PORTAL SYSTEM HEADER */}
      <nav className="glass-panel-heavy border-b border-[#BAD6FC] h-[64px] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveGuestTab('home'); setSelectedBlog(null); setSelectedProject(null); }}>
          <div className="w-8 h-8 rounded-md bg-[#0036B3] text-white flex items-center justify-center shadow-sm shrink-0">
            <Accessibility className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-sans font-black tracking-tight text-[#041E42] leading-none block">DFAO PORTAL</span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#0036B3] uppercase block leading-none">Nepal Citizen Lobby</span>
          </div>
        </div>

        {/* Dynamic Desktop Links */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#2C3E5A]">
          {[
            { id: 'home', labelEn: 'Advocacy Portal', labelNp: 'अधिकार मूलद्वार' },
            { id: 'projects', labelEn: 'Accessibility Audits', labelNp: 'भौतिक पहुँचता अडिट' },
            { id: 'programs', labelEn: 'Capacity Workshops', labelNp: 'क्षमता विकास तालिम' },
            { id: 'gallery', labelEn: 'Visual Evidence Logs', labelNp: 'स्थलगत फोटो प्रमाण' },
            { id: 'about', labelEn: 'Our Civic Mission', labelNp: 'हाम्रो वकालत टोली' },
            { id: 'blog', labelEn: 'Rights News Feed', labelNp: 'अधिकार र सञ्चार केन्द्र' },
            { id: 'contact', labelEn: 'Request Safe Audit', labelNp: 'अडिट सेवा अनुरोध' }
          ].map((lnk) => (
            <button
              key={lnk.id}
              onClick={() => {
                setActiveGuestTab(lnk.id);
                setSelectedBlog(null);
                setSelectedProject(null);
              }}
              className={`px-3 py-1.5 rounded-[3px] font-bold transition-all ${
                activeGuestTab === lnk.id
                  ? 'bg-[#0036B3] text-white shadow-sm'
                  : 'hover:bg-slate-100 text-[#4E607A]'
              }`}
            >
              {isNepali ? lnk.labelNp : lnk.labelEn}
            </button>
          ))}
        </div>

        {/* Language Selection and Switch to Admin CTA */}
        <div className="flex items-center gap-3">
          {/* Bilingual Switcher */}
          <div className="flex border border-[#B1C9EA] p-0.5 rounded-[3px] bg-white text-[10px] shadow-sm select-none">
            <button
              onClick={() => setIsNepali(false)}
              className={`px-1.5 py-0.5 rounded-sm font-bold transition-colors ${!isNepali ? 'bg-[#0036B3] text-white' : 'text-slate-600 hover:text-[#0036B3]'}`}
            >
              EN
            </button>
            <button
              onClick={() => setIsNepali(true)}
              className={`px-1.5 py-0.5 rounded-sm font-bold font-devanagari transition-colors ${isNepali ? 'bg-[#0036B3] text-white' : 'text-slate-600 hover:text-[#0036B3]'}`}
            >
              नेपाली
            </button>
          </div>

          <button
            onClick={onSwitchToAdmin}
            className="px-3.5 h-[34px] bg-[#041E42] hover:bg-[#0036B3] text-white text-xs font-sans font-bold rounded-[3px] flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
          >
            🔐 <span>{isNepali ? 'शानदार CMS' : 'DFAO CMS Console'}</span>
          </button>
        </div>
      </nav>

      {/* PUBLIC ACCESS WARNING BANNER */}
      <div className="bg-[#EBF5FF] border-b border-[#BAD6FC] text-center py-2 px-4 text-[11px] font-medium text-[#1E3A8A] flex items-center justify-center gap-1.5 select-none animate-fade-in">
        <Sparkles className="w-3.5 h-3.5 text-[#0036B3] shrink-0" />
        <span>
          {isNepali 
            ? "तपाईं नागरिक अतिथी पोर्टल हेर्दै हुनुहुन्छ। माथिको 'DFAO CMS Console' थिचेर सिधै नियन्त्रण कक्ष भित्र प्रविष्ट गर्न सक्नुहुन्छ!" 
            : "You are previewing the visitor-facing platform. Press 'DFAO CMS Console' to access the administrative editor backend anytime!"}
        </span>
      </div>

      {/* MOBILE FLOATING TAB SELECTOR */}
      <div className="lg:hidden bg-white border-b border-[#B1C9EA] p-2 overflow-x-auto whitespace-nowrap flex gap-1 scrollbar-none sticky top-[64px] z-30 shadow-xs">
        {[
          { id: 'home', labelEn: 'Advocacy Portal', labelNp: 'अधिकार मूलद्वार' },
          { id: 'projects', labelEn: 'Accessibility Audits', labelNp: 'पैरवी अडिट' },
          { id: 'programs', labelEn: 'Capacity Workshops', labelNp: 'तालिम र गोष्ठी' },
          { id: 'gallery', labelEn: 'Visual Evidence Logs', labelNp: 'स्थलगत फोटो' },
          { id: 'about', labelEn: 'Our Civic Mission', labelNp: 'हाम्रो टोली' },
          { id: 'blog', labelEn: 'Rights News Feed', labelNp: 'अधिकार सुचना' },
          { id: 'contact', labelEn: 'Request Safe Audit', labelNp: 'सम्पर्क अडिट' }
        ].map((lnk) => (
          <button
            key={lnk.id}
            onClick={() => {
              setActiveGuestTab(lnk.id);
              setSelectedBlog(null);
              setSelectedProject(null);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-[3px] shrink-0 ${
              activeGuestTab === lnk.id ? 'bg-[#0036B3] text-white' : 'text-[#4E607A]'
            }`}
          >
            {isNepali ? lnk.labelNp : lnk.labelEn}
          </button>
        ))}
      </div>

      {/* MAIN CONTAINER STREAM */}
      <main className="grow">
        {/* TAB 1: LANDING PAGE */}
        {activeGuestTab === 'home' && (
          <div className="space-y-16 pb-16">
            {/* HERO SLIDER (CAROUSEL) */}
            {carousel.length > 0 && (
              <div className="relative h-[280px] md:h-[480px] bg-slate-900 overflow-hidden group">
                <img
                  src={carousel[carouselIndex]?.image}
                  alt="Organization banner cover"
                  className="w-full h-full object-cover opacity-65 transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Dynamic Gradient backdrop for perfect accessibility standard contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent flex items-end">
                  <div className="max-w-[800px] p-6 md:p-12 text-white space-y-3">
                    <span className="bg-[#0036B3] text-[9.5px] tracking-widest font-mono text-white font-extrabold uppercase px-2 py-0.5 rounded-sm">
                      {isNepali ? 'क्रियाशील गैर-सरकारी संस्था' : 'Active Grassroots Action'}
                    </span>
                    <h1 className="text-xl md:text-4xl font-extrabold tracking-tight leading-tight">
                      {isNepali ? carousel[carouselIndex]?.titleNp : carousel[carouselIndex]?.titleEn}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-200 font-medium max-w-xl">
                      {isNepali ? carousel[carouselIndex]?.subtitleNp : carousel[carouselIndex]?.subtitleEn}
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          const dest = carousel[carouselIndex]?.buttonLink || 'projects';
                          setActiveGuestTab(dest);
                        }}
                        className="px-4 py-2 bg-white text-[#1E3A8A] text-xs font-bold rounded-[3px] hover:bg-slate-200 transition-colors"
                      >
                        {isNepali ? carousel[carouselIndex]?.buttonTextNp : carousel[carouselIndex]?.buttonTextEn}
                      </button>

                      {/* Carousel bullet indicators */}
                      <div className="flex gap-1.5 ml-2">
                        {carousel.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setCarouselIndex(dotIdx)}
                            className={`w-2.5 h-2.5 rounded-full transition-color ${dotIdx === carouselIndex ? 'bg-[#0036B3]' : 'bg-slate-400/70'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QUICK HIGHLIGHT STATISTICS */}
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 select-none -mt-8 relative z-10">
              <div className="bg-white p-5 rounded-[4px] border border-[#B1C9EA] shadow-glass flex items-center gap-4 hover:border-[#0036B3] transition-colors">
                <div className="w-12 h-12 bg-blue-50 text-[#0036B3] border border-blue-100 flex items-center justify-center rounded-md shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-2xl font-black text-[#041E42] font-mono tabular-nums">{publishedProjects.length}+</span>
                  <span className="text-xs text-slate-500 font-semibold">{isNepali ? 'सञ्चालित पैरवी आयोजना' : 'Active Accessibility Audits'}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[4px] border border-[#B1C9EA] shadow-glass flex items-center gap-4 hover:border-emerald-600 transition-colors">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center rounded-md shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-2xl font-black text-emerald-800 font-mono tabular-nums">{publishedPrograms.length}+</span>
                  <span className="text-xs text-slate-500 font-semibold">{isNepali ? 'सम्मेलन र तालिमहरू' : 'Completed Workshops'}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[4px] border border-[#B1C9EA] shadow-glass flex items-center gap-4 hover:border-indigo-600 transition-colors">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center rounded-md shrink-0">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-2xl font-black text-indigo-900 font-mono tabular-nums">100%</span>
                  <span className="text-xs text-slate-500 font-semibold">{isNepali ? 'पारदर्शी नागरिक सुझाव' : 'Citizen Feedback Resolution'}</span>
                </div>
              </div>
            </div>

            {/* INTRODUCTION BRIEF */}
            <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#0036B3] uppercase font-bold bg-[#BAD6FC]/30 px-3 py-1 rounded-full">
                {isNepali ? 'हाम्रो उद्देश्य' : 'Key Core Mandate'}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#041E42] tracking-tight">
                {isNepali ? 'अपाङ्गता अधिकार सुनिश्चितताका लागि वकालत' : 'Ensuring Equal Civil Mobility Paths across Cities'}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
                {isNepali 
                  ? 'अपाङ्गता भएका व्यक्तिको सहज आवतजावत सुनिश्चित गर्न सार्वजनिक संरचनाहरूको स्थलगत भौतिक सुरक्षा परीक्षण (Ramp Audit), दृष्टिविहीनहरूको तालिम र शिक्षामा जोड दिदै आइरहेका छौं।' 
                  : 'We systematic auditing major metropolitan facilities, layout standard accessible wheelchair ramps, establish Braille education modules, and provide technical course sponsorships.'}
              </p>
            </div>

            {/* FEATURED ADVOCACY INITIATIVE */}
            <div className="bg-slate-100 border-y border-[#B1C9EA] py-16">
              <div className="max-w-6xl mx-auto px-4 space-y-8">
                <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#041E42]">{isNepali ? 'विशेष सिफारिस पैरवी योजना' : 'Featured Advocacy Projects'}</h3>
                    <p className="text-xs text-slate-500">{isNepali ? 'अहिले सञ्चालन भइरहेका मुख्य भौतिक तथा कानुनी अभियानहरू।' : 'Key ongoing campaigns aiming to secure public architectural compliance.'}</p>
                  </div>
                  <button onClick={() => setActiveGuestTab('projects')} className="text-xs text-[#0036B3] font-bold hover:underline flex items-center gap-0.5">
                    {isNepali ? 'सबै योजना' : 'View All Projects'} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {publishedProjects.slice(0, 2).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => { setSelectedProject(item); setActiveGuestTab('projects'); }}
                      className="bg-white border border-[#B1C9EA] hover:border-[#0036B3] rounded-[4px] overflow-hidden cursor-pointer shadow-sm transition-all group hover:shadow-md"
                    >
                      <div className="h-44 overflow-hidden bg-slate-200 relative">
                        <img src={item.imageEn} alt={item.titleEn} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute top-2.5 left-2.5 bg-green-700 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                          {isNepali ? item.statusNp : item.statusEn}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] text-slate-400 font-mono block select-none">{isNepali ? item.locationNp : item.locationEn}</span>
                        <h4 className="text-sm font-bold text-[#041E42] line-clamp-1">{isNepali ? item.titleNp : item.titleEn}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{isNepali ? item.descriptionNp : item.descriptionEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC CALENDAR & NEWS SECTION */}
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Event Listings */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-extrabold text-[#041E42]">{isNepali ? 'मुख्य जनशक्ती तालिम तथा वकालत कार्यक्रम' : 'Upcoming Collective Sessions'}</h3>
                  <button onClick={() => setActiveGuestTab('programs')} className="text-xs text-[#0036B3] font-bold hover:underline">
                    {isNepali ? 'सबै कार्यक्रमहरू' : 'All Events'}
                  </button>
                </div>
                <div className="space-y-4">
                  {publishedPrograms.slice(0, 2).map((prog) => (
                    <div key={prog.id} className="p-4 bg-white border border-[#B1C9EA] rounded-[4px] flex gap-4 hover:border-[#0036B3] transition-colors">
                      <div className="w-14 h-14 bg-blue-50 text-[#0036B3] flex flex-col items-center justify-center border border-blue-100 rounded-[3px] shrink-0 text-center leading-none">
                        <Calendar className="w-4 h-4 mb-1" />
                        <span className="text-[9px] font-semibold tracking-tighter uppercase">EVENT</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#041E42]">{isNepali ? prog.titleNp : prog.titleEn}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{isNepali ? prog.venueNp : prog.venueEn} | {isNepali ? prog.dateNp : prog.dateEn}</p>
                        <button 
                          onClick={() => {
                            setRsvpData(prev => ({ ...prev, programId: prog.id }));
                            setActiveGuestTab('programs');
                          }}
                          className="text-[10px] font-extrabold text-[#0036B3] hover:underline mt-2 inline-block"
                        >
                          🎟️ {isNepali ? 'हामीसँग जोडिनुहोस्' : 'Register / Secure RSVP Seat'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Blog Press Release highlights */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-extrabold text-[#041E42]">{isNepali ? 'प्रेस विज्ञप्ति र वकालत ब्लग' : 'Press Feed & Digital Columns'}</h3>
                  <button onClick={() => setActiveGuestTab('blog')} className="text-xs text-[#0036B3] font-bold hover:underline">
                    {isNepali ? 'सबै सुचना हेर्नुहोस्' : 'Browse Press Desk'}
                  </button>
                </div>
                <div className="space-y-4">
                  {publishedBlogs.slice(0, 2).map((blog) => (
                    <div 
                      key={blog.id} 
                      onClick={() => { setSelectedBlog(blog); setActiveGuestTab('blog'); }}
                      className="p-3 hover:bg-white rounded-[3px] border border-transparent hover:border-[#B1C9EA] cursor-pointer flex gap-4 transition-all"
                    >
                      <div className="w-16 h-12 bg-slate-200 rounded-[2px] overflow-hidden shrink-0">
                        <img src={blog.imageEn} alt="Blog preview thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-[#0036B3] uppercase block">{isNepali ? blog.categoryNp : blog.categoryEn}</span>
                        <h4 className="text-xs font-bold text-[#041E42] line-clamp-1">{isNepali ? blog.titleNp : blog.titleEn}</h4>
                        <span className="text-[9.5px] text-slate-400 font-medium block mt-0.5">{isNepali ? 'लेखक :' : 'By'} {isNepali ? blog.authorNp : blog.authorEn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* INTERACTIVE CITIZEN ACCESSIBILITY TOOLKIT & BARRIER REPORTER */}
            <div className="max-w-6xl mx-auto px-4 py-8 bg-white border border-[#B1C9EA] rounded-[8px] shadow-sm space-y-8 select-none">
              <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#0036B3] uppercase block">
                    {isNepali ? 'अन्तरक्रियात्मक नागरिक उपकरणहरू' : 'Public Awareness Toolkit'}
                  </span>
                  <h3 className="text-xl font-black text-[#041E42] mt-1">
                    {isNepali ? '🧰 नागरिक पहुँचयोग्यता परीक्षण केन्द्र' : '🧰 Citizen Accessibility Toolkit & Safe Slope Inspector'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isNepali 
                      ? 'अपाङ्गता-मैत्री भौतिक र डिजिटल मापदण्डहरू जाँच गर्ने तथा स्थलगत अवरोध दर्ता गर्ने खुला केन्द्र।' 
                      : 'Test physical slopes and check visual color compliance utilizing live Devanagari parsing parameters.'}
                  </p>
                </div>

                {/* Toolkit sub-navigation tabs */}
                <div className="flex bg-slate-100 p-1 border border-[#B1C9EA]/60 rounded-md text-[11px] font-bold shrink-0 self-start md:self-center">
                  <button
                    onClick={() => setToolkitActiveTab('ramp')}
                    className={`px-3 py-1.5 rounded transition-all ${toolkitActiveTab === 'ramp' ? 'bg-[#0036B3] text-white shadow-xs' : 'text-slate-600 hover:text-[#0036B3]'}`}
                  >
                    📐 {isNepali ? 'र्‍याम्प ग्रेड क्याल्कुलेटर' : 'Ramp Slope Calculator'}
                  </button>
                  <button
                    onClick={() => setToolkitActiveTab('contrast')}
                    className={`px-3 py-1.5 rounded transition-all ${toolkitActiveTab === 'contrast' ? 'bg-[#0036B3] text-white shadow-xs' : 'text-slate-600 hover:text-[#0036B3]'}`}
                  >
                    👁️ {isNepali ? 'रंगको स्पष्टता' : 'Visual Contrast Checker'}
                  </button>
                  <button
                    onClick={() => setToolkitActiveTab('barrier')}
                    className={`px-3 py-1.5 rounded transition-all relative ${toolkitActiveTab === 'barrier' ? 'bg-[#0036B3] text-white shadow-xs' : 'text-slate-600 hover:text-[#0036B3]'}`}
                  >
                    🚨 {isNepali ? 'स्थलगत अवरोध रिपोर्टर' : 'Civic Barrier Reporter'}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-ping" />
                  </button>
                </div>
              </div>

              {/* TOOLKIT CONTENT VIEWER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* TAB 1: RAMP CALCULATOR */}
                {toolkitActiveTab === 'ramp' && (
                  <>
                    {/* Controls & Metrics */}
                    <div className="lg:col-span-5 space-y-5 bg-slate-50 p-5 rounded-md border border-[#BAD6FC]/50">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-[#0036B3] block">Slope Calculator Values</span>
                      
                      {/* Height / Rise in inches */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-extrabold text-slate-700">{isNepali ? 'उचाइ (इन्चमा)' : 'Vertical Rise (Inches)'}</label>
                          <span className="font-mono font-bold text-[#0036B3] tabular-nums">{rampRise}" {isNepali ? 'इन्च' : 'in'} ({Math.round(rampRise * 2.54)} cm)</span>
                        </div>
                        <input 
                          type="range" 
                          min={2} 
                          max={36} 
                          step={1}
                          value={rampRise}
                          onChange={(e) => setRampRise(Number(e.target.value))}
                          className="w-full h-1.5 bg-[#BAD6FC]/40 rounded-lg appearance-none cursor-pointer accent-[#0036B3]"
                        />
                      </div>

                      {/* Length / Run in inches */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-extrabold text-slate-700">{isNepali ? 'तेर्सो लम्बाई (इन्चमा)' : 'Horizontal Run (Inches)'}</label>
                          <span className="font-mono font-bold text-[#0036B3] tabular-nums">{rampRun}" {isNepali ? 'इन्च' : 'in'} ({Math.round(rampRun * 2.54)} cm)</span>
                        </div>
                        <input 
                          type="range" 
                          min={12} 
                          max={288} 
                          step={6}
                          value={rampRun}
                          onChange={(e) => setRampRun(Number(e.target.value))}
                          className="w-full h-1.5 bg-[#BAD6FC]/40 rounded-lg appearance-none cursor-pointer accent-[#0036B3]"
                        />
                      </div>

                      {/* Quick Ratio display & standard calculations */}
                      {(() => {
                        const ratio = Math.round((rampRun / rampRise) * 10) / 10;
                        const angle = Math.round((Math.atan(rampRise / rampRun) * (180 / Math.PI)) * 100) / 100;
                        const percent = Math.round((rampRise / rampRun) * 10000) / 100;
                        
                        let rating = 'danger';
                        let descEn = 'Critically steep for handicap wheelchairs. High tipping hazard!';
                        let descNp = 'अति भिरालो र असुरक्षित र्‍याम्प! यसले ह्विलचेयर दुर्घटना निम्त्याउन सक्छ।';
                        
                        if (ratio >= 12) {
                          rating = 'safe';
                          descEn = 'Gold standard (1:12 or lower ratio). Ideal blueprint for easy self-wheeled transit!';
                          descNp = 'उत्कृष्ठ र्‍याम्प मापदण्ड (१:१२ वा कम)। यसमा ह्विलचेयर सजिलै चलाउन सकिन्छ।';
                        } else if (ratio >= 10) {
                          rating = 'marginal';
                          descEn = 'Marginal (1:10 ratio). Feasible but demands physical backing assistance.';
                          descNp = 'साधारण मापदण्ड (१:१०)। ह्विलचेयर चलाउन सहयोगी आवश्यक पर्न सक्छ।';
                        }

                        return (
                          <div className="pt-3 border-t border-slate-200 space-y-3 font-medium">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-2 bg-white border border-[#BAD6FC]/40 text-center rounded">
                                <span className="block text-[8px] text-slate-400 font-mono uppercase tracking-wider">Ratio Outline</span>
                                <span className="text-xs font-black text-[#041E42] font-mono">1 : {ratio}</span>
                              </div>
                              <div className="p-2 bg-white border border-[#BAD6FC]/40 text-center rounded">
                                <span className="block text-[8px] text-slate-400 font-mono uppercase tracking-wider">Slope Angle</span>
                                <span className="text-xs font-black text-[#041E42] font-mono">{angle}°</span>
                              </div>
                              <div className="p-2 bg-white border border-[#BAD6FC]/40 text-center rounded">
                                <span className="block text-[8px] text-slate-400 font-mono uppercase tracking-wider">Gradient</span>
                                <span className="text-xs font-black text-[#041E42] font-mono">{percent}%</span>
                              </div>
                            </div>

                            {/* Verdict Box */}
                            <div className={`p-4 rounded border text-xs leading-relaxed ${
                              rating === 'safe' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                              rating === 'marginal' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                              'bg-rose-50 border-rose-200 text-rose-800'
                            }`}>
                              <div className="flex items-center gap-1.5 font-bold uppercase text-[10.5px] tracking-wide mb-1 select-none">
                                {rating === 'safe' && <span>🟢 {isNepali ? 'सुरक्षित उत्कृष्ट ग्रेड' : 'Safe Accessibility Grade'}</span>}
                                {rating === 'marginal' && <span>🟡 {isNepali ? 'मध्यम जोखिम ग्रेड' : 'Marginal Transit Slope'}</span>}
                                {rating === 'danger' && <span>🔴 {isNepali ? 'असुरक्षित भिरालो ग्रेड' : 'Dangerously Steep Slope'}</span>}
                              </div>
                              <p className="font-semibold">{isNepali ? descNp : descEn}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Interactive Right-Angle Triangle visualizer */}
                    <div className="lg:col-span-7 flex flex-col justify-between self-stretch bg-slate-950 text-white p-5 rounded-md border border-slate-800 select-none relative overflow-hidden">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2 z-10">
                        <span className="text-[10px] font-mono tracking-widest text-[#B5D4FF] font-extrabold uppercase">Live Vector Slope Simulator</span>
                        <div className="flex gap-2 text-[9px] font-mono text-slate-400">
                          <span>Rise: {rampRise}"</span>
                          <span>•</span>
                          <span>Run: {rampRun}"</span>
                        </div>
                      </div>

                      {/* SVG Stage */}
                      {(() => {
                        const triangleBaseWidth = 260; // scale
                        // Compute dynamic proportional visual height
                        const slopeRatio = rampRise / rampRun;
                        const triangleHeight = Math.min(100, Math.max(16, slopeRatio * triangleBaseWidth));
                        const yCoord = 120 - triangleHeight;

                        return (
                          <div className="my-8 flex justify-center items-center shrink-0">
                            <svg className="w-full max-w-[320px] h-[140px]" viewBox="0 0 300 140">
                              <defs>
                                <linearGradient id="rampFill" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#0036B3" stopOpacity="0.8" />
                                  <stop offset="100%" stopColor="#001850" stopOpacity="0.4" />
                                </linearGradient>
                              </defs>
                              
                              {/* Reference Ground Level line */}
                              <line x1="20" y1="120" x2="280" y2="120" stroke="#475569" strokeWidth="2" strokeDasharray="4,4" />
                              
                              {/* Dynamic Sloped Block Polygon */}
                              <polygon 
                                points={`20,120 270,120 270,${yCoord}`} 
                                fill="url(#rampFill)" 
                                stroke="#3B82F6" 
                                strokeWidth="3" 
                              />
                              
                              {/* Corner Indicators */}
                              <circle cx="20" cy="120" r="4" fill="#3B82F6" />
                              <circle cx="270" cy={yCoord} r="4" fill="#EF4444" />
                              <circle cx="270" cy="120" r="4" fill="#4B5563" />

                              {/* Label text anchors */}
                              <text x="140" y="132" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">Run Length: {rampRun}"</text>
                              <text x="278" y={(120 + yCoord) / 2} fill="#EF4444" fontSize="9" textAnchor="start" dominantBaseline="middle" fontFamily="monospace">Rise: {rampRise}"</text>
                              
                              {/* Moving active wheelchair dot */}
                              <circle cx="100" cy={120 - (slopeRatio * (100 - 20))} r="5" fill="#FFFFFF" className="animate-pulse" />
                            </svg>
                          </div>
                        );
                      })()}

                      <p className="text-[10px] text-slate-400 font-sans leading-normal italic text-center leading-relaxed">
                        Accessibility code (ISO & Government of Nepal Architectural Guidelines) recommends a maximum slope of <b>1:12 (4.76 degrees)</b> for public wheelchair lanes.
                      </p>
                    </div>
                  </>
                )}

                {/* TAB 2: WCAG COLOR CONTRAST INSPECTOR */}
                {toolkitActiveTab === 'contrast' && (
                  <>
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-md border border-[#BAD6FC]/50">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-[#0036B3] block">Color Selections</span>
                      
                      {/* Text Color Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 block">{isNepali ? 'अक्षरको रंग (Text Hex)' : 'Foreground Text Hex *'}</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={contrastText} 
                            onChange={(e) => setContrastText(e.target.value)}
                            className="w-10 h-8 p-0.5 rounded cursor-pointer border border-[#B1C9EA] bg-white shrink-0"
                          />
                          <input 
                            type="text" 
                            maxLength={7}
                            placeholder="#0036B3"
                            value={contrastText}
                            onChange={(e) => setContrastText(e.target.value)}
                            className="w-full text-xs font-mono font-bold px-3 py-1.5 bg-white border border-[#B1C9EA] rounded"
                          />
                        </div>
                      </div>

                      {/* Background Color Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 block">{isNepali ? 'पृष्ठभूमि रंग (Background Hex)' : 'Canvas Background Hex *'}</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={contrastBg} 
                            onChange={(e) => setContrastBg(e.target.value)}
                            className="w-10 h-8 p-0.5 rounded cursor-pointer border border-[#B1C9EA] bg-white shrink-0"
                          />
                          <input 
                            type="text" 
                            maxLength={7}
                            placeholder="#FFFFFF"
                            value={contrastBg}
                            onChange={(e) => setContrastBg(e.target.value)}
                            className="w-full text-xs font-mono font-bold px-3 py-1.5 bg-white border border-[#B1C9EA] rounded"
                          />
                        </div>
                      </div>

                      {/* Presets - QUICK ACCESS */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wide block mb-2">High Accessibility Presets</span>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                          <button 
                            onClick={() => { setContrastText('#0036B3'); setContrastBg('#FFFFFF'); }}
                            className="py-1 bg-white border border-slate-200 hover:border-[#0036B3] rounded text-[#0036B3] text-center"
                          >
                            🔵 Classic Blue
                          </button>
                          <button 
                            onClick={() => { setContrastText('#FFFFFF'); setContrastBg('#091B3D'); }}
                            className="py-1 bg-[#091B3D] border border-slate-800 hover:border-white rounded text-white text-center"
                          >
                            🌌 Night Mode
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Calculations Display & Interactive Preview and Verdict */}
                    <div className="lg:col-span-7 flex flex-col justify-between self-stretch bg-white p-5 rounded-md border border-[#B1C9EA] space-y-4">
                      
                      {/* Active Preview Frame */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-[#0036B3] block">Interactive Contrast Canvas</span>
                        <div 
                          className="p-8 rounded border border-slate-200 text-center font-bold transition-all"
                          style={{ color: contrastText, backgroundColor: contrastBg }}
                        >
                          <h4 className="text-base font-sans font-black mb-1">{isNepali ? 'पहुँचयुक्त नेपाल अभियान' : 'Bilingual Reading Comfort Preview'}</h4>
                          <p className="text-xs font-medium opacity-90 leading-relaxed font-sans">
                            {isNepali 
                              ? 'यो पाठको स्पष्टता सूचक जाँच गर्नुहोस्। यसले दृष्टिविहीन तथा कम दृष्टि भएका व्यक्तिलाई सहयोग गर्छ।' 
                              : 'Verify how readable this text element appears. High color contrast guarantees readability for visually-impaired visitors.'}
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic score & thresholds */}
                      {(() => {
                        const ratio = Math.round(calculateContrastRatio(contrastText, contrastBg) * 100) / 100;
                        const aaNormalPass = ratio >= 4.5;
                        const aaLargePass = ratio >= 3.0;
                        const aaaNormalPass = ratio >= 7.0;
                        const aaaLargePass = ratio >= 4.5;

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            
                            {/* Visual Score Circle */}
                            <div className="md:col-span-4 bg-slate-900 text-white rounded p-4 text-center">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">Contrast Ratio</span>
                              <span className="text-xl font-black font-mono tracking-tighter text-blue-400">{ratio} : 1</span>
                              <span className="block text-[8px] text-slate-500 font-mono mt-1 uppercase">WCAG Standard</span>
                            </div>

                            {/* Pass checklist table */}
                            <div className="md:col-span-8 grid grid-cols-2 gap-2 text-xs font-semibold">
                              <div className="p-2 border border-slate-100 rounded bg-slate-50 flex items-center justify-between">
                                <span className="text-slate-600">AA Normal Text (4.5)</span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${aaNormalPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                  {aaNormalPass ? 'PASS' : 'FAIL'}
                                </span>
                              </div>
                              <div className="p-2 border border-slate-100 rounded bg-slate-50 flex items-center justify-between">
                                <span className="text-slate-600">AA Large Text (3.0)</span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${aaLargePass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                  {aaLargePass ? 'PASS' : 'FAIL'}
                                </span>
                              </div>
                              <div className="p-2 border border-slate-100 rounded bg-slate-50 flex items-center justify-between">
                                <span className="text-slate-600">AAA Normal Text (7.0)</span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${aaaNormalPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                  {aaaNormalPass ? 'PASS' : 'FAIL'}
                                </span>
                              </div>
                              <div className="p-2 border border-slate-100 rounded bg-slate-50 flex items-center justify-between">
                                <span className="text-slate-600">AAA Large Text (4.5)</span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${aaaLargePass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                  {aaaLargePass ? 'PASS' : 'FAIL'}
                                </span>
                              </div>
                            </div>

                          </div>
                        );
                      })()}

                    </div>
                  </>
                )}

                {/* TAB 3: CIVIC BARRIER REPORTER */}
                {toolkitActiveTab === 'barrier' && (
                  <>
                    {/* Reporter Interactive submission box */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!barrierForm.reporterName || !barrierForm.description) return;
                        const newBar = {
                          id: 'bar-' + Math.floor(Math.random() * 1000000),
                          reporter: barrierForm.reporterName,
                          category: barrierForm.category,
                          location: barrierForm.location,
                          description: barrierForm.description,
                          createdAt: new Date().toISOString(),
                          isVerified: false
                        };
                        setCustomBarriers(prev => [newBar, ...prev]);
                        onSimulateNotification(
                          `Crowdsourced barrier reported at ${barrierForm.location} by ${barrierForm.reporterName}.`,
                          `${barrierForm.reporterName} द्वारा ${barrierForm.location} मा नयाँ अवरोधको रिपोर्ट पेस!`
                        );
                        setIsBarrierSubmitted(true);
                        setBarrierForm({
                          reporterName: '',
                          category: 'Sidewalk Obstruction',
                          location: 'Lazimpat Lane',
                          description: ''
                        });
                        setTimeout(() => setIsBarrierSubmitted(false), 4000);
                      }}
                      className="lg:col-span-5 bg-slate-50 p-5 rounded-md border border-[#BAD6FC]/50 space-y-4"
                    >
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-[#0036B3] block">Report Obstruction</span>
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">{isNepali ? 'तपाईंको नाम' : 'Citizen Reporter Name *'}</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Supriya Devkota"
                          value={barrierForm.reporterName}
                          onChange={(e) => setBarrierForm({ ...barrierForm, reporterName: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-[#B1C9EA] rounded"
                        />
                      </div>

                      {/* Location picker choice dropdown */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">{isNepali ? 'स्थान छनौट गर्नुहोस्' : 'Hazard Location *'}</label>
                        <select 
                          value={barrierForm.location}
                          onChange={(e) => setBarrierForm({ ...barrierForm, location: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-[#B1C9EA] rounded focus:bg-white"
                        >
                          <option value="Lazimpat Lane">Lazimpat Lane (Shangri-La Avenue)</option>
                          <option value="Baluwatar Circle">Baluwatar Circle (Prime Minister Residence Road)</option>
                          <option value="Koteshwor Junction">Koteshwor Junction (Zebra Crossing Barrier)</option>
                          <option value="New Baneshwor">New Baneshwor Crossing (Tactile Sidewalk Blockage)</option>
                          <option value="Chabahil Ringroad">Chabahil Ringroad (Extreme curb incline)</option>
                        </select>
                      </div>

                      {/* Category Type drop down choice */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">{isNepali ? 'अवरोध विधा' : 'Barrier Category *'}</label>
                        <select 
                          value={barrierForm.category}
                          onChange={(e) => setBarrierForm({ ...barrierForm, category: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-[#B1C9EA] rounded focus:bg-white"
                        >
                          <option value="Sidewalk Obstruction">Sidewalk Parking / Physical Blockage</option>
                          <option value="Steep Ramp Curb">Dangerous curb / steep wheelchair incline</option>
                          <option value="Lack of Braille System">Missing tactile pave / Braille guidelines</option>
                          <option value="Broken Audio Cue">Outdated traffic lights without auditory support</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">{isNepali ? 'विवरण र विवरण' : 'Description of Obstruction *'}</label>
                        <textarea 
                          required
                          rows={3}
                          placeholder={isNepali ? 'वाधा वा जोखिमको छोटो विवरण पेस गर्नुहोस्।' : 'Describe physical obstruction parameters, steps, steep curb parameters...'}
                          value={barrierForm.description}
                          onChange={(e) => setBarrierForm({ ...barrierForm, description: e.target.value })}
                          className="w-full text-xs font-semibold p-2.5 bg-white border border-[#B1C9EA] rounded leading-relaxed resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full text-center py-2 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] rounded transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        🚨 <span>{isNepali ? 'सर्जुनिक रिपोर्ट पेस गर्नुहोस्' : 'Deploy Live Civic Report'}</span>
                      </button>

                      {isBarrierSubmitted && (
                        <div className="p-2 text-emerald-800 bg-emerald-50 border border-emerald-200 text-[10px] rounded animate-fade-in font-bold">
                          ✓ Alert deployed to Central Control Room logs instantly!
                        </div>
                      )}
                    </form>

                    {/* Active live stream panel list of reports */}
                    <div className="lg:col-span-7 space-y-4 self-stretch overflow-y-auto max-h-[360px] pr-2 no-scrollbar">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-slate-500 block">
                        Live Community Reports Ledger ({customBarriers.length})
                      </span>

                      <div className="space-y-3">
                        {customBarriers.map(bar => (
                          <div key={bar.id} className="bg-slate-50 p-4 border border-[#B1C9EA]/50 rounded text-xs hover:border-[#0036B3] transition-colors">
                            <div className="flex justify-between items-start mb-2 select-none">
                              <div>
                                <span className="bg-red-50 text-red-700 font-bold border border-red-200 text-[8.5px] tracking-wide uppercase px-1.5 py-0.5 rounded">
                                  {bar.category}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 font-bold ml-2">{new Date(bar.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded ${bar.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                                {bar.isVerified ? 'VERIFIED ACT' : 'PENDING ACTION'}
                              </span>
                            </div>

                            <p className="text-slate-500 font-mono text-[9px] block mb-1">
                              📍 Location: <b className="text-slate-800 font-sans font-bold">{bar.location}</b> • Reporter: <b className="text-slate-800 font-sans font-bold">{bar.reporter}</b>
                            </p>

                            <p className="text-slate-600 leading-normal font-semibold">
                              "{bar.description}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* CALL TO ACTION GET INVOLVED BAR */}
            <div className="bg-[#041E42] text-white py-12 text-center select-none space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#B5D4FF] uppercase font-bold block">
                {isNepali ? 'हामीलाई सहयोग गर्नुहोस्' : 'Collaborative Open Network'}
              </span>
              <h3 className="text-lg md:text-2xl font-extrabold text-white max-w-xl mx-auto leading-normal">
                {isNepali ? 'तपाईंको कार्यालय वा पसल पहुँचयोग्य बनाउन चाहनुहुन्छ?' : 'Consult with DFAO on Standard Handicap Slope Blueprints'}
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                {isNepali 
                  ? 'हाम्रो प्राविधिक टोलीले र्‍याम्प निर्माण, दृष्टिविहीनहरूको संकेत प्रणाली तथा ढोका अडिट बारे नि:शुल्क प्राविधिक सरसल्लाह प्रदान गर्दछ।' 
                  : 'Submit a consultation ticket with details about your retail or workplace outlet. DFAO ramp engineers will provide safe grading.'}
              </p>
              <button 
                onClick={() => setActiveGuestTab('contact')}
                className="mt-4 px-5 py-2 bg-[#0036B3] hover:bg-white hover:text-[#0036B3] text-white text-xs font-bold rounded-[3px] transition-all"
              >
                {isNepali ? 'परामर्श सेवा अनुरोध गर्नुहोस्' : 'Request Free Engineering Audit'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ADVOCACY PROJECTS GALLERY */}
        {activeGuestTab === 'projects' && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
            <div className="space-y-1.5 border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0036B3]">{isNepali ? 'भौतिक विकास मापन र अडिटिङ' : 'Compliance & Physical Integration Projects'}</span>
              <h2 className="text-2xl font-black text-[#041E42]">{isNepali ? 'पैरवी तथा भौतिक पहुँचता आयोजनाहरू (Advocacy)' : 'Advocacy Operations Ledger'}</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {isNepali 
                  ? 'उपत्यकाका विभिन्न चोक, जेब्राक्रसिङ, सरकारी भवन र विद्यालयहरूलाई अपाङ्गता-मैत्री ढाँचामा परिमार्जन गर्न सञ्चालित अभियानहरू।' 
                  : 'Direct reports evaluating city building guidelines, ramp gradients, tactile installations, and traffic signal timelines.'}
              </p>

              {/* Simple grid search bar */}
              <div className="flex max-w-md items-center gap-2 mt-4 bg-white border border-[#B1C9EA] px-3 py-1.5 rounded-[4px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={projectSearch} 
                  onChange={(e) => setProjectSearch(e.target.value)} 
                  placeholder={isNepali ? 'योजना खोज्नुहोस्...' : 'Search blueprints...'} 
                  className="w-full text-xs font-medium bg-transparent outline-none border-none py-0.5" 
                />
              </div>
            </div>

            {selectedProject ? (
              // Individual detailed project reader
              <div className="bg-white border border-[#B1C9EA] rounded-[4px] p-6 space-y-6">
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="text-xs text-[#0036B3] font-bold hover:underline flex items-center gap-1.5 mb-2"
                >
                  ← {isNepali ? 'सूचीमा फर्कनुहोस्' : 'Back to Ledger Grid'}
                </button>

                <div className="h-[240px] md:h-[400px] overflow-hidden relative rounded-md">
                  <img src={selectedProject.imageEn} alt={selectedProject.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-4 left-4 bg-green-800 text-white text-xs font-extrabold px-3 py-1 rounded">
                    {isNepali ? selectedProject.statusNp : selectedProject.statusEn}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h1 className="text-xl md:text-2xl font-black text-[#041E42] tracking-tight">
                      {isNepali ? selectedProject.titleNp : selectedProject.titleEn}
                    </h1>
                    
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs select-none">
                      <span className="font-extrabold text-[#0036B3] block uppercase text-[10px] mb-1">Key Summary Block</span>
                      <p className="text-slate-600 leading-relaxed italic">{isNepali ? selectedProject.descriptionNp : selectedProject.descriptionEn}</p>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed font-medium space-y-4 whitespace-pre-line border-t border-slate-100 pt-4">
                      {isNepali ? selectedProject.bodyNp : selectedProject.bodyEn}
                    </div>
                  </div>

                  <div className="bg-slate-100 p-5 rounded-[4px] border border-[#B1C9EA] space-y-4 select-none h-fit">
                    <h3 className="text-xs font-sans font-extrabold text-[#041E42] border-b border-slate-200 pb-2 uppercase tracking-wide">Incident Parameters</h3>
                    
                    <div className="space-y-3 font-medium text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Geographical Venue</span>
                        <span className="text-[#041E42] font-semibold">{isNepali ? selectedProject.locationNp : selectedProject.locationEn}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Regulatory Status</span>
                        <span className="text-[#041E42] font-semibold">{isNepali ? selectedProject.statusNp : selectedProject.statusEn}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Date</span>
                        <span className="text-[#041E42] font-mono font-semibold">{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-500 leading-relaxed block mb-2">Want to volunteer or request audit files for this region?</span>
                        <button 
                          onClick={() => { setActiveGuestTab('contact'); setFormData(f => ({ ...f, subject: `Inquiry on: ${selectedProject.titleEn}`, message: `I wish to request data details or volunteer for project: ${selectedProject.titleEn}` })); }}
                          className="w-full py-2 bg-[#0036B3] text-white text-xs font-bold rounded-[3px] text-center"
                        >
                          🎟️ Submit Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjectsList.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedProject(item)}
                    className="bg-white border border-[#B1C9EA] hover:border-[#0036B3] rounded-[4px] overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="h-44 overflow-hidden relative bg-slate-200">
                      <img src={item.imageEn} alt={item.titleEn} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <span className="absolute top-2 px-2 py-0.5 rounded text-[9.5px] font-bold text-white bg-[#0036B3] right-2">
                        {isNepali ? item.statusNp : item.statusEn}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[9.5px] text-[#0036B3] font-mono tracking-wider font-extrabold uppercase block">{isNepali ? item.locationNp : item.locationEn}</span>
                      <h3 className="text-xs md:text-sm font-bold text-[#041E42] line-clamp-1">{isNepali ? item.titleNp : item.titleEn}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{isNepali ? item.descriptionNp : item.descriptionEn}</p>
                      
                      <div className="text-[10px] text-slate-400 font-medium pt-2 select-none border-t border-slate-100 flex justify-between items-center">
                        <span className="font-mono">Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        <span className="text-[#0036B3] group-hover:translate-x-1 transition-transform font-bold inline-flex items-center gap-0.5">Learn More →</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProjectsList.length === 0 && (
                  <div className="col-span-full border border-dashed border-[#B1C9EA] py-16 text-center text-slate-500 font-medium text-xs leading-relaxed">
                    No matching advocacy projects or compliance audits found.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADVOCACY PROGRAMS & ACTIVE SCHEDULER */}
        {activeGuestTab === 'programs' && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0036B3]">{isNepali ? 'तालिम, कार्यशाला र गोष्ठीहरु' : 'Conference & Capacity Building'}</span>
                <h2 className="text-2xl font-black text-[#041E42]">{isNepali ? 'सक्रिय तालिम तथा अभियान कार्यशालाहरू' : 'Upcoming Collective Sessions'}</h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {isNepali 
                    ? 'नागरिक अधिकार प्रवर्धन गर्न, प्रविधि साक्षरता अभिवृद्धि गराई मर्यादित जीवनयापन गराउन निर्धारित सम्मेलनहरूको तालिका।' 
                    : 'Schedule classes on screen reader tools, hotel ramps parameters, of municipal building code briefings.'}
                </p>
                
                {/* Search Event bar */}
                <div className="flex max-w-md items-center gap-2 mt-4 bg-white border border-[#B1C9EA] px-3 py-1.5 rounded-[4px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={programSearch} 
                    onChange={(e) => setProgramSearch(e.target.value)} 
                    placeholder={isNepali ? 'कार्यक्रम खोज्नुहोस्...' : 'Search workshop sessions or cities...'} 
                    className="w-full text-xs font-medium bg-transparent outline-none border-none py-0.5" 
                  />
                </div>
              </div>

              {rsvpData.programId && (
                <button onClick={() => setRsvpData({ name: '', email: '', programId: '' })} className="text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-[3px]">
                  Cancel RSVP Action
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {filteredProgramsList.map((prog) => (
                  <div key={prog.id} className="bg-white border border-[#B1C9EA] hover:border-[#0036B3] rounded-[4px] p-5 flex flex-col md:flex-row gap-5 transition-all shadow-sm">
                    <div className="w-full md:w-44 h-32 bg-slate-200 rounded-[2px] overflow-hidden shrink-0">
                      <img src={prog.imageEn} alt={prog.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="grow space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 select-none">
                          <span className="bg-[#BAD6FC]/40 text-[#0036B3] text-[9.5px] font-bold font-mono px-2 py-0.5 rounded">
                            {isNepali ? prog.venueNp : prog.venueEn}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono tracking-wide">{isNepali ? prog.dateNp : prog.dateEn}</span>
                        </div>
                        <h3 className="text-xs md:text-sm font-bold text-[#041E42] mt-1">{isNepali ? prog.titleNp : prog.titleEn}</h3>
                        <p className="text-xs text-slate-500 leading-normal line-clamp-2 mt-1">{isNepali ? prog.descriptionNp : prog.descriptionEn}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between select-none">
                        <span className="text-[10.5px] text-slate-400 font-medium">{isNepali ? 'कार्यक्रम मिति :' : 'Timeline :'} {isNepali ? prog.dateNp : prog.dateEn}</span>
                        <button
                          onClick={() => setRsvpData(prev => ({ ...prev, programId: prog.id }))}
                          className="px-3.5 h-[30px] bg-[#0036B3] hover:bg-[#002885] text-white text-[10.5px] font-sans font-bold rounded-[3.5px]"
                        >
                          🎟️ {isNepali ? 'सिट आरक्षित गर्नुहोस्' : 'Instant RSVP Seat'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProgramsList.length === 0 && (
                  <div className="border border-dashed border-[#B1C9EA] py-16 text-center text-slate-500 font-medium text-xs leading-relaxed">
                    No active collective sessions or scheduled workshops match your search.
                  </div>
                )}
              </div>

              {/* RSVP SIDEBAR FORM */}
              <div className="bg-white border border-[#B1C9EA] p-5 rounded-[4px] shadow-sm select-none h-fit space-y-4">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded bg-blue-50 text-[#0036B3] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-sans font-bold text-[#041E42] uppercase tracking-wide">Reserved Seats Engine (RSVP)</h3>
                  <p className="text-[11px] text-slate-500">Select any program on the left, then fill in your credentials to instantly reserve your seat. All confirmations register live.</p>
                </div>

                {rsvpData.programId ? (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3 pt-2">
                    <div className="p-2.5 bg-[#EBF5FF] text-[#1E3A8A] text-[10.5px] font-semibold rounded border border-[#BAD6FC]">
                      <span>Target Post : </span>
                      <span className="font-bold underline">
                        {isNepali ? (programs.find(p => p.id === rsvpData.programId)?.titleNp || 'Select') : (programs.find(p => p.id === rsvpData.programId)?.titleEn || 'Select')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wide block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={rsvpData.name} 
                        onChange={(e) => setRsvpData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-xs font-semibold px-2 py-1.5 bg-slate-50 border border-[#B1C9EA] rounded"
                        placeholder="Supriya Devkota"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wide block">Your Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={rsvpData.email} 
                        onChange={(e) => setRsvpData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full text-xs font-semibold px-2 py-1.5 bg-slate-50 border border-[#B1C9EA] rounded"
                        placeholder="supriya@gmail.com"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full h-8 bg-[#0036B3] text-white text-xs font-bold rounded"
                    >
                      Confirm Seat Assignment✓
                    </button>
                    
                    {isRsvpDone && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-bold rounded">
                        🎟️ RSVP Certified! Your seat is secured. Action logged directly inside the Admin Dashboard.
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="p-8 border border-dashed border-slate-200 text-center text-[11px] text-slate-400 rounded leading-relaxed">
                    Click "Instant RSVP Seat" on any scheduled session to initialize the registration drawer.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAMPAIGN MOUNTED GALLERY */}
        {activeGuestTab === 'gallery' && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
            <div className="space-y-1.5 border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0036B3]">{isNepali ? 'स्थलगत तस्बिर र अभिलेखीकरण' : 'Campaign Visual Footprints'}</span>
              <h2 className="text-2xl font-black text-[#041E42]">{isNepali ? 'भौतिक बाधा अडिट र र्‍याम्प निर्माण तस्बिर ग्यालरी' : 'Advocacy Operations - Project Gallery'}</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {isNepali 
                  ? 'अपाङ्गता-मैत्री संरचनाहरूकाे प्रवर्धन गर्न, ह्विलचेयर पहुँचता मापन गर्न र वकालत अभियानको क्रममा कैद गरिएका प्रत्यक्ष तस्बिरहरू।' 
                  : 'Photographs of our volunteers measuring slope angles, municipal audits, and collective inclusive seminars.'}
              </p>
            </div>

            {/* Photo Grid from both Gallery list and Projects list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Combine carousel images and project images to populate a gorgeous layout */}
              {publishedProjects.map((item, index) => (
                <div 
                  key={`p-gal-${item.id}-${index}`}
                  className="bg-white border border-[#B1C9EA] rounded-[4px] p-3 shadow-sm select-none space-y-3.5 group hover:border-[#0036B3] transition-all cursor-pointer"
                  onClick={() => setLightboxImage({ url: item.imageEn, alt: item.imageAltEn })}
                >
                  <div className="h-44 bg-slate-100 rounded-[2.5px] overflow-hidden relative">
                    <img src={item.imageEn} alt={item.titleEn} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 text-[8.5px] tracking-wider text-white uppercase font-bold rounded-sm">
                      {isNepali ? item.statusNp : 'Blueprints Audit'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#041E42] line-clamp-1">{isNepali ? item.titleNp : item.titleEn}</h4>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{isNepali ? item.locationNp : item.locationEn}</span>
                  </div>
                </div>
              ))}

              {carousel.map((slide, sIdx) => (
                <div 
                  key={`slide-gal-${slide.id}-${sIdx}`}
                  className="bg-white border border-[#B1C9EA] rounded-[4px] p-3 shadow-sm select-none space-y-3.5 group hover:border-[#0036B3] transition-all cursor-pointer"
                  onClick={() => setLightboxImage({ url: slide.image, alt: slide.titleEn })}
                >
                  <div className="h-44 bg-slate-100 rounded-[2.5px] overflow-hidden relative">
                    <img src={slide.image} alt="Slider graphic" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-2 left-2 bg-[#0036B3] px-2 py-0.5 text-[8.5px] tracking-wider text-white uppercase font-bold rounded-sm">
                      Interactive Feature Cover
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#041E42] line-clamp-1">{isNepali ? slide.titleNp : slide.titleEn}</h4>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">DFAO Lazimpat Center</span>
                  </div>
                </div>
              ))}
            </div>

            {/* LIGHTBOX MODAL */}
            {lightboxImage && (
              <div 
                className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
                onClick={() => setLightboxImage(null)}
              >
                <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div 
                  className="max-w-4xl relative max-h-[80vh] overflow-hidden rounded border border-white/15"
                  onClick={e => e.stopPropagation()}
                >
                  <img src={lightboxImage.url} alt={lightboxImage.alt} className="w-full h-auto object-contain max-h-[75vh]" referrerPolicy="no-referrer" />
                </div>
                <p className="text-slate-300 text-xs font-semibold mt-4 text-center max-w-xl px-4 leading-relaxed">{lightboxImage.alt}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ABOUT US DESCRIPTION SECTION */}
        {activeGuestTab === 'about' && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
            <div className="space-y-1.5 border-b border-rose-100 pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0036B3]">{isNepali ? 'परिचय तथा संस्थागत पृष्ठभूमि' : 'Institutional Background & Core'}</span>
              <h2 className="text-2xl font-black text-[#041E42]">{isNepali ? 'नेपाल अपाङ्गता-मैत्री वकालत संस्थाको बारेमा' : 'About DFAO Organization'}</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {isNepali 
                  ? 'अपाङ्गता अधिकारकर्मीहरूको अथक प्रयासबाट स्थापित यो संस्था उपत्यकामा सुरक्षित पूर्वाधार र डिजिटल समानताका लागि क्रियाशील छ।' 
                  : 'Get details on DFAO historical records, structural mission statements, and active board representatives.'}
              </p>
            </div>

            {/* History Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 border border-[#B1C9EA] rounded-[4px] shadow-sm space-y-3 hover:border-[#0036B3] transition-colors">
                <span className="text-[10px] font-mono font-bold text-[#0036B3] uppercase">Institutional Origins</span>
                <h3 className="text-sm font-black text-[#041E42]">{isNepali ? 'हाम्रो गौरवशाली इतिहास' : 'Our Historical Mandate'}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {isNepali ? about?.historyNp : about?.historyEn}
                </p>
              </div>

              <div className="bg-white p-6 border border-[#B1C9EA] rounded-[4px] shadow-sm space-y-3 hover:border-[#0036B3] transition-colors">
                <span className="text-[10px] font-mono font-bold text-[#0036B3] uppercase font-sans">Active Mission</span>
                <h3 className="text-sm font-black text-[#041E42]">{isNepali ? 'हाम्रो उद्देश्य' : 'Outlined Actions'}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {isNepali ? about?.missionNp : about?.missionEn}
                </p>
              </div>

              <div className="bg-white p-6 border border-[#B1C9EA] rounded-[4px] shadow-sm space-y-3 hover:border-[#0036B3] transition-colors">
                <span className="text-[10px] font-mono font-bold text-[#0036B3] uppercase">Long-Term Vision</span>
                <h3 className="text-sm font-black text-[#041E42]">{isNepali ? 'हाम्रो प्रतिबद्धता र दूरदृष्टि' : 'Our Future Outlook'}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {isNepali ? about?.visionNp : about?.visionEn}
                </p>
              </div>
            </div>

            {/* TEAM LIST BOARD */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-[#041E42]">{isNepali ? 'वकालत कार्यसमिति तथा क्रियाशिल नेतृत्व' : 'DFAO Board Advisory & Roster'}</h3>
                <p className="text-xs text-slate-500">{isNepali ? 'संस्थाको विकास र भौतिक परामर्श क्षेत्रमा नेतृत्व गर्ने मुख्य पदाधिकारीहरू।' : 'DFAO executive officials directing ramp planning and Screen-Reader course modules.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {about?.team.map((member) => (
                  <div key={member.id} className="bg-white border border-[#B1C9EA] rounded-[4px] p-5 shadow-sm text-center space-y-3 hover:border-[#0036B3] transition-colors group">
                    <div className="w-20 h-20 rounded-full border border-[#B1C9EA] overflow-hidden mx-auto bg-slate-50">
                      <img src={member.image} alt={member.nameEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-[#041E42] transition-colors group-hover:text-[#0036B3]">
                        {isNepali ? member.nameNp : member.nameEn}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">{isNepali ? member.roleNp : member.roleEn}</p>
                    </div>
                    {member.email && (
                      <div className="pt-2 border-t border-slate-100 select-all font-mono text-[10px] text-slate-400 hover:text-[#0036B3] transition-colors">
                        ✉️ {member.email}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT US PORTAL */}
        {activeGuestTab === 'contact' && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
            <div className="space-y-1.5 border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0036B3]">{isNepali ? 'परामर्श र सहयोग डेक्स' : 'Inquire with DFAO Engineers'}</span>
              <h2 className="text-2xl font-black text-[#041E42]">{isNepali ? 'हामीसँग सम्पर्क राख्नुहोस्' : 'Contact Us / Request Audit'}</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {isNepali 
                  ? 'अपाङ्गता-मैत्री र्‍याम्प परामर्श लिन, जुम कम्प्युटर कोचिङ छात्रवृत्ति माग्न वा कुनै सुझाव पेस गर्न यो कार्यालय पत्र भर्नुहोस्।' 
                  : 'Specify details about physical barriers, tactile lines, or screens reader licensing. All submissions synchronize instantly to CMS logs.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Side */}
              <div className="lg:col-span-2 bg-white border border-[#B1C9EA] p-6 rounded-[4px] shadow-sm select-auto">
                <h3 className="text-sm font-extrabold text-[#041E42] mb-4 border-b border-slate-100 pb-2">{isNepali ? 'सम्पर्क परामर्श फारम' : 'Submit Direct Consultation Box'}</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wide font-sans block">{isNepali ? 'तपाईंको नाम' : 'Your Name *'}</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Supriya Devkota"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-[#B1C9EA] rounded focus:bg-white" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wide font-sans block">{isNepali ? 'इमेल ठेगाना' : 'Email Address *'}</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="supriya@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-[#B1C9EA] rounded focus:bg-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wide font-sans block">{isNepali ? 'फोन नम्बर' : 'Phone Number'}</label>
                      <input 
                        type="text" 
                        placeholder="+977-984xxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-[#B1C9EA] rounded focus:bg-white" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wide font-sans block">{isNepali ? 'शीर्षक' : 'Subject of Consultation'}</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Request for Screen Reader Class"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-[#B1C9EA] rounded focus:bg-white" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide font-sans block">{isNepali ? 'विवरण' : 'Enquiry Description *'}</label>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="Explain here standard location offsets, ramp request parameters, classes preparation scholarship..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-xs font-semibold p-3 bg-slate-50 border border-[#B1C9EA] rounded focus:bg-white leading-relaxed resize-none" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-[#0036B3] hover:bg-[#002885] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>{isNepali ? 'विवरण पेस गर्नुहोस्' : 'Submit Consultation Request'}</span>
                  </button>

                  {isSubmitted && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded animate-fade-in">
                      ✓ Message synchronized! Secure registration logged. Switch over to 'Control Room' or the 'Contact Inquiries' tab inside the Admin workspace to resolve this case anytime.
                    </div>
                  )}
                </form>
              </div>

              {/* Info Side */}
              <div className="bg-slate-100 p-6 rounded-[4px] border border-[#B1C9EA] space-y-6 select-none h-fit text-xs font-medium">
                <div className="space-y-1">
                  <h3 className="text-xs font-sans font-bold text-[#041E42] uppercase tracking-wide">National Headquarters</h3>
                  <p className="text-slate-500">Disabled-Friendly Advocacy Organization (DFAO)</p>
                </div>

                <div className="space-y-4 text-slate-600">
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-[#0036B3] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#041E42] block">Physical Hub</span>
                      <span>Lazimpat Lane, Close to Shangri-La Rd, Kathmandu, Nepal</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Phone className="w-4 h-4 text-[#0036B3] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#041E42] block">Administrative Line</span>
                      <span>+977-1-4412345 / 4412346</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Mail className="w-4 h-4 text-[#0036B3] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#041E42] block">Official Mailroom</span>
                      <span>contact@dfao.org.np</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400 block mb-2 uppercase tracking-wide">Simulate Emergency Hot-Line</span>
                  <button 
                    onClick={() => {
                      onSimulateNotification(
                        `Emergency physical obstruction flagged in Kathmandu Zebra crossing!`,
                        `काठमाडौँ जेब्रा क्रसिङमा तत्काल भौतिक बाधा पहिचान सूचना!`
                      );
                    }}
                    className="w-full text-center py-2 border border-red-300 hover:bg-red-50 text-red-700 font-bold rounded text-[10.5px] transition-colors"
                  >
                    🚨 Push Highway/Obstruction Notice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BLOG LIST & ADVANCED SEO READING SYSTEM */}
        {activeGuestTab === 'blog' && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
            <div className="space-y-1.5 border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0036B3]">{isNepali ? 'ज्ञान, लेख संग्रह र सिफारिस खोज डेस्क' : 'Public News desk & Search engines indexing view'}</span>
              <h2 className="text-2xl font-black text-[#041E42]">{isNepali ? 'प्रेस विज्ञप्ति र वकालत ब्लग तथा गुगल SEO विश्लेशक' : 'Blogs Library & Google Assistant SEO Inspector'}</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {isNepali 
                  ? 'अपाङ्गता-अधिकार, प्रविधि साक्षरता तालिम, र र्‍याम्प निर्माणबारे हाम्रा पछिल्ला सुचनाहरू। लेखहरूमा समाहित सर्च इन्जिन अप्टिमाइजेसन (SEO) मेटा विवरणहरू जाँच गर्न लेख खोल्नुहोस।' 
                  : 'Browse articles published on mobility issues. Click any article to read, and evaluate its active Meta headers with the real-time Crawling Engine simulator.'}
              </p>

              {/* Blog Search text area */}
              {!selectedBlog && (
                <div className="flex max-w-md items-center gap-2 mt-4 bg-white border border-[#B1C9EA] px-3 py-1.5 rounded-[4px] shadow-xs">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={blogSearch} 
                    onChange={(e) => setBlogSearch(e.target.value)} 
                    placeholder={isNepali ? 'ब्लग लेख खोज्नुहोस्...' : 'Search articles...'} 
                    className="w-full text-xs font-medium bg-transparent outline-none border-none py-0.5" 
                  />
                </div>
              )}
            </div>

            {selectedBlog ? (
              // ARTICLE READER + REAL-TIME SEO CRawling ANALYZER
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="text-xs text-[#0036B3] font-bold hover:underline flex items-center gap-1.5 mb-2"
                >
                  ← {isNepali ? 'तालिम लेखहरूको सूचीमा फर्कनुहोस्' : 'Back to News Desk Grid'}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Article Text Content */}
                  <div className="lg:col-span-2 bg-white border border-[#B1C9EA] p-6 rounded-[4px] shadow-sm space-y-6">
                    <div className="h-56 md:h-80 overflow-hidden rounded relative bg-slate-200">
                      <img src={selectedBlog.imageEn} alt={selectedBlog.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-4 left-4 bg-[#0036B3] text-white text-xs font-bold px-3 py-1 rounded">
                        {isNepali ? selectedBlog.categoryNp : selectedBlog.categoryEn}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 select-none text-[11px] text-slate-400 font-medium pb-2 border-b border-slate-100">
                        <span>🗓️ {new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>✍️ {isNepali ? 'लेखक :' : 'By'} {isNepali ? selectedBlog.authorNp : selectedBlog.authorEn}</span>
                      </div>

                      <h1 className="text-xl md:text-2xl font-black text-[#041E42] tracking-tight leading-snug">
                        {isNepali ? selectedBlog.titleNp : selectedBlog.titleEn}
                      </h1>

                      <div className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium space-y-4 whitespace-pro-line">
                        {isNepali ? selectedBlog.bodyNp : selectedBlog.bodyEn}
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME SEO INSPECTOR PANEL */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 text-slate-200 p-5 rounded-[4px] border border-slate-800 shadow-md space-y-4 font-sans select-none h-fit">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-[#93C5FD]" />
                          <span className="text-xs font-sans font-bold text-white tracking-wide uppercase">CRAWL SIMULATION</span>
                        </div>
                        <span className="text-[10px] bg-sky-950 text-[#93C5FD] font-mono px-1.5 py-0.5 rounded leading-none">VITE_SEO</span>
                      </div>

                      {(() => {
                        const { checks, score } = getSeoAudit(selectedBlog);
                        return (
                          <div className="space-y-4 text-xs font-medium">
                            <div className="flex items-center justify-between bg-slate-800 p-3 rounded text-xs select-none">
                              <span>Google Rank Score</span>
                              <div className="text-right">
                                <span className={`text-sm font-black tabular-nums ${score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {score}%
                                </span>
                                <span className="block text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">METRIC RATING</span>
                              </div>
                            </div>

                            <div className="space-y-3 pt-2">
                              <span className="text-[10px] font-mono tracking-wider uppercase text-[#93C5FD] block">Active Crawled Elements</span>
                              
                              <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
                                <div className="p-1 px-2 bg-slate-950/80 rounded border border-slate-800/60 leading-tight">
                                  <span className="text-slate-500 block text-[8px] uppercase">index tag</span>
                                  <span className="text-indigo-300">{selectedBlog.seoNoIndex ? 'noindex, nofollow (Hidden)' : 'index, follow (Public to Google-bot)'}</span>
                                </div>

                                <div className="p-1 px-2 bg-slate-950/80 rounded border border-slate-800/60 leading-tight">
                                  <span className="text-slate-500 block text-[8px] uppercase">canonical link</span>
                                  <span className="text-emerald-300 truncate block">{selectedBlog.seoCanonicalUrl || `https://dfao.org.np/blog/${selectedBlog.slug}`}</span>
                                </div>

                                <div className="p-1 px-2 bg-slate-950/80 rounded border border-slate-800/60 leading-tight">
                                  <span className="text-slate-500 block text-[8px] uppercase">SEO Focus Keyword</span>
                                  <span className="text-amber-300 block">{selectedBlog.seoFocusKeyphrase || 'None declared'}</span>
                                </div>

                                <div className="p-1 px-2 bg-slate-950/80 rounded border border-slate-800/60 leading-tight">
                                  <span className="text-slate-500 block text-[8px] uppercase">meta description</span>
                                  <span className="text-slate-100 block text-[9.5px]/1.3 tracking-normal font-sans italic">
                                    "{isNepali ? (selectedBlog.seoDescriptionNp || 'Description not translated.') : (selectedBlog.seoDescriptionEn || selectedBlog.bodyEn.slice(0, 150) + '...')}"
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 border-t border-slate-800 pt-3">
                              <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">SEO Validation checklist</span>
                              
                              <div className="space-y-1.5 text-[11px] leading-tight">
                                {checks.map(check => (
                                  <div key={check.id} className="flex gap-2 items-center">
                                    {check.resolved ? (
                                      <span className="text-emerald-400 shrink-0">✓</span>
                                    ) : (
                                      <span className="text-red-400 shrink-0">✗</span>
                                    )}
                                    <span className="text-slate-300 truncate">{check.labelEn}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-500 leading-normal italic pt-2">
                              Note: Headings and focus density criteria are read natively from index.html header components.
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-white border border-[#B1C9EA] p-4 rounded-[4px] space-y-2.5 shadow-sm text-xs select-none">
                      <h4 className="font-bold text-[#041E42] uppercase tracking-wide text-[10.5px]">Index simulation rules</h4>
                      <p className="text-slate-500 leading-relaxed mt-1">This blog lists embedded JSON SEO fields parsed by scraper indexers. You can edit any article meta tags directly inside the Admin 'Document Editor' workspace to check updated scoring rates!</p>
                      <button 
                        onClick={() => { onSwitchToAdmin(); }}
                        className="w-full text-center py-2 bg-rose-50 hover:bg-rose-100/50 text-rose-800 border border-rose-200 font-bold rounded"
                      >
                        ✏️ Modify Article SEO Meta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // GRID CARD LISTINGS
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogsList.map((blog) => (
                  <div 
                    key={blog.id} 
                    onClick={() => setSelectedBlog(blog)}
                    className="bg-white border border-slate-200 hover:border-[#0036B3] shadow-xs hover:shadow-md cursor-pointer rounded-[4px] overflow-hidden transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 overflow-hidden relative bg-slate-200">
                        <img src={blog.imageEn} alt={blog.titleEn} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {isNepali ? blog.categoryNp : blog.categoryEn}
                        </span>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold font-mono block select-none">
                          🗓️ {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-xs md:text-sm font-bold text-[#041E42] line-clamp-2 leading-snug group-hover:text-[#0036B3] transition-colors">
                          {isNepali ? blog.titleNp : blog.titleEn}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {isNepali ? blog.bodyNp : blog.bodyEn}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-1 select-none">
                      <div className="border-t border-slate-100 pt-2.5 text-[10px] text-[#0036B3] font-bold flex justify-between items-center bg-transparent">
                        <span className="text-slate-400 font-normal">Indexed Google-score : {getSeoAudit(blog).score}%</span>
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">Read More →</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredBlogsList.length === 0 && (
                  <div className="col-span-full border border-dashed border-[#B1C9EA] py-16 text-center text-slate-500 font-medium text-xs leading-relaxed">
                    No articles found matching search criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#041E42] text-white border-t border-slate-800 text-xs font-medium py-8 select-none">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-white" />
            <span className="font-extrabold text-white">DFAO Kathmandu Portal • © 2026. All rights secured.</span>
          </div>
          <p className="text-xs text-slate-400 text-center md:text-right">
            Providing accessible physical paths and digital workspaces for disabled children in Lazimpat, Nepal.
          </p>
        </div>
      </footer>
    </div>
  );
}
