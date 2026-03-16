export const federationInfo = {
  name: 'Georgian Dynamic Shooting & Functional Fitness Federation',
  shortName: 'GDSFF',
  website: 'gdsff.org',
  email: 'office@gdsff.org',
  phone: '+995 511 560038',
  slogan: 'Precision. Strength. Discipline.'
};

export const socialDrafts = [
  {
    id: 'sp-001',
    title: '2026 Season Membership Enrollment',
    platforms: ['facebook', 'instagram'],
    category: 'membership',
    captionShort: '2026 membership is now open.',
    captionMedium: 'Become part of GDSFF for the 2026 season. Apply online and join national-level training tracks.',
    captionLong: 'GDSFF officially opens membership enrollment for the 2026 season. Athletes, coaches, and regional clubs can submit applications through federation channels. Enrollment includes eligibility for national events, official rankings, and technical workshops.',
    georgianCaption: 'GDSFF-ის 2026 წლის წევრობა ოფიციალურად გაიხსნა.',
    englishCaption: 'GDSFF 2026 membership enrollment is officially open.',
    hashtags: ['#GDSFF', '#Membership', '#PrecisionStrengthDiscipline'],
    mediaAssets: ['membership-banner.jpg'],
    status: 'approved',
    scheduledAt: '2026-03-20T10:00:00Z',
    createdBy: 'Media Officer'
  },
  {
    id: 'sp-002',
    title: 'National Event Safety Reminder',
    platforms: ['facebook'],
    category: 'safety',
    captionShort: 'Safety briefing published for weekend qualifiers.',
    captionMedium: 'All participants must review updated range and functional movement safety guidance before attendance.',
    captionLong: 'For the upcoming weekend qualifiers, the federation requires all athletes and staff to review the updated safety bulletin. The document includes range commands, emergency protocols, and functional movement checks.',
    georgianCaption: 'შეჯიბრების წინ უსაფრთხოების განახლებული წესები გამოქვეყნდა.',
    englishCaption: 'Updated safety guidance is now published.',
    hashtags: ['#GDSFF', '#SafetyFirst'],
    mediaAssets: ['safety-guidelines.pdf'],
    status: 'scheduled',
    scheduledAt: '2026-03-19T07:30:00Z',
    createdBy: 'Operations Lead'
  },
  {
    id: 'sp-003',
    title: 'Leadership Introduction: Competition Director',
    platforms: ['instagram'],
    category: 'leadership',
    captionShort: 'Meet our new competition director.',
    captionMedium: 'GDSFF introduces its competition director responsible for season coordination and athlete standards.',
    captionLong: 'We are proud to introduce the federation’s new competition director. This role leads championship planning, qualification structures, and continuous athlete development standards across all disciplines.',
    georgianCaption: 'გაიცანით ფედერაციის ახალი შეჯიბრების დირექტორი.',
    englishCaption: 'Introducing our new competition director.',
    hashtags: ['#GDSFF', '#Leadership', '#FunctionalFitness'],
    mediaAssets: ['director-portrait.png'],
    status: 'draft',
    scheduledAt: '',
    createdBy: 'Content Manager'
  }
];

export const emails = [
  {
    id: 'em-1001',
    senderName: 'Nino Beridze',
    senderEmail: 'nino.beridze@example.com',
    senderPhone: '+995 599 000001',
    organization: 'Tbilisi Athletic Club',
    subject: 'Membership application process',
    body: 'Hello, I want details about joining GDSFF and membership requirements for athletes.',
    classification: 'membership',
    priority: 'high',
    status: 'new',
    suggestedReplyTemplateId: 'et-membership',
    internalNotes: ['Needs official form link and fee details.'],
    receivedAt: '2026-03-15T08:14:00Z'
  },
  {
    id: 'em-1002',
    senderName: 'Mikheil Partners',
    senderEmail: 'partnership@fitgear.ge',
    senderPhone: '',
    organization: 'FitGear Georgia',
    subject: 'Cooperation proposal for federation events',
    body: 'We want to sponsor your spring event series and discuss partnership terms.',
    classification: 'partnership',
    priority: 'urgent',
    status: 'in progress',
    suggestedReplyTemplateId: 'et-partnership',
    internalNotes: ['Forwarded to president and finance committee.'],
    receivedAt: '2026-03-14T16:30:00Z'
  },
  {
    id: 'em-1003',
    senderName: 'Pressline Georgia',
    senderEmail: 'press@pressline.ge',
    senderPhone: '+995 577 100010',
    organization: 'Pressline',
    subject: 'Interview request with federation leadership',
    body: 'Our newsroom requests an interview regarding youth training plans and upcoming events.',
    classification: 'media',
    priority: 'normal',
    status: 'waiting',
    suggestedReplyTemplateId: 'et-media',
    internalNotes: ['Pending confirmation from leadership calendar.'],
    receivedAt: '2026-03-12T11:02:00Z'
  }
];

