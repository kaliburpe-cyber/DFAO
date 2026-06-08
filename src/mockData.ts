/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Blog, Project, Program, GalleryCollection, ContactSubmission, ActivityLog, CarouselSlide, AboutUsSettings } from './types';

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'b1',
    slug: 'ramp-advocacy-kathmandu-public-buildings',
    status: 'published',
    featured: true,
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-05-15T12:30:00Z',
    titleEn: 'Advocating for Accessibility Ramps in Kathmandu Public Buildings',
    titleNp: 'काठमाडौंका सार्वजनिक भवनहरूमा अपाङ्गता-मैत्री र्‍याम्पहरूको निर्माण र वकालत',
    bodyEn: `Physical accessibility remains one of the largest hurdles for persons with physical disabilities in Kathmandu. The Disabled-Friendly Advocacy Organization (DFAO) recently conducted a comprehensive audit of over 45 major public offices, cultural heritage locations, and municipal hubs in Kathmandu Valley.

Our audit revealed that over 78% of these spaces lack functional wheel-chair ramps or standard tactile ground surface symbols for blind citizens. DFAO is drafting a policy proposal to submit to the Kathmandu Metropolitan City office, demanding immediate enforcement of national building code Accessibility guidelines. We are organizing advocacy circles to elevate these core concerns.`,
    bodyNp: `काठमाडौं उपत्यकाका सार्वजनिक स्थानहरूमा ह्विलचेयर र्‍याम्प र दृष्टिविहीनहरूका लागि स्पर्श मार्ग (tactile signs) को गम्भीर अभाव छ। अपाङ्गता-मैत्री वकालत संस्था (DFAO) ले हालै गरेको एक अनुगमन अनुसार ७८ प्रतिशतभन्दा बढी सरकारी कार्यालयहरू अपाङ्गता भएका व्यक्तिका लागि पहुँचयोग्य छैनन्।

यस विषयमा स्थानीय तह र मन्त्रालयहरूलाई ध्यानकर्षण गराउँदै तत्काल र्‍याम्प तथा दृष्टिविहीन-मैत्री हिँड्ने ठाउँ बनाउन DFAO ले काठमाडौँ महानगरपालिका समक्ष नीतिगत प्रस्ताव पेस गर्ने तयारी थालेको छ। हामी सबै सरोकारवालाहरूलाई यस नागरिक अभियानमा जोडिन अपिल गर्दछौँ।`,
    authorEn: 'Supriya Devkota',
    authorNp: 'सुप्रिया देवकोटा',
    categoryEn: 'Infrastructure & Ramps',
    categoryNp: 'पूर्वाधार र र्‍याम्प',
    imageEn: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80',
    imageNp: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80',
    imageAltEn: 'A high contrast picture showcasing a wheelchair ramp beside stairs',
    imageAltNp: 'सिँढीको छेउमा ह्विलचेयर लान मिल्ने पहुँचयोग्य र्‍याम्प देखाइएको उच्च कन्ट्रास्ट चित्र'
  },
  {
    id: 'b2',
    slug: 'computer-literacy-blind-youth',
    status: 'published',
    featured: false,
    createdAt: '2026-06-02T10:15:00Z',
    updatedAt: '2026-06-02T10:15:00Z',
    titleEn: 'Computer Screen Reader Literacy Training Commences for Vision-Impaired Youth',
    titleNp: 'दृष्टि-विहीन युवाहरूका लागि कम्प्युटर स्क्रिन रिडर साक्षरता तालिम सुरु',
    bodyEn: `Advancing digital accessibility is paramount in modern employment. Kathmandu DFAO has initiated a 12-week course specifically centering screen-reader NVDA and JAWS shortcuts for blind and vision-impaired graduates across Nepal.

Supported by native Nepalese screen reader voice integrations, these students are learning to write documents, manage spreadsheets, and browse web environments smoothly. In our latest tracking cycle, we are aiming to establish 5 specialized inclusive digital career lanes by connecting with local high-tech workspace partners.`,
    bodyNp: `कम्युटर र इन्टरनेट प्रविधिको विकाससँगै यसलाई दृष्टिविहीन मैत्री बनाउनु अपरिहार्य भएको छ। DFAO ले नेपाली भाषा सपोर्ट गर्ने स्क्रिन रिडर सफ्टवेयर (NVDA) प्रयोग गरी दृष्टिविहीन युवाहरूका लागि ३ महिने विशेष कम्प्युटर साक्षरता कक्षा सञ्चालनमा ल्याएको छ।

यस पाठ्यक्रममार्फत विद्यार्थीहरूले डकुमेन्ट ड्राफ्टिङ, स्प्रेडसिट विश्लेषण र वेव ब्राउजिङ गर्न सिक्नेछन्। यसले उनीहरूको रोजगारी र उच्च शिक्षा हासिल गर्ने प्रक्रियामा टेवा पुऱ्याउने विश्वास लिएका छौँ।`,
    authorEn: 'Ramesh Adhikari',
    authorNp: 'रमेश अधिकारी',
    categoryEn: 'Digital Inclusion & Tech',
    categoryNp: 'डिजिटल समावेशीकरण र प्रविधि',
    imageEn: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    imageNp: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    imageAltEn: 'Close up of hands on a keyboard',
    imageAltNp: 'कम्युटर कीबोर्डमा काम गरिरहेका हातहरूको नजिकको दृश्य'
  },
  {
    id: 'b3',
    slug: 'braille-textbook-primary-advocacy',
    status: 'draft',
    featured: false,
    createdAt: '2026-06-06T14:20:00Z',
    updatedAt: '2026-06-06T14:35:00Z',
    titleEn: 'Advocacy Campaign for Braille Textbooks in Primary Schools',
    titleNp: 'प्राथमिक विद्यालयहरूमा ब्रेल पाठ्यपुस्तक उपलब्धताका लागि वकालत अभियान',
    bodyEn: `Access to educational materials is a fundamental kid's right. Thousands of blind children in distant rural Nepalese schools still read without specialized Braille materials. DFAO is hosting a multi-municipal stakeholder event next month to distribute the first set of unified Braille primary reading outlines.

This campaign aims to secure a state-level commitment on providing regular school syllabus prints in tactile, highly accessible formats from Day One.`,
    bodyNp: `सबै बालबालिकाले सहजै रूपमा पढ्न पाउनु मौलिक अधिकार हो। नेपालका ग्रामीण र सरकारी विद्यालयमा अध्ययनरत कयौँ दृष्टिविहीन बालबालिकाहरू अझै पनि आफ्नै भाषाको ब्रेल पाठ्यपुस्तक नहुँदा सास्ती खेपिरहेका छन्। DFAO ले आगामी महिनामा विशेष ब्रेल पाठ्यसामग्री तयार गरी वितरण गर्ने र मन्त्रालयमा राष्ट्रिय स्तरको दबाब कार्यक्रम लैजाने तयारी गरिरहेको छ।`,
    authorEn: 'Maya Tamang',
    authorNp: 'माया तामाङ',
    categoryEn: 'Education Access',
    categoryNp: 'शिक्षामा पहुँच',
    imageEn: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    imageNp: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    imageAltEn: 'Hand trace-reading a Braille notebook',
    imageAltNp: 'औंलाले छामेर ब्रेल पाठ्यपुस्तक पढिरहेको हात'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    slug: 'accessible-crosswalks-mapping',
    status: 'published',
    featured: true,
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-04-10T11:00:00Z',
    titleEn: 'Kathmandu Accessible Crosswalks Mapping Initiative',
    titleNp: 'काठमाडौं पहुँचयोग्य जेब्राक्रसिङ नक्साङ्कन पहल',
    descriptionEn: 'An open-source mapping effort evaluating the width, height offsets, and light timings of crosswalks in Kathmandu.',
    descriptionNp: 'काठमाडौंका जेब्राक्रसिङहरूको कन्ट्रास्ट, ह्विलचेयर मिल्ने र्याम्प कटान, र संकेत बत्तीहरूको समय मापदण्ड नक्साङ्कन अभियान।',
    bodyEn: 'Through this project, trained disabled volunteers with custom GPS mapping devices audited 120 key intersection junctions across Kathmandu and Lalitpur. We detected crucial height barriers (e.g. curb heights exceeding 15cm without slope cuts) which prevent safe road crossing. The dataset is published openly to collaborate directly with road traffic units.',
    bodyNp: 'यस योजना अन्तर्गत अपाङ्गता भएका स्वयंसेवक टोलीले जीपीएस उपकरण प्रयोग गरी काठमाडौं र ललितपुरका प्रमुख १२० वटा सडक चोकहरूमा स्थलगत अध्ययन गरेका थिए। धेरै ठाउँमा ह्विलचेयर गुडाउन पर्याप्त कटान र साँकेतिक फुटपाथको अभाव पाइएको छ, जसले गर्दा ह्विलचेयर गुडान तथा दृष्टिविहीन हिँडाइ जोखिमपूर्ण छ।',
    statusEn: 'Ongoing',
    statusNp: 'सञ्चालित',
    locationEn: 'Kathmandu & Lalitpur Urban Centers',
    locationNp: 'काठमाडौं र ललितपुर सहरी क्षेत्रहरू',
    imageEn: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
    imageNp: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
    imageAltEn: 'Pedestrians crossing a city street safely',
    imageAltNp: 'सहरी सडकको जेब्राक्रसिङमा सुरक्षित रूपमा हिँडिरहेका पैदलयात्रीहरू'
  },
  {
    id: 'p2',
    slug: 'inclusive-digital-resource-hub',
    status: 'published',
    featured: false,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    titleEn: 'DFAO Inclusive Digital Resource Learning Hub',
    titleNp: 'DFAO समावेशी डिजिटल स्रोत अध्ययन केन्द्र',
    descriptionEn: 'Establishing a physical and remote technology center equipped with refreshable Braille displays and audio software.',
    descriptionNp: 'काठमाडौँमा रिफ्रेस गर्न मिल्ने ब्रेल डिस्प्ले र ध्वनि निर्देशिका सुविधायुक्त भौतिक र डिजिटल प्रयोगशाला स्थापना गर्ने पहल।',
    bodyEn: 'The resource hub provides daily access for disabled students, allowing them to search public examination resources, prepare for licensing, and access screen-reader friendly digital copies of Nepalese legislation on human rights.',
    bodyNp: 'यो अध्ययन केन्द्रले अपाङ्गता भएका विद्यार्थीहरूलाई दैनिक रूपमा लोकसेवा, कानुनी किताब, र विविध शैक्षिक सामग्रीहरू आवाज र ब्रेल फन्टसँग सुन्न र पढ्न मिल्ने अत्याधुनिक सुविधा प्रदान गर्दछ।',
    statusEn: 'Completed',
    statusNp: 'सम्पन्न',
    locationEn: 'DFAO Kathmandu HQ, Lazimpat',
    locationNp: 'DFAO केन्द्र कार्यालय, लाजिम्पाट, काठमाडौं',
    imageEn: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    imageNp: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    imageAltEn: 'Students learning behind screens in a clean tech lab classroom',
    imageAltNp: 'सफा प्रविधि केन्द्रमा कम्प्युटर स्क्रिनको अघि अध्ययन गरिरहेका विद्यार्थीहरू'
  }
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'pr1',
    slug: 'accessible-tourism-workshop-kathmandu',
    status: 'published',
    featured: true,
    createdAt: '2026-05-20T11:00:00Z',
    updatedAt: '2026-05-20T11:00:00Z',
    titleEn: 'Accessible Hospitality and Tourism Stakeholder Workshop',
    titleNp: 'अपाङ्गता-मैत्री हस्पिटालिटी तथा समावेशी पर्यटन सरोकारवाला सम्मेलन',
    descriptionEn: 'Formulating Kathmandu Valley guidelines for disabled-accessible hotels, ramp specifications, and deaf-friendly services.',
    descriptionNp: 'काठमाडौं उपत्यकाका होटल तथा पर्यटन स्थलहरूमा र्‍याम्प, अपाङ्गता-मैत्री शौचालय, र सांकेतिक भाषा सहजताका विशेष मापदण्ड तर्जुमा कार्यशाला।',
    bodyEn: 'This program brought together hotel entrepreneurs, municipality representatives, and disability travel bloggers. We drafted the first "Inclusive Tourism Guidebook 2026" focusing on accessible architectural dimensions and customer-care sensibilities suitable for tourist spots in Nepal.',
    bodyNp: 'यस ऐतिहासिक कार्यशालाले होटल व्यवसायी, सहरी योजनाकार, र अपाङ्गता पैरवीकर्ताहरूलाई सँगै ल्याई नेपालकै पहिलो "समावेशी पर्यटन पथप्रदर्शक निर्देशिका २०२६" को मस्यौदा तयार गरेको छ। यसले होटल र पर्यटन केन्द्रमा अपाङ्गता-मैत्री ढाँचाहरू लागु गर्न निर्देश गर्नेछ।',
    dateEn: 'June 18, 2026',
    dateNp: 'असार ४, २०८३',
    venueEn: 'Hotel Himalaya, Lalitpur',
    venueNp: 'होटल हिमालय, ललितपुर',
    imageEn: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    imageNp: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    imageAltEn: 'Group of people seated in general presentation sitting layout in a bright hall',
    imageAltNp: 'तराई, पहाड र हिमाली क्षेत्रका सरोकारवालाहरू एउटा कार्यशालामा भेला भएको दृश्य'
  }
];

