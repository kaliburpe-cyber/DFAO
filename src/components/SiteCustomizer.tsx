/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Users,
  Compass,
  FileText,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CarouselSlide, AboutUsSettings, Teammate, Blog, Project, Program, GalleryCollection } from '../types';

interface SiteCustomizerProps {
  carousel: CarouselSlide[];
  about: AboutUsSettings;
  blogs: Blog[];
  projects: Project[];
  programs: Program[];
  gallery: GalleryCollection[];
  isNepali: boolean;
  onUpdateCarousel: (slides: CarouselSlide[]) => void;
  onUpdateAbout: (about: AboutUsSettings) => void;
  onToggleFeatured: (type: 'blog' | 'project' | 'program' | 'gallery', id: string) => void;
}

export default function SiteCustomizer({
  carousel,
  about,
  blogs,
  projects,
  programs,
  gallery,
  isNepali,
  onUpdateCarousel,
  onUpdateAbout,
  onToggleFeatured
}: SiteCustomizerProps) {
  // Tabs within customizer: 'carousel' | 'about' | 'featured'
  const [activeSubTab, setActiveSubTab] = useState<'carousel' | 'about' | 'featured'>('carousel');
  const [carouselState, setCarouselState] = useState<CarouselSlide[]>([...carousel]);
  const [aboutState, setAboutState] = useState<AboutUsSettings>({ ...about });
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger Toast feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // CAROUSEL ACTIONS
  const handleAddSlide = () => {
    const newSlideId = 'slide-' + Math.floor(Math.random() * 10000);
    const newSlide: CarouselSlide = {
      id: newSlideId,
      image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=1200&q=80',
      titleEn: 'Enabling Safe & Dignified Living',
      titleNp: 'सुरक्षित र सबल वातावरण सिर्जना गर्दै',
      subtitleEn: 'We audit cities to design standard accessibility paths and help with tactile lines.',
      subtitleNp: 'हामी सार्वजनिक मार्ग र चोकहरूमा र्‍याम्प तथा दृष्टिविहीनहरूका लागि उपयोगी संकेत प्रणाली बनाउँछौँ।',
      buttonTextEn: 'Read Our Initiatives',
      buttonTextNp: 'हाम्रो पहल पढ्नुहोस्',
      buttonLink: 'projects',
      order: carouselState.length + 1
    };
    setCarouselState([...carouselState, newSlide]);
    showToast(isNepali ? 'नयाँ स्लाइड थपियो! बचत गर्नुहोस्।' : 'New carousel slide added! Click save to persist.');
  };

  const handleUpdateSlideField = (index: number, key: keyof CarouselSlide, val: any) => {
    const next = [...carouselState];
    next[index] = { ...next[index], [key]: val };
    setCarouselState(next);
  };

  const handleDeleteSlide = (id: string) => {
    if (carouselState.length <= 1) {
      alert(isNepali ? 'न्यूनतम एक स्लाइड अनिवार्य हुनुपर्छ!' : 'At least one slide active on homepage carousel is required.');
      return;
    }
    const next = carouselState.filter(s => s.id !== id);
    setCarouselState(next);
    showToast(isNepali ? 'स्लाइड हटाइयो! बचत गर्नुहोस्।' : 'Slide removed. Click save to apply changes.');
  };

  const handleSaveCarousel = () => {
    onUpdateCarousel(carouselState);
    showToast(isNepali ? 'होमपेज क्यारोसेल स्लाइडहरू सुरक्षित भए ✓' : 'Homepage carousel slides saved successfully ✓');
  };

  // ABOUT US ACTIONS
  const handleUpdateAboutBlocks = (field: 'historyEn' | 'historyNp' | 'missionEn' | 'missionNp' | 'visionEn' | 'visionNp', val: string) => {
    setAboutState({
      ...aboutState,
      [field]: val
    });
  };

  const handleSaveAboutDetails = () => {
    onUpdateAbout(aboutState);
    showToast(isNepali ? 'हाम्रो बारेमा र टोली विवरण सुरक्षित भयो ✓' : 'About details and Board roster saved successfully ✓');
  };

  // TEAM LIST ACTIONS
  const handleAddTeamMember = () => {
    const memberId = 'team-' + Math.floor(Math.random() * 10000);
    const newMember: Teammate = {
      id: memberId,
      nameEn: 'Bipul Pokharel',
      nameNp: 'विपुल पोखरेल',
      roleEn: 'Vocational Advisor',
      roleNp: 'व्यावसायिक तालिम सल्लाहकार',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      email: 'bipul@dfao.org.np',
      order: aboutState.team.length + 1
    };
    setAboutState({
      ...aboutState,
      team: [...aboutState.team, newMember]
    });
    showToast(isNepali ? 'नयाँ टोली सदस्य थपियो! कृपया सुरक्षित गर्नुहोस्।' : 'Added new teammate dummy card. Customize details and click save.');
  };

  const handleUpdateTeamMember = (index: number, key: keyof Teammate, val: any) => {
    const nextTeam = [...aboutState.team];
    nextTeam[index] = { ...nextTeam[index], [key]: val };
    setAboutState({
      ...aboutState,
      team: nextTeam
    });
  };

  const handleDeleteTeamMember = (id: string) => {
    const nextTeam = aboutState.team.filter(m => m.id !== id);
    setAboutState({
      ...aboutState,
      team: nextTeam
    });
    showToast(isNepali ? 'टोली सदस्य हटाइयो।' : 'Teammate card removed from listed roster.');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Navigation and Info bar */}
      <div className="bg-surface border border-border-default rounded-[4px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#1847A8] uppercase font-bold select-none block">
              Global Platform CMS Customizer
            </span>
            <h1 className="text-xl font-sans font-extrabold text-text-primary tracking-tight flex items-center gap-1.5 font-sans">
              <Sliders className="w-5 h-5 text-accent-link shrink-0" />
              {isNepali ? 'गृहपृष्ठ र सामान्य पृष्ठ सजावट प्रबन्धक' : 'Homepage & Primary Pages Customizer'}
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isNepali 
                ? 'यहाँबाट मुख्य वेबपोर्टलमा देखिने स्लाइडरहरू, "हाम्रो बारेमा" ब्यानरहरू, कार्यसमिति र विशेष सिफारिश सामाग्री सम्पादन गर्नुहोस्।'
                : 'Directly modify the homepage hero slider, institutional backgrounds, organizational mission-vision columns, and configure team members.'
              }
            </p>
          </div>

          <div className="flex items-center gap-2 select-none self-start sm:self-center">
            <button
              onClick={() => {
                if (activeSubTab === 'carousel') handleSaveCarousel();
                else handleSaveAboutDetails();
              }}
              className="px-4 h-[36px] bg-accent-link text-white hover:bg-[#153C8D] font-sans font-semibold text-xs rounded-[3px] inline-flex items-center gap-1.5 focus:outline-none transition-all shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              {isNepali ? 'सम्पूर्ण परिवर्तनहरू सुरक्षित गर्नुहोस्' : 'Publish Modifications'}
            </button>
          </div>
        </div>

        {/* Dynamic Inner Sub-Tabs Switchers */}
        <div className="flex border-b border-border-default mt-6 bg-canvas/30 rounded-sm p-0.5">
          <button
            onClick={() => setActiveSubTab('carousel')}
            className={`flex-1 py-2 text-center text-xs font-sans font-medium transition-all rounded-[3px] select-none ${
              activeSubTab === 'carousel'
                ? 'bg-surface text-accent-link font-bold border border-border-default shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {isNepali ? '१. मुख्य स्लाइड शो (क्यारोसेल)' : '1. Homepage Slider (Carousel)'}
          </button>
          <button
            onClick={() => setActiveSubTab('about')}
            className={`flex-1 py-2 text-center text-xs font-sans font-medium transition-all rounded-[3px] select-none ${
              activeSubTab === 'about'
                ? 'bg-surface text-accent-link font-bold border border-border-default shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {isNepali ? '२. विवरण र टोली (About Us)' : '2. Background & Team (About Us)'}
          </button>
          <button
            onClick={() => setActiveSubTab('featured')}
            className={`flex-1 py-2 text-center text-xs font-sans font-medium transition-all rounded-[3px] select-none ${
              activeSubTab === 'featured'
                ? 'bg-surface text-accent-link font-bold border border-border-default shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {isNepali ? '३. विशेष सिफारिश सामग्री (Featured)' : '3. Recommendation Panel (Featured)'}
          </button>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1B] text-white border border-[#3E3E3A] px-4 py-3 rounded-[3px] shadow-lg flex items-center gap-2 select-none animate-slide-in font-sans">
          <CheckCircle className="w-4 h-4 text-[#A1DCB9]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 2. SUBTAB CONTENT PANELS */}
      
      {/* 2.1 SLIDES LIST AND FORMS */}
      {activeSubTab === 'carousel' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-sans font-bold text-text-primary lowercase first-letter:uppercase">
                {isNepali ? 'मुख्य पोर्टल ब्यानर स्लाइडहरू' : 'Front page sliders list'}
              </h3>
              <p className="text-[11px] text-text-secondary">
                {isNepali ? 'विद्यमान ब्यानरहरू संपादन गर्नुहोस् वा नयाँ स्लाइड थप्नुहोस्।' : 'Add or update interactive slides representing latest programs with visual cover photos.'}
              </p>
            </div>
            <button
              onClick={handleAddSlide}
              className="px-3 h-8 border border-[#1847A8] hover:bg-[#1847A8]/5 text-[#1847A8] text-xs font-sans font-bold rounded-[3px] flex items-center gap-1 transition-colors select-none"
            >
              <Plus className="w-3.5 h-3.5" />
              {isNepali ? 'नयाँ स्लाइड थप्नुहोस्' : 'Create Carousel Slide'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {carouselState.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-surface border border-border-default hover:border-border-strong rounded-[4px] p-5 space-y-4 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-center justify-between border-b border-border-default/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-canvas border border-border-default w-6 h-6 flex items-center justify-center rounded-[3px] font-mono text-[10px] text-text-secondary select-none font-bold">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-sans font-bold text-text-primary capitalize">
                      {isNepali ? `स्लाइड : ${slide.id}` : `Slide Entry Card: ${slide.id}`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-1 hover:bg-red-50 text-text-muted hover:text-red-700 rounded-[3px] transition-colors"
                    title="Remove Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cover Preview Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div className="h-16 bg-canvas border border-border-default rounded-[2px] flex items-center justify-center overflow-hidden">
                    <img
                      src={slide.image}
                      alt="Slider thumb background"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block">Image Asset Link (HTTPS)</label>
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => handleUpdateSlideField(index, 'image', e.target.value)}
                      className="w-full h-7 px-2 text-xs font-mono bg-canvas border border-border-default rounded-[2px]"
                      placeholder="https://images.unsplash.com/your-image"
                    />
                  </div>
                </div>

                {/* Bilingual Titles inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-[11px] font-medium text-text-secondary block">Slide Title (English)</label>
                    <input
                      type="text"
                      value={slide.titleEn}
                      onChange={(e) => handleUpdateSlideField(index, 'titleEn', e.target.value)}
                      className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px] font-medium"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-[11px] font-medium text-text-secondary block font-devanagari">मुख्य शीर्षक (नेपाली भाषा)</label>
                    <input
                      type="text"
                      value={slide.titleNp}
                      onChange={(e) => handleUpdateSlideField(index, 'titleNp', e.target.value)}
                      className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px] font-devanagari"
                    />
                  </div>
                </div>

                {/* Bilingual Subtitle texts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-[11px] font-medium text-text-secondary block">Slide Subtitle (English)</label>
                    <textarea
                      value={slide.subtitleEn}
                      onChange={(e) => handleUpdateSlideField(index, 'subtitleEn', e.target.value)}
                      className="w-full h-12 p-2 bg-canvas border border-border-default rounded-[2px] resize-none text-[11px] leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-[11px] font-medium text-text-secondary block font-devanagari font-medium">उप-शीर्षक (नेपाली व्याख्या)</label>
                    <textarea
                      value={slide.subtitleNp}
                      onChange={(e) => handleUpdateSlideField(index, 'subtitleNp', e.target.value)}
                      className="w-full h-12 p-2 bg-canvas border border-border-default rounded-[2px] resize-none text-[11px] font-devanagari leading-normal"
                    />
                  </div>
                </div>

                {/* Action CTA Button Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-border-default/45 pt-3 select-none">
                  <div className="space-y-1 text-[11px]">
                    <label className="text-text-muted font-sans font-medium block">Button Label (EN)</label>
                    <input
                      type="text"
                      value={slide.buttonTextEn}
                      onChange={(e) => handleUpdateSlideField(index, 'buttonTextEn', e.target.value)}
                      className="w-full h-7 px-2 bg-canvas border border-border-default rounded-[2pt]"
                    />
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <label className="text-text-muted font-sans font-medium block font-devanagari">बटन लेबल (नेपाली)</label>
                    <input
                      type="text"
                      value={slide.buttonTextNp}
                      onChange={(e) => handleUpdateSlideField(index, 'buttonTextNp', e.target.value)}
                      className="w-full h-7 px-2 bg-canvas border border-border-default rounded-[2pt] font-devanagari"
                    />
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <label className="text-text-muted font-sans font-medium block">Anchor Target Tab</label>
                    <select
                      value={slide.buttonLink}
                      onChange={(e) => handleUpdateSlideField(index, 'buttonLink', e.target.value)}
                      className="w-full h-7 px-2 bg-canvas border border-border-default rounded-[2pt]"
                    >
                      <option value="blogs">Blogs & News Tab</option>
                      <option value="projects">Advocacy Projects</option>
                      <option value="programs">Conference & Events</option>
                      <option value="gallery">Campaign Gallery</option>
                      <option value="submissions">Citizens Support Tab</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2.2 ABOUT US SUMMARY & BOARD INTAKE */}
      {activeSubTab === 'about' && (
        <div className="space-y-8">
          
          {/* Institutional Descriptions Block */}
          <div className="bg-surface border border-border-default rounded-[4px] p-6 space-y-6">
            <h3 className="text-sm font-sans font-bold text-text-primary flex items-center gap-1.5 border-b border-border-default/60 pb-2">
              <Layers className="w-4 h-4 text-accent-link shrink-0" />
              {isNepali ? 'संस्थागत पृष्ठभूमि, मिशन र दृष्टिकोण' : 'Institutional Background & Statement Outlines'}
            </h3>

            {/* History Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-sans font-bold text-text-secondary block">DFAO Brief History (English)</label>
                <textarea
                  value={aboutState.historyEn}
                  onChange={(e) => handleUpdateAboutBlocks('historyEn', e.target.value)}
                  className="w-full h-24 p-3 bg-canvas border border-border-default rounded-[3px] leading-relaxed"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-sans font-bold text-text-secondary block font-devanagari">संस्थाको पृष्ठभूमि तथा गौरवशाली इतिहास (नेपाली)</label>
                <textarea
                  value={aboutState.historyNp}
                  onChange={(e) => handleUpdateAboutBlocks('historyNp', e.target.value)}
                  className="w-full h-24 p-3 bg-canvas border border-border-default rounded-[3px] font-devanagari leading-relaxed"
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>

            {/* Mission Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-default/30 pt-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-sans font-bold text-text-secondary block">Mission Objectives (English)</label>
                <textarea
                  value={aboutState.missionEn}
                  onChange={(e) => handleUpdateAboutBlocks('missionEn', e.target.value)}
                  className="w-full h-20 p-3 bg-canvas border border-border-default rounded-[3px] leading-relaxed"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-sans font-bold text-text-secondary block font-devanagari">मुख्य लक्ष्य संकल्प तथा अभियानको ध्येय (नेपाली)</label>
                <textarea
                  value={aboutState.missionNp}
                  onChange={(e) => handleUpdateAboutBlocks('missionNp', e.target.value)}
                  className="w-full h-20 p-3 bg-canvas border border-border-default rounded-[3px] font-devanagari leading-relaxed"
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>

            {/* Vision Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-default/30 pt-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-sans font-bold text-text-secondary block">DFAO Long-Term Vision (English)</label>
                <textarea
                  value={aboutState.visionEn}
                  onChange={(e) => handleUpdateAboutBlocks('visionEn', e.target.value)}
                  className="w-full h-20 p-3 bg-canvas border border-border-default rounded-[3px] leading-relaxed"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-sans font-bold text-text-secondary block font-devanagari">भविष्यको दूरदृष्टि (नेपाली भाषा मार्गचित्र)</label>
                <textarea
                  value={aboutState.visionNp}
                  onChange={(e) => handleUpdateAboutBlocks('visionNp', e.target.value)}
                  className="w-full h-20 p-3 bg-canvas border border-border-default rounded-[3px] font-devanagari leading-relaxed"
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>
          </div>

          {/* Board Roster Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-sans font-bold text-text-primary flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-accent-link shrink-0" />
                  {isNepali ? 'सञ्चालक समिति र कर्मचारीहरूको सूची' : 'Organizational Workspace Lead Roster'}
                </h3>
                <p className="text-[11px] text-text-secondary">
                  {isNepali ? 'मुख्य नेतृत्व समिति र कर्मचारी कार्ड थप्नुहोस् वा मिलाउनुहोस्।' : 'Add or delete active executive board teammates displayed on about page.'}
                </p>
              </div>
              <button
                onClick={handleAddTeamMember}
                className="px-3 h-8 border border-[#1847A8] hover:bg-[#1847A8]/5 text-[#1847A8] text-xs font-sans font-bold rounded-[3px] flex items-center gap-1 transition-colors select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                {isNepali ? 'नयाँ नेतृत्व सदस्य थप्नुहोस्' : 'Register Teammate'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutState.team.map((member, idx) => (
                <div
                  key={member.id}
                  className="bg-surface border border-border-default rounded-[4px] p-4 flex flex-col justify-between space-y-4 shadow-2xs relative"
                >
                  <button
                    onClick={() => handleDeleteTeamMember(member.id)}
                    className="absolute top-2.5 right-2.5 p-1 bg-canvas hover:bg-red-50 text-text-muted hover:text-red-700 rounded-[3px] transition-colors"
                    title="Remove Board Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-3">
                    {/* Visual Photo preview and image link input */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border border-border-default overflow-hidden bg-canvas">
                        <img
                          src={member.image}
                          alt="Teammate profile"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[8px] font-mono tracking-wider text-text-muted uppercase block">Avatar Photo URL</label>
                        <input
                          type="text"
                          value={member.image}
                          onChange={(e) => handleUpdateTeamMember(idx, 'image', e.target.value)}
                          className="w-full h-6 px-1.5 text-[9px] font-mono bg-canvas border border-border-default rounded-sm"
                        />
                      </div>
                    </div>

                    {/* Bilingual Names */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-text-muted block">Name (English)</label>
                        <input
                          type="text"
                          value={member.nameEn}
                          onChange={(e) => handleUpdateTeamMember(idx, 'nameEn', e.target.value)}
                          className="w-full h-7 px-1.5 bg-canvas border border-border-default rounded-sm text-text-primary text-[10px] font-medium"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-text-muted block font-devanagari">नाम (नेपाली)</label>
                        <input
                          type="text"
                          value={member.nameNp}
                          onChange={(e) => handleUpdateTeamMember(idx, 'nameNp', e.target.value)}
                          className="w-full h-7 px-1.5 bg-canvas border border-border-default rounded-sm font-devanagari text-[10px]"
                        />
                      </div>
                    </div>

                    {/* Bilingual Roles */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-text-muted block">Role (English)</label>
                        <input
                          type="text"
                          value={member.roleEn}
                          onChange={(e) => handleUpdateTeamMember(idx, 'roleEn', e.target.value)}
                          className="w-full h-7 px-1.5 bg-canvas border border-border-default rounded-sm text-[10px]"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-text-muted block font-devanagari">पद (नेपाली)</label>
                        <input
                          type="text"
                          value={member.roleNp}
                          onChange={(e) => handleUpdateTeamMember(idx, 'roleNp', e.target.value)}
                          className="w-full h-7 px-1.5 bg-canvas border border-border-default rounded-sm font-devanagari text-[10px]"
                        />
                      </div>
                    </div>

                    {/* Contact Email and Display Weights */}
                    <div className="grid grid-cols-3 gap-2 text-xs border-t border-border-default/40 pt-2.5 select-none">
                      <div className="space-y-0.5 col-span-2">
                        <label className="text-[9px] text-text-muted block">Role Email Address</label>
                        <input
                          type="email"
                          value={member.email || ''}
                          onChange={(e) => handleUpdateTeamMember(idx, 'email', e.target.value)}
                          className="w-full h-6 px-1.5 bg-canvas border border-border-default rounded-sm text-[9px] font-mono"
                          placeholder="member@dfao.org.np"
                        />
                      </div>
                      <div className="space-y-0.5 col-span-1">
                        <label className="text-[9px] text-text-muted block">Display Rank</label>
                        <input
                          type="number"
                          value={member.order}
                          onChange={(e) => handleUpdateTeamMember(idx, 'order', parseInt(e.target.value) || 1)}
                          className="w-full h-6 px-1.5 bg-canvas border border-border-default rounded-sm text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2.3 FEATURED RECOMMENDATION ITEMS MANAGER */}
      {activeSubTab === 'featured' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-sans font-bold text-text-primary">
              {isNepali ? 'होमपेजमा सामग्रीहरू सिफारिस प्रबन्धक' : 'Homepage Featured Coverage Registry'}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isNepali 
                ? 'नयाँ कार्यतालिकामा होमपेजमा सिफारिस गरिएका ब्लग, पैरवी कार्यक्रम वा तस्बिर संग्रहहरू यहाँबाट सीधै अन/अफ गर्नुहोस्।'
                : 'Instantly toggle content featured flags. Featured items are automatically showcased in the key dynamic blocks on visitor portal.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Featured Blogs panel */}
            <div className="bg-surface border border-border-default rounded-[4px] p-4 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 border-b border-border-default/50 pb-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-sans font-bold text-text-primary">Featured Blogs & News</span>
                </div>
                <div className="space-y-2 select-none">
                  {blogs.map(blog => (
                    <div
                      key={blog.id}
                      className="p-2 border border-border-default/60 hover:border-border-default rounded-[3px] bg-canvas/45 flex items-center justify-between"
                    >
                      <div className="truncate max-w-[140px] pr-2">
                        <span className="text-[11px] font-medium text-text-primary block truncate">
                          {isNepali ? blog.titleNp : blog.titleEn}
                        </span>
                        <span className="text-[9px] text-text-muted font-mono">{blog.id} • {blog.status}</span>
                      </div>
                      <button
                        onClick={() => onToggleFeatured('blog', blog.id)}
                        className={`px-2 py-0.5 text-[9px] font-semibold tracking-wider font-sans uppercase rounded border transition-colors ${
                          blog.featured
                            ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                            : 'bg-white hover:bg-canvas text-text-secondary border-border-strong'
                        }`}
                      >
                        {blog.featured ? (isNepali ? 'सिफारिश छ' : 'FEATURED') : (isNepali ? 'छुटेको छ' : 'NORMAL')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Projects panel */}
            <div className="bg-surface border border-border-default rounded-[4px] p-4 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 border-b border-border-default/50 pb-2 mb-3">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-sans font-bold text-text-primary">Featured Advocacy Projects</span>
                </div>
                <div className="space-y-2 select-none">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className="p-2 border border-border-default/60 hover:border-border-default rounded-[3px] bg-canvas/45 flex items-center justify-between"
                    >
                      <div className="truncate max-w-[140px] pr-2">
                        <span className="text-[11px] font-medium text-text-primary block truncate">
                          {isNepali ? project.titleNp : project.titleEn}
                        </span>
                        <span className="text-[9px] text-text-muted font-mono">{project.id} • {project.status}</span>
                      </div>
                      <button
                        onClick={() => onToggleFeatured('project', project.id)}
                        className={`px-2 py-0.5 text-[9px] font-semibold tracking-wider font-sans uppercase rounded border transition-colors ${
                          project.featured
                            ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                            : 'bg-white hover:bg-canvas text-text-secondary border-border-strong'
                        }`}
                      >
                        {project.featured ? (isNepali ? 'सिफारिश छ' : 'FEATURED') : (isNepali ? 'छुटेको छ' : 'NORMAL')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Programs panel */}
            <div className="bg-surface border border-border-default rounded-[4px] p-4 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 border-b border-border-default/50 pb-2 mb-3">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  <span className="text-xs font-sans font-bold text-text-primary">Featured Workshops</span>
                </div>
                <div className="space-y-2 select-none">
                  {programs.map(prog => (
                    <div
                      key={prog.id}
                      className="p-2 border border-border-default/60 hover:border-border-default rounded-[3px] bg-canvas/45 flex items-center justify-between"
                    >
                      <div className="truncate max-w-[140px] pr-2">
                        <span className="text-[11px] font-medium text-text-primary block truncate">
                          {isNepali ? prog.titleNp : prog.titleEn}
                        </span>
                        <span className="text-[9px] text-text-muted font-mono">{prog.id} • {prog.status}</span>
                      </div>
                      <button
                        onClick={() => onToggleFeatured('program', prog.id)}
                        className={`px-2 py-0.5 text-[9px] font-semibold tracking-wider font-sans uppercase rounded border transition-colors ${
                          prog.featured
                            ? 'bg-[#EAF5EE] text-[#1A6640] border-[#9FDCBA]'
                            : 'bg-white hover:bg-canvas text-text-secondary border-border-strong'
                        }`}
                      >
                        {prog.featured ? (isNepali ? 'सिफारिश छ' : 'FEATURED') : (isNepali ? 'छुटेको छ' : 'NORMAL')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