export const contacts = [
  {
    id: 'ct-1',
    name: 'Nino Beridze',
    email: 'nino.beridze@example.com',
    phone: '+995 599 000001',
    organization: 'Tbilisi Athletic Club',
    categoryTag: 'membership lead',
    notes: 'Interested in athlete registration and documents.',
    followUpStatus: 'needed',
    lastInteraction: '2026-03-15'
  },
  {
    id: 'ct-2',
    name: 'Mikheil Partners',
    email: 'partnership@fitgear.ge',
    phone: '',
    organization: 'FitGear Georgia',
    categoryTag: 'sponsor',
    notes: 'Potential equipment + event sponsor.',
    followUpStatus: 'scheduled',
    lastInteraction: '2026-03-14'
  },
  {
    id: 'ct-3',
    name: 'Pressline Georgia',
    email: 'press@pressline.ge',
    phone: '+995 577 100010',
    organization: 'Pressline',
    categoryTag: 'media',
    notes: 'Interview request for federation strategy piece.',
    followUpStatus: 'none',
    lastInteraction: '2026-03-12'
  }
];

export const templates = {
  social: [
    { id: 'st-launch', label: 'Official launch post', category: 'announcement', content: 'GDSFF ოფიციალურად იწყებს ახალ სეზონს. Precision. Strength. Discipline.' },
    { id: 'st-membership', label: 'Membership invitation', category: 'membership', content: 'გახდი GDSFF წევრი — რეგისტრაცია ღიაა.' },
    { id: 'st-leadership', label: 'Leadership introduction', category: 'leadership', content: 'გაიცანით GDSFF-ის ხელმძღვანელობის ახალი წევრი.' },
    { id: 'st-documents', label: 'Official documents post', category: 'documents', content: 'ოფიციალური დოკუმენტები ხელმისაწვდომია gdsff.org-ზე.' },
    { id: 'st-event', label: 'Event announcement', category: 'event', content: 'მომავალი ღონისძიება: რეგისტრაცია და დეტალები მალე.' },
    { id: 'st-gallery', label: 'Gallery post', category: 'gallery', content: 'გალერეა: საუკეთესო მომენტები ბოლო შეჯიბრიდან.' },
    { id: 'st-partnership', label: 'Contact / partnership post', category: 'partnership', content: 'თანამშრომლობისთვის დაგვიკავშირდით: office@gdsff.org.' },
    { id: 'st-safety', label: 'Safety/rules post', category: 'safety', content: 'უსაფრთხოება უპირველესია — გაეცანით წესებს ღონისძიებამდე.' }
  ],
  email: [
    { id: 'et-membership', label: 'Membership inquiry reply', category: 'membership', content: 'Thank you for contacting GDSFF. Please find membership requirements and application steps attached.' },
    { id: 'et-partnership', label: 'Partnership reply', category: 'partnership', content: 'Thank you for your partnership proposal. Our team will review and return with a coordination meeting time.' },
    { id: 'et-media', label: 'Media reply', category: 'media', content: 'Thank you for the media request. We will confirm leadership availability shortly.' },
    { id: 'et-documents', label: 'Official documents reply', category: 'legal/documents', content: 'Your request for official documents is received. We will share the verified package via official email.' },
    { id: 'et-thanks', label: 'Thank-you response', category: 'general inquiry', content: 'Thank you for reaching out to GDSFF.' },
    { id: 'et-confirmation', label: 'Request received confirmation', category: 'general inquiry', content: 'We confirm your message has been received and assigned for review.' },
    { id: 'et-general', label: 'General contact response', category: 'general inquiry', content: 'Thank you for contacting GDSFF. Our office will respond within 1-2 business days.' }
  ]
};

export const recentActivity = [
  { id: 'a-1', action: 'Social draft approved', detail: '2026 Season Membership Enrollment', when: '2h ago' },
  { id: 'a-2', action: 'Urgent email flagged', detail: 'Cooperation proposal for federation events', when: '5h ago' },
  { id: 'a-3', action: 'Follow-up task created', detail: 'Press interview availability confirmation', when: '1d ago' }
];
