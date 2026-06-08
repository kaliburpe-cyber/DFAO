/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Languages,
  Trash2,
  Archive,
  Image as ImageIcon,
  Grid,
  Calendar,
  Eye
} from 'lucide-react';
import { Blog, Project, Program } from '../types';

interface DocumentEditorProps {
  type: 'blog' | 'project' | 'program';
  itemId?: string; // If undefined, we are creating a new item
  blogs: Blog[];
  projects: Project[];
  programs: Program[];
  isNepali: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
}

// Preset dynamic covers to choose from
const PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80',
    name: 'Wheelchair Ramp Audit',
    altEn: 'A high contrast picture showcasing a wheelchair ramp beside stairs',
    altNp: 'सिँढीको छेउमा ह्विलचेयर लान मिल्ने पहुँचयोग्य र्‍याम्प देखाइएको उच्च कन्ट्रास्ट चित्र'
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    name: 'Screen-Reader Keyboard',
    altEn: 'Close up of hands on a keyboard',
    altNp: 'कम्युटर कीबोर्डमा काम गरिरहेका हातहरूको नजिकको दृश्य'
  },
  {
    url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    name: 'Braille Reading Hands',
    altEn: 'Hand trace-reading a Braille notebook',
    altNp: 'औंलाले छामेर ब्रेल पाठ्यपुस्तक पढिरहेको हात'
  },
  {
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    name: 'Inclusive Conference Hall',
    altEn: 'Group of people seated in general presentation sitting layout in a bright hall',
    altNp: 'विभिन्न सरोकारवालाहरू एउटा कार्यशालामा भेला भएको दृश्य'
  },
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    name: 'Inclusive Learning Lab',
    altEn: 'Students learning behind screens in a clean tech lab classroom',
    altNp: 'सफा प्रविधि केन्द्रमा कम्प्युटर स्क्रिनको अघि अध्ययन गरिरहेका विद्यार्थीहरू'
  }
];