export const INITIAL_GALLERY: GalleryCollection[] = [
  {
    id: 'g1',
    slug: 'volunteers-ramp-audit',
    status: 'published',
    featured: true,
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
    titleEn: 'Kathmandu Ramps and Sidewalk Audit Active Campaign',
    titleNp: 'काठमाडौँ सडक र र्‍याम्प अडिट अभियान तस्बिर संग्रह',
    descriptionEn: 'Photos of our courageous disabled volunteers inspecting accessibility parameters at various city bureaus.',
    descriptionNp: 'काठमाडौँका विभिन्न सार्वजनिक भवन र सरकारी चोकमा ह्विलचेयर र भौतिक बाधा अडिट गरिरहेका स्वयंसेवकहरूका केही तस्बिरहरू।',
    images: [
      {
        id: 'gm1',
        url: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80',
        altEn: 'Volunteer explaining wheelchair slope grade using a dynamic level tool',
        altNp: 'स्वयंसेवकले र्‍याम्पको भिरालोपना मापन गर्दै गर्दाको प्रत्यक्ष तस्बिर'
      },
      {
        id: 'gm2',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        altEn: 'Group meeting discussing municipality action parameters',
        altNp: 'महानगरपालिकाका अधिकारीहरूसँग आगामी कदमबारे छलफल बैठक'
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 's1',
    name: 'Pratima Sharma',
    email: 'pratima@gmail.com',
    phone: '9841234567',
    subject: 'Request for Computer Class Scholarship',
    message: 'Hello, I am a blind college graduate from Pokhara. I would love to register for the screen reader computers training at DFAO. Can you provide information on the online zoom schedules?',
    resolved: false,
    createdAt: '2026-06-05T08:15:00Z'
  },
  {
    id: 's2',
    name: 'Devid Bahadur',
    email: 'devid.b@hotmail.com',
    phone: '9851122334',
    subject: 'Ramp Construction Consulting near Lazimpat Store',
    message: 'We are expanding our retail store near Lazimpat and wish to construct a safe handicap wheel-chair ramp. Could you send DFAO ramp engineers for slope grade recommendations?',
    resolved: true,
    notes: 'DFAO team visited the store on June 4th and provided optimal slope blueprints. Case resolved efficiently.',
    createdAt: '2026-06-03T11:45:00Z'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'l1',
    action: 'Published Blog Post',
    actionNp: 'ब्लग लेख प्रकाशित गरियो',
    contentType: 'blog',
    contentNameEn: 'Advocating for Accessibility Ramps in Kathmandu Valley',
    contentNameNp: 'काठमाडौंका सार्वजनिक भवनहरूमा अपाङ्गता-मैत्री र्‍याम्पहरूको निर्माण र वकालत',
    userEn: 'Supriya Devkota',
    userNp: 'सुप्रिया देवकोटा',
    timeAgoEn: '2 hours ago',
    timeAgoNp: '२ घण्टा अगाडि',
    createdAt: '2026-06-07T11:32:00Z'
  },
  {
    id: 'l2',
    action: 'Saved Draft Program',
    actionNp: 'कार्यक्रम मस्यौदा सुरक्षित गरियो',
    contentType: 'program',
    contentNameEn: 'Accessible Hospitality and Tourism Stakeholder Workshop',
    contentNameNp: 'अपाङ्गता-मैत्री हस्पिटालिटी तथा समावेशी पर्यटन सरोकारवाला सम्मेलन',
    userEn: 'Ramesh Adhikari',
    userNp: 'रमेश अधिकारी',
    timeAgoEn: '4 hours ago',
    timeAgoNp: '४ घण्टा अगाडि',
    createdAt: '2026-06-07T09:32:00Z'
  },
  {
    id: 'l3',
    action: 'Resolved Submission Case',
    actionNp: 'सम्पर्क जिज्ञासा समाधान गरियो',
    contentType: 'submission',
    contentNameEn: 'Ramp Construction Consulting near Lazimpat Store',
    contentNameNp: 'लाजिम्पाट पसल नजिक र्‍याम्प निर्माण परामर्श',
    userEn: 'Maya Tamang',
    userNp: 'माया तामाङ',
    timeAgoEn: '1 day ago',
    timeAgoNp: '१ दिन अगाडि',
    createdAt: '2026-06-06T13:32:00Z'
  }
];

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Building Barrier-Free Kathmandu Valley',
    titleNp: 'बाधा-मुक्त काठमाडौँ उपत्यकाको निर्माण',
    subtitleEn: 'Empowering physically disabled citizens by auditing public infrastructure and designing wheel-chair access ramps.',
    subtitleNp: 'सार्वजनिक पूर्वाधारको अनुगमन र डिजाइन मार्फत शारीरिक अपाङ्गता भएका नागरिकहरूलाई सक्षम बनाउने।',
    buttonTextEn: 'View Ramp Projects',
    buttonTextNp: 'हाम्रा र्‍याम्प योजनाहरू',
    buttonLink: 'projects',
    order: 1
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Advancing Digital Inclusion & Tech Literacy',
    titleNp: 'डिजिटल समावेशीकरण र प्रविधि साक्षरता',
    subtitleEn: 'Providing screen-readers and assistive keyboards vocational classes for blind youth.',
    subtitleNp: 'कम्प्युटर स्क्रिन रिडर र उपयोगी सफ्टवेर तालिम मार्फत दृष्टिविहीन युवाहरूको भविष्य उज्ज्वल बनाउँदै।',
    buttonTextEn: 'Inquire for Classes',
    buttonTextNp: 'सोधपुछ गर्नुहोस्',
    buttonLink: 'submissions',
    order: 2
  }
];

export const INITIAL_ABOUT: AboutUsSettings = {
  historyEn: 'Established in 2021 by a dedicated team of disability advocates in lazimpat, DFAO is a leading Nepalese non-profit dedicated to ensuring physical accessibility, digital equity, and educational resources for physical and visually impaired children.',
  historyNp: 'सन् २०२१ मा लाजिम्पाटमा अपाङ्गता अधिकारकर्मीहरूको पहलमा स्थापित DFAO, नेपाली अपाङ्गता अधिकार, ह्विलचेयर पहुँचता, र विशेष ब्रेल पाठ्यपुस्तक उपलब्धताका क्षेत्रमा अग्रणी राष्ट्रिय गैर-सरकारी संस्था हो।',
  missionEn: 'To systematically auditing public buildings, design, construct standard ramps and provide free computer screen reader training across Kathmandu Metropolis.',
  missionNp: 'काठमाडौँ उपत्यकामा सार्वजनिक भवनहरूको भौतिक अडिट गर्ने, सुरक्षित ह्विलचेयर र्‍याम्प बनाउने र दृष्टिविहीन विद्यार्थीहरूलाई व्यावसायिक कम्प्युटर कोचिङ प्रदान गर्ने।',
  visionEn: 'An entirely inclusive, barrier-free Nepal where disabled youth live with dignity, professional skills, and equal workspace access.',
  visionNp: 'एक पूर्ण मर्यादित, बाधा-मुक्त नेपाल जहाँ अपाङ्गता भएका व्यक्तिको पनि आत्म-सम्मान, व्यवसायिक सीप, र सेवाहरूमा समान पहुँच हुनेछ।',
  team: [
    {
      id: 'team-1',
      nameEn: 'Supriya Devkota',
      nameNp: 'सुप्रिया देवकोटा',
      roleEn: 'Infrastructure Lead',
      roleNp: 'भौतिक पूर्वाधार प्रमुख',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'supriya@dfao.org.np',
      order: 1
    },
    {
      id: 'team-2',
      nameEn: 'Ramesh Adhikari',
      nameNp: 'रमेश अधिकारी',
      roleEn: 'Digital Inclusion Head',
      roleNp: 'डिजिटल साक्षरता संयोजक',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      email: 'ramesh@dfao.org.np',
      order: 2
    },
    {
      id: 'team-3',
      nameEn: 'Maya Tamang',
      nameNp: 'माया तामाङ',
      roleEn: 'Community Organizer',
      roleNp: 'सामुदायिक अभियान परिचालन',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      email: 'maya@dfao.org.np',
      order: 3
    }
  ]
};