export default function DocumentEditor({
  type,
  itemId,
  blogs,
  projects,
  programs,
  isNepali,
  onSave,
  onCancel,
  onDelete,
  onArchive
}: DocumentEditorProps) {
  // Editing state
  const [formData, setFormData] = useState<any>({
    id: '',
    slug: '',
    status: 'draft',
    featured: false,
    createdAt: '',
    updatedAt: '',
    scheduledAt: '',
    // Blog fields
    titleEn: '',
    titleNp: '',
    bodyEn: '',
    bodyNp: '',
    authorEn: 'Supriya Devkota',
    authorNp: 'सुप्रिया देवकोटा',
    categoryEn: 'Infrastructure & Ramps',
    categoryNp: 'पूर्वाधार र र्‍याम्प',
    imageEn: PRESET_IMAGES[0].url,
    imageNp: PRESET_IMAGES[0].url,
    imageAltEn: PRESET_IMAGES[0].altEn,
    imageAltNp: PRESET_IMAGES[0].altNp,
    // Project fields
    descriptionEn: '',
    descriptionNp: '',
    statusEn: 'Ongoing',
    statusNp: 'सञ्चालित',
    locationEn: 'Kathmandu Valley',
    locationNp: 'काठमाडौं उपत्यका',
    // Program fields
    dateEn: 'June 25, 2026',
    dateNp: 'असार ११, २०८३',
    venueEn: 'DFAO Hall, Lazimpat',
    venueNp: 'DFAO हल, लाजिम्पाट',
    
    // Advanced SEO defaults
    seoTitleEn: '',
    seoTitleNp: '',
    seoDescriptionEn: '',
    seoDescriptionNp: '',
    seoKeywordsEn: '',
    seoKeywordsNp: '',
    seoFocusKeyphrase: '',
    seoCanonicalUrl: '',
    seoNoIndex: false
  });

  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [translationProcessing, setTranslationProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load existing item
  useEffect(() => {
    if (itemId) {
      let existingObj: any = null;
      if (type === 'blog') existingObj = blogs.find(b => b.id === itemId);
      else if (type === 'project') existingObj = projects.find(p => p.id === itemId);
      else if (type === 'program') existingObj = programs.find(pr => pr.id === itemId);

      if (existingObj) {
        setFormData({ ...formData, ...existingObj });
      }
    } else {
      // Setup random ID for new item
      const newId = type.substring(0, 2) + Math.floor(Math.random() * 10000);
      setFormData((prev: any) => ({
        ...prev,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
  }, [itemId, type]);

  // Sync Slug automatically from English title on change (only for unsaved drafts or new)
  const handleTitleChangeEn = (val: string) => {
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);

    setFormData((prev: any) => ({
      ...prev,
      titleEn: val,
      slug: itemId && prev.slug ? prev.slug : slugified
    }));
  };

  // Simulated AI Language Translator
  const handleTranslateAll = () => {
    if (!formData.titleEn && !formData.bodyEn) {
      alert(isNepali ? "अनुवाद गर्न पहिले अंग्रेजीमा नाम वा ब्यहोरा भर्नुहोस्।" : "Fill out English title or body first before requesting translation.");
      return;
    }

    setTranslationProcessing(true);

    // Simulated high precision translation based on advocacy contexts
    setTimeout(() => {
      // Heuristic mapper
      let titleNp = formData.titleNp;
      let bodyNp = formData.bodyNp;
      let descNp = formData.descriptionNp;

      if (!titleNp && formData.titleEn) {
        if (formData.titleEn.includes('Ramp')) titleNp = 'काठमाडौंका भवनहरूमा अपाङ्गता-मैत्री र्‍याम्पहरूको निर्माण र वकालत पहल';
        else if (formData.titleEn.includes('Computer')) titleNp = 'दृष्टि-विहीन युवाहरूका लागि कम्प्युटर साक्षरता तथा स्क्रिन रिडर तालिम सञ्चालन';
        else if (formData.titleEn.includes('Braille')) titleNp = 'प्राथमिक विद्यालयहरूमा ब्रेल पाठ्यपुस्तक उपलब्धताका लागि वकालत अभियान';
        else if (formData.titleEn.includes('Tourism')) titleNp = 'अपाङ्गता-मैत्री हस्पिटालिटी तथा समावेशी पर्यटन सरोकारवाला राष्ट्रिय सम्मेलन';
        else titleNp = formData.titleEn + ' (अनुवाद आवश्यक - मस्यौदा)';
      }

      if (!bodyNp && formData.bodyEn) {
        if (formData.bodyEn.includes('accessibility')) {
          bodyNp = `काठमाडौं उपत्यकाका सार्वजनिक स्थानहरूमा ह्विलचेयर र्‍याम्प र दृष्टिविहीनहरूका लागि स्पर्श मार्गको गम्भीर अभाव छ। DFAO ले हालै गरेको एक विस्तृत अनुगमन अनुसार अधिकांश महत्वपूर्ण सरकारी कार्यालयहरू अपाङ्गता भएका व्यक्तिका लागि पहुँचयोग्य छैनन्।

यस विषयमा तत्काल महानगर र नीति निर्माताहरूलाई निर्देशन जारी गर्नका लागि नीति प्रस्ताव पेस गर्ने कार्य अघि बढाइएको छ।`;
        } else {
          bodyNp = formData.bodyEn + '\n\n[नेपाली अनुवाद सामग्री लोड गरिएको छ]';
        }
      }

      if (!descNp && formData.descriptionEn) {
        if (formData.descriptionEn.includes('mapping')) descNp = 'काठमाडौंका जेब्राक्रसिङहरूको कन्ट्रास्ट, ह्विलचेयर र्याम्प कट्स र संकेत बत्तीहरूको नक्साङ्कन अभियान।';
        else descNp = formData.descriptionEn + ' (नेपाली विवरण)';
      }

      setFormData((prev: any) => ({
        ...prev,
        titleNp: prev.titleNp || titleNp,
        bodyNp: prev.bodyNp || bodyNp,
        descriptionNp: prev.descriptionNp || descNp
      }));

      setTranslationProcessing(false);
    }, 800);
  };

  // Visual status indicators
  const getReviewStatus = () => {
    const hasEn = formData.titleEn && formData.bodyEn;
    const hasNp = formData.titleNp && formData.bodyNp;
    if (hasEn && hasNp) {
      return { ok: true, text: isNepali ? 'द्विभाषी पूर्ण' : 'BILINGUAL COMPLETE ✓', color: 'text-[#1A6640] bg-[#EAF5EE] border-[#9FDCBA]' };
    }
    return { ok: false, text: isNepali ? 'नेपाली अनुवाद बाँकी' : 'NEPALI FILL PREFERRED ⚠️', color: 'text-[#7A4F00] bg-[#FDF3DC] border-[#F0D89A]' };
  };

  const completeness = getReviewStatus();

  // Validate form before save
  const handlePerformSave = (overrideStatus?: string) => {
    const errors: string[] = [];
    if (!formData.titleEn) errors.push(isNepali ? "अंग्रेजी शीर्षक अनिवार्य छ।" : "English Title is required.");
    if (!formData.titleNp) errors.push(isNepali ? "नेपाली शीर्षक अनिवार्य छ।" : "Nepali Title is required.");
    if (!formData.slug) errors.push("Slug is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo(0, 0);
      return;
    }

    setValidationErrors([]);
    setSavingState('saving');

    const nextStatus = overrideStatus || formData.status;

    setTimeout(() => {
      onSave({
        ...formData,
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Context Action Bar (Sticky, Top element of Model A, full width of content) */}
      <div className="sticky top-[52px] z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface border-b border-border-default -mx-6 px-6 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] animate-fade-in">
        {/* Left Side Breadcrumbs & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-canvas text-text-secondary hover:text-text-primary rounded-[3px] focus:outline-none"
            title="Go back to worktable"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="h-4 w-px bg-border-default"></div>

          <div className="flex flex-col">
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-text-muted">
              {type.toUpperCase()} / {itemId ? 'EDIT MODE' : 'CREATION ENGINE'}
            </span>
            <span className="text-xs font-sans font-bold text-text-primary truncate max-w-[200px] leading-tight mt-0.5">
              {formData.titleEn || (isNepali ? 'नयाँ प्रविष्टि' : 'Untitled Draft')}
            </span>
          </div>

          {/* Bilingual Check badge */}
          <span className={`text-[9px] px-2 py-0.5 font-sans font-semibold rounded-[3px] border ${completeness.color}`}>
            {completeness.text}
          </span>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Automated AI translation assistant button */}
          <button
            onClick={handleTranslateAll}
            disabled={translationProcessing}
            className="px-2.5 h-[32px] border border-border-strong hover:bg-canvas text-accent-link font-medium text-xs rounded-[3px] inline-flex items-center gap-1.5 transition-colors focus:outline-none shrink-0"
            title="Simulated translation to fill Nepali counterparts"
          >
            <Languages className="w-3.5 h-3.5" />
            {translationProcessing ? (isNepali ? 'अनुवाद हुँदै...' : 'AI Loading...') : (isNepali ? 'स्वचालित अनुवाद भरौँ' : 'Translate All')}
          </button>

          <span className="text-[11px] font-mono text-text-muted hidden md:inline-block">
            {savingState === 'saving' && (isNepali ? 'मस्यौदा सुरक्षित हुँदै...' : 'Auto-saving...')}
            {savingState === 'saved' && (isNepali ? 'सुरक्षित भयो ✓' : 'Saved ✓')}
            {savingState === 'idle' && (isNepali ? 'मस्यौदा' : 'Local Draft Connected')}
          </span>

          <button
            onClick={() => handlePerformSave('draft')}
            className="px-3 h-[32px] border border-border-strong text-text-secondary hover:bg-canvas text-xs font-sans font-medium rounded-[3px] inline-flex items-center gap-1 focus:outline-none bg-surface shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            {isNepali ? 'मस्यौदा बचत' : 'Save Draft'}
          </button>

          {/* Core Publish Action */}
          <button
            onClick={() => handlePerformSave('published')}
            className="px-3.5 h-[32px] bg-accent-link text-white hover:bg-[#153C8D] text-xs font-sans font-medium rounded-[3px] inline-flex items-center gap-1.5 focus:outline-none transition-colors shrink-0"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isNepali ? 'अध्यावधिक प्रकाशन' : 'Publish / Finish'}
          </button>
        </div>
      </div>

      {/* Error Notifications Panel */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-[var(--semantic-danger-bg,#FEF0F0)] text-red-800 border border-red-200 rounded-[3px] space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            {isNepali ? 'कृपया निम्न त्रुटिहरू समाधान गर्नुहोस्:' : 'Please Resolve input validations:'}
          </div>
          <ul className="list-disc pl-5 text-xs space-y-0.5 font-sans">
            {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* 2. Main Editing Surface Column Splits (65% left open, 35% right configuration) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Open Page Editing Panel (65% ratio) */}
        <div className="lg:col-span-2 space-y-8 pb-10">
          
          {/* Section 1 Rail: Header Labeled bar as connective structure */}
          <div className="h-9 bg-section-rail border-t border-b border-border-default -mx-6 px-6 flex items-center select-none font-sans">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B65]">
              {isNepali ? 'मुख्य अनुवादयोग्य सामाग्री क्षेत्र (English & नेपाली)' : 'BILINGUAL PRIMARY FIELDS'}
            </span>
          </div>

          <div className="space-y-6">
            {/* Field GROUP 1 (Title pair stacked inside shared bordered container) */}
            <div className="border border-border-default bg-surface rounded-[4px] overflow-hidden p-4 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-sans font-medium uppercase text-text-secondary select-none">
                <span>{isNepali ? '१. सामाग्रीको नाम / शीर्षक' : '1. Core Content Title'}</span>
                <span className="font-mono text-text-muted">{formData.id}</span>
              </div>
              
              {/* English Title input */}
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block">
                  Title (English) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => handleTitleChangeEn(e.target.value)}
                  className="w-full h-9 px-3 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong focus:border-accent-link rounded-[3px] outline-none"
                  placeholder="e.g. Kathmandu Accessible Ramp Campaigns..."
                />
              </div>

              {/* NP Center Divider Hairline */}
              <div className="relative flex items-center justify-center my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-default/80"></div>
                </div>
                <span className="relative px-2.5 text-[9px] uppercase font-mono tracking-widest bg-surface text-text-muted">
                  NP • नेपाली अनुवाद
                </span>
              </div>

              {/* Nepali Title input */}
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block font-devanagari">
                  शीर्षक (नेपाली अनुवाद) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titleNp}
                  onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                  className="w-full h-9 px-3 text-sm text-text-primary bg-canvas border border-border-default hover:border-border-strong focus:border-accent-link rounded-[3px] outline-none font-devanagari"
                  placeholder="उदा: काठमाडौंका भवनहरूमा र्‍याम्पको पहुँच..."
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>

            {/* Field GROUP 2 (Slug & Subtitle - condition dependant) */}
            <div className="border border-border-default bg-surface rounded-[4px] p-4 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-sans font-medium uppercase text-text-secondary select-none">
                <span>{isNepali ? '२. विवरण, उपशीर्षक वा यूआरएल पहिचान' : '2. Identification Slug & Descriptor'}</span>
              </div>

              {/* Slug read selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block">
                  Slug Address (Permanent Link)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full h-9 px-3 text-xs font-mono text-text-secondary bg-canvas border border-border-default hover:border-border-strong rounded-[3px] outline-none"
                  placeholder="slug-path-address-here"
                />
                <p className="text-[10px] text-text-muted font-mono leading-none">
                  https://dfao.org.np/{type}/{formData.slug || 'untitled-slug'}
                </p>
              </div>

              {/* Subtitle / Short description if project/program */}
              {type !== 'blog' && (
                <>
                  {/* Divider line */}
                  <div className="border-t border-border-default/50 my-2"></div>

                  {/* English short desc */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-text-secondary font-medium block">
                      Short Summary Description (English)
                    </label>
                    <input
                      type="text"
                      value={formData.descriptionEn || ''}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      className="w-full h-9 px-3 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[3px] outline-none"
                      placeholder="Enter a brief summarized meta paragraph..."
                    />
                  </div>

                  {/* Nepali short desc */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-text-secondary font-medium block font-devanagari">
                      छोटो परिचय / उपशीर्षक (नेपाली अनुवाद)
                    </label>
                    <input
                      type="text"
                      value={formData.descriptionNp || ''}
                      onChange={(e) => setFormData({ ...formData, descriptionNp: e.target.value })}
                      className="w-full h-9 px-3 text-sm text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[3px] outline-none font-devanagari"
                      placeholder="उदा: संस्थाले हालसालै सञ्चालन गरेको सर्वेक्षण ..."
                      style={{ lineHeight: '1.8' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Field GROUP 3 (Main Content body editors stacked - Large textareas) */}
            <div className="border border-border-default bg-surface rounded-[4px] p-4 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-sans font-medium uppercase text-text-secondary select-none">
                <span>{isNepali ? '३. मुख्य विवरण ब्यहोरा' : '3. Content Body (Bilingual)'}</span>
              </div>

              {/* English Body */}
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block">
                  Long Body Content (English markdown)
                </label>
                <textarea
                  value={formData.bodyEn}
                  onChange={(e) => setFormData({ ...formData, bodyEn: e.target.value })}
                  className="w-full h-44 p-3 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[3px] outline-none leading-relaxed"
                  placeholder="Write clear, rich paragraphs in English here..."
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-default/80"></div>
                </div>
                <span className="relative px-2.5 text-[9px] uppercase font-mono tracking-widest bg-surface text-text-muted">
                  NP • मुख्य नेपाली ब्यहोरा
                </span>
              </div>

              {/* Nepali Body */}
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block font-devanagari">
                  मुख्य नेपाली सामाग्री (नेपालीमा ब्यहोरा)
                </label>
                <textarea
                  value={formData.bodyNp}
                  onChange={(e) => setFormData({ ...formData, bodyNp: e.target.value })}
                  className="w-full h-44 p-3 text-sm text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[3px] outline-none font-devanagari leading-relaxed"
                  placeholder="यहाँ कानुनी, प्राविधिक वा शैक्षिक सम्बन्धी नेपाली विवरण लेख्नुहोस्..."
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2 Rail: Interactive Cover picker */}
          <div className="h-9 bg-section-rail border-t border-b border-border-default -mx-6 px-6 flex items-center select-none font-sans">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B65]">
              {isNepali ? 'कभर छवि छनोट प्रबन्ध' : 'IMAGE ATTACHMENT DETAILS'}
            </span>
          </div>

          <div className="border border-border-default bg-surface rounded-[4px] p-4 space-y-6">
            {/* Visual Cover Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1 h-24 bg-canvas border border-border-default rounded-[3px] flex items-center justify-center overflow-hidden">
                {formData.imageEn ? (
                  <img
                    src={formData.imageEn}
                    alt={formData.imageAltEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[10px] text-text-muted font-sans uppercase">No Image Set</span>
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
                <span className="text-xs font-sans font-bold text-text-primary block">
                  {isNepali ? 'कभर छवि लिंक थप्नुहोस्:' : 'Dynamic Cover Attachment'}
                </span>
                <input
                  type="text"
                  value={formData.imageEn}
                  onChange={(e) => setFormData({ ...formData, imageEn: e.target.value, imageNp: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary font-mono bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="Paste custom https cover photo link..."
                />
              </div>
            </div>

            {/* Presets Grid Selector (Pick from beautifully seeded images specifically related to Kathmandu DFAO) */}
            <div className="space-y-2">
              <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
                {isNepali ? 'निम्न संस्थागत पृष्ठभूमि मध्ये एउटा रोज्नुहोस्:' : 'Pick a DFAO Campaign Preset Cover Image:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 select-none">
                {PRESET_IMAGES.map((img) => {
                  const isCurrent = formData.imageEn === img.url;
                  return (
                    <button
                      key={img.name}
                      onClick={() => setFormData({
                        ...formData,
                        imageEn: img.url,
                        imageNp: img.url,
                        imageAltEn: img.altEn,
                        imageAltNp: img.altNp
                      })}
                      className={`h-14 border rounded-[3px] overflow-hidden hover:scale-101 relative transition-all focus:outline-none ${
                        isCurrent ? 'border-accent-link ring-1 ring-accent-link scale-102' : 'border-border-default/60 grayscale-[35%] opacity-80 hover:opacity-100 hover:grayscale-0'
                      }`}
                      title={img.name}
                    >
                      <img
                        src={img.url}
                        alt={img.altEn}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 px-1 truncate text-[8px] text-white font-sans font-medium text-center">
                        {img.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alt translation pairs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-default/50 pt-4">
              <div className="space-y-1">
                <label className="text-[11px] text-text-secondary font-medium block">
                  Image Alt Description (English representation)
                </label>
                <input
                  type="text"
                  value={formData.imageAltEn}
                  onChange={(e) => setFormData({ ...formData, imageAltEn: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="Describe covering photo for screen readers..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-text-secondary font-medium font-devanagari block">
                  छविको दृष्टिविहीन विवरण (नेपाली स्पर्श अनुवाद)
                </label>
                <input
                  type="text"
                  value={formData.imageAltNp}
                  onChange={(e) => setFormData({ ...formData, imageAltNp: e.target.value })}
                  className="w-full h-8 px-2 text-sm text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none font-devanagari"
                  placeholder="स्क्रिन रिडरहरूका लागि छविको व्याख्या गर्नुहोस्..."
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3 Rail: Search Engine Optimization */}
          <div className="h-9 bg-section-rail border-t border-b border-border-default -mx-6 px-6 flex items-center select-none font-sans mt-6">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B65]">
              {isNepali ? 'खोज इन्जिन अप्टिमाइजेसन (SEO)' : 'SEARCH ENGINE OPTIMIZATION (SEO)'}
            </span>
          </div>

          <div className="border border-border-default bg-surface rounded-[4px] p-4 space-y-6">
            <div className="flex items-center justify-between border-b border-border-default/50 pb-3">
              <div>
                <h4 className="text-xs font-sans font-bold text-text-primary">
                  {isNepali ? 'गुगल खोज इन्जिन स्निपेट सिम्युलेटर' : 'Google Search Snippet Simulator'}
                </h4>
                <p className="text-[10px] text-text-secondary">
                  {isNepali ? 'खोज परिणामहरूमा यो सामाग्री कस्तो देखिन्छ भन्ने पूर्वावलोकन' : 'Preview how this content will look in search environment'}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[8px] bg-[#EAF5EE] text-[#1A6640] border border-[#9FDCBA] uppercase font-mono font-bold rounded-sm select-none">
                SEO LIVE PREVIEW
              </span>
            </div>

            {/* Simulated Google Search Result Visualizer */}
            <div className="bg-canvas border border-border-default rounded-[4px] p-4 font-sans select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] text-left">
              <div className="flex items-center gap-1.5 text-xs text-[#202124] mb-1">
                <span className="bg-white border border-border-default rounded-full p-1 inline-flex items-center justify-center shrink-0 w-6 h-6 text-text-primary text-[10px] font-bold">
                  df
                </span>
                <div className="overflow-hidden">
                  <div className="text-[11px] text-[#202124] leading-none font-medium truncate">Kathmandu DFAO</div>
                  <div className="text-[10px] text-[#5f6368] leading-none truncate mt-0.5">https://dfao.org.np &gt; {type} &gt; <span className="text-[#1a0dab] underline">{formData.slug || 'untitled-slug'}</span></div>
                </div>
              </div>
              <h3 className="text-sm text-[#1a0dab] hover:underline font-medium leading-normal line-clamp-1 block cursor-pointer">
                {isNepali 
                  ? (formData.seoTitleNp || formData.titleNp || 'अपाङ्गता अधिकार - बाधा-मुक्त काठमाडौँ')
                  : (formData.seoTitleEn || formData.titleEn || 'Disabled Rights Advocacy - Barrier-Free Kathmandu')
                }
              </h3>
              <p className="text-[11px] text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
                <span className="text-text-muted select-none font-mono text-[9px] mr-1">{new Date(formData.createdAt || Date.now()).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} —</span>
                {isNepali
                  ? (formData.seoDescriptionNp || formData.bodyNp || 'काठमाडौँ उपत्यकामा ह्विलचेयर र्‍याम्प, अपाङ्गता अधिकार पैरवी, र दृष्टिविहीन युवाहरूको लागि नि:शुल्क कम्प्युटर स्क्रिन रिडर पाठ्य सामग्री...')
                  : (formData.seoDescriptionEn || formData.bodyEn || 'Read updates on wheelchair access audits, standard accessibility, vocational courses on NVDA, and digital inclusion scholarship programs in Nepal...')
                }
              </p>
            </div>

            {/* Inputs Grid for SEO parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-default/50 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block">
                  Meta Search Title (English)
                </label>
                <input
                  type="text"
                  value={formData.seoTitleEn || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitleEn: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="Focus keyphrase-friendly title for search engines..."
                />
                <span className="text-[10px] text-text-muted font-sans block">
                  Recommended: <span className={`${(formData.seoTitleEn?.length || 0) > 60 ? 'text-red-600' : 'text-[#1A6640]'}`}>{(formData.seoTitleEn?.length || 0)}/60 characters</span>
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block font-devanagari">
                  मेटा सर्च शीर्षक (नेपाली भाषा)
                </label>
                <input
                  type="text"
                  value={formData.seoTitleNp || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitleNp: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none font-devanagari"
                  placeholder="गुगल सर्च परिणामका लागि नेपाली शीर्षक..."
                />
                <span className="text-[10px] text-text-muted font-sans block">
                  सिफारिस: {(formData.seoTitleNp?.length || 0)}/६० अक्षर
                </span>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-text-secondary font-medium block">
                  Meta Search Description (English)
                </label>
                <textarea
                  value={formData.seoDescriptionEn || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescriptionEn: e.target.value })}
                  className="w-full h-16 p-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="Write an eye-catching meta description that drives organic search clicks..."
                />
                <span className="text-[10px] text-text-muted font-sans block">
                  Recommended: <span className={`${(formData.seoDescriptionEn?.length || 0) > 160 ? 'text-red-600' : 'text-[#1A6640]'}`}>{(formData.seoDescriptionEn?.length || 0)}/160 characters</span>
                </span>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-text-secondary font-medium block font-devanagari">
                  मेटा सर्च विवरण (नेपाली भाषा)
                </label>
                <textarea
                  value={formData.seoDescriptionNp || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescriptionNp: e.target.value })}
                  className="w-full h-16 p-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none font-devanagari"
                  placeholder="गुगल खोज परिणाममा आकर्षित गर्नका लागि नेपाली विवरण लेख्नुहोस्..."
                />
                <span className="text-[10px] text-text-muted font-sans block">
                  सिफारिस: {(formData.seoDescriptionNp?.length || 0)}/१६० अक्षर
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block">
                  SEO Focus Keyphrase
                </label>
                <input
                  type="text"
                  value={formData.seoFocusKeyphrase || ''}
                  onChange={(e) => setFormData({ ...formData, seoFocusKeyphrase: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="e.g., wheelchair ramps kathmandu"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium block">
                  Canonical URL Override
                </label>
                <input
                  type="text"
                  value={formData.seoFocusKeyphrase || ''}
                  onChange={(e) => setFormData({ ...formData, seoFocusKeyphrase: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="e.g., https://dfao.org.np/ramps"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-text-secondary font-medium block">
                  SEO Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.seoKeywordsEn || ''}
                  onChange={(e) => setFormData({ ...formData, seoKeywordsEn: e.target.value, seoKeywordsNp: e.target.value })}
                  className="w-full h-8 px-2 text-xs text-text-primary bg-canvas border border-border-default hover:border-border-strong rounded-[2px] outline-none"
                  placeholder="accessibility rights, ramp construction, lazimpat, nepal, blind advocacy"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center gap-2 pt-2 border-t border-border-default/30 select-none">
                <input
                  type="checkbox"
                  checked={formData.seoNoIndex || false}
                  onChange={(e) => setFormData({ ...formData, seoNoIndex: e.target.checked })}
                  className="rounded-sm border-border-strong text-accent-primary"
                  id="seo_noindex_check"
                />
                <label htmlFor="seo_noindex_check" className="text-xs text-text-secondary font-medium cursor-pointer">
                  {isNepali ? 'खोज इन्जिनहरूलाई यो सामग्री अनुक्रमणिका (No-Index) नगर भन्नुहोस्।' : 'Request search engines not to index (noindex) this item.'}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Static Control Config Sidebar (35% ratio, sticky on scroll) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[120px] select-none">
          
          {/* Header */}
          <div className="border border-border-strong bg-surface rounded-[3px] p-4 space-y-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-text-primary border-b border-border-default pb-2 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-text-muted" />
              {isNepali ? 'प्रशासनिक सेटिङहरू' : 'Document Metadata'}
            </h3>

            {/* Status Indicator */}
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-medium text-text-secondary block">
                {isNepali ? 'वर्तमान अवस्था (Document Status)' : 'Document Status'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  formData.status === 'published' ? 'bg-[#1A6640]' : formData.status === 'in_review' ? 'bg-[#7A4F00]' : 'bg-text-secondary'
                }`}></span>
                <span className="text-xs font-sans font-bold uppercase text-text-primary">
                  {formData.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Category selection */}
            {type === 'blog' && (
              <div className="space-y-1 text-xs">
                <label className="text-[11px] font-sans font-medium text-text-secondary block">
                  Editorial Category
                </label>
                <select
                  value={formData.categoryEn}
                  onChange={(e) => setFormData({
                    ...formData,
                    categoryEn: e.target.value,
                    categoryNp: e.target.value === 'Infrastructure & Ramps' ? 'पूर्वाधार र र्‍याम्प' : e.target.value === 'Digital Inclusion & Tech' ? 'डिजिटल समावेशीकरण र प्रविधि' : 'शिक्षामा पहुँच'
                  })}
                  className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px] outline-none text-text-primary"
                >
                  <option value="Infrastructure & Ramps">Infrastructure & Ramps (पूर्वाधार)</option>
                  <option value="Digital Inclusion & Tech">Digital Inclusion & Tech (डिजिटल)</option>
                  <option value="Education Access">Education Access (शिक्षा)</option>
                </select>
              </div>
            )}

            {/* Project / Program specifics */}
            {type === 'project' && (
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-sans font-medium text-text-secondary block">
                    Advocacy Scope Location
                  </label>
                  <input
                    type="text"
                    value={formData.locationEn}
                    onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                    className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px] text-text-primary"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-sans font-medium text-text-secondary block">
                    Project Phase status
                  </label>
                  <select
                    value={formData.statusEn}
                    onChange={(e) => setFormData({
                      ...formData,
                      statusEn: e.target.value,
                      statusNp: e.target.value === 'Ongoing' ? 'सञ्चालित' : 'सम्पन्न'
                    })}
                    className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px] text-text-primary"
                  >
                    <option value="Ongoing">Ongoing (सञ्चालित)</option>
                    <option value="Completed">Completed (सम्पन्न)</option>
                  </select>
                </div>
              </div>
            )}

            {type === 'program' && (
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-sans font-medium text-[#5C5C58] block">
                    Venue Target (English)
                  </label>
                  <input
                    type="text"
                    value={formData.venueEn}
                    onChange={(e) => setFormData({ ...formData, venueEn: e.target.value })}
                    className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px]"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-sans font-medium text-[#5C5C58] block">
                    Scheduled Date String
                  </label>
                  <input
                    type="text"
                    value={formData.dateEn}
                    onChange={(e) => setFormData({ ...formData, dateEn: e.target.value })}
                    className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px]"
                  />
                </div>
              </div>
            )}

            <div className="border-t border-border-default/50 pt-2 shrink-0"></div>

            {/* Featured Switch */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-sans font-bold text-text-primary block">
                  {isNepali ? 'विशेष सिफारिश सूची' : 'Featured Highlight'}
                </span>
                <span className="text-[10px] text-text-secondary font-sans block mt-0.5">
                  {isNepali ? 'इन्टरनेट होमपेजमा प्रमुख देखाउँछ' : 'Publish as cover recommendation'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-8 h-4 rounded-full border border-border-strong accent-accent-primary focus:ring-0 cursor-pointer text-accent-primary"
              />
            </div>

            {/* Program scheduling dates block */}
            <div className="space-y-1 text-xs pt-1">
              <span className="text-[11px] font-sans font-medium text-[#5C5C58] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                {isNepali ? 'भविष्यका लागि निर्धारित प्रकाशन' : 'Scheduled Publishing (Optional)'}
              </span>
              <input
                type="datetime-local"
                value={formData.scheduledAt || ''}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full h-8 px-2 bg-canvas border border-border-default rounded-[2px]"
              />
            </div>
          </div>

          {/* DANGER ZONE - (Strict Separation block) */}
          <div className="border border-red-200 bg-[var(--semantic-danger-bg,#FEF0F0)] rounded-[3px] p-4 space-y-3 shrink-0">
            <h4 className="text-xs font-sans font-bold uppercase text-red-800 tracking-wider">
              {isNepali ? 'जोखिम क्षेत्र (Control Safeguard)' : 'Control Safety Area'}
            </h4>
            <p className="text-[10px] text-red-900 leading-normal">
              {isNepali 
                ? 'यो सामाग्रीलाई अभिलेखागारमा सुम्पनुहोस् वा डेटाबेसबाट स्थायी रुपमा हटाउनुहोस्।'
                : 'Hard action triggers that permanently archive or hard-remove this metadata reference from the live advocacy database.'
              }
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {onArchive && (
                <button
                  onClick={() => {
                    if (confirm(isNepali ? "के तपाईं यो सामाग्रीलाई अभिलेखाकार गर्न चाहनुहुन्छ?" : "Are you sure you want to archive this entry?")) {
                      onArchive(formData.id);
                    }
                  }}
                  className="w-full h-[32px] hover:bg-white text-[#7A4F00] hover:text-[#5C554F] border border-[#F0D89A] hover:border-border-strong font-medium text-xs rounded-[3px] inline-flex items-center justify-center gap-1 focus:outline-none transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {isNepali ? 'अभिलेखागारमा सार्नुहोस्' : 'Send to Archive Collection'}
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(isNepali ? "के तपाईं स्थायी रूपमा यो सामाग्री हटाउन चाहनुहुन्छ?" : "Are you sure you want to permanently delete this content?")) {
                    onDelete(formData.id);
                  }
                }}
                className="w-full h-[32px] bg-red-800 hover:bg-red-900 border border-transparent text-white font-medium text-xs rounded-[3px] inline-flex items-center justify-center gap-1 focus:outline-none transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
                {isNepali ? 'डेटाबेसबाट मात्र मेटाउनुहोस्' : 'Hard Delete Reference'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
