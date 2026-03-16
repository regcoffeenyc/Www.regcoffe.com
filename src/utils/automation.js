const keywordRules = [
  { words: ['membership', 'join', 'application', 'register'], classification: 'membership', template: 'et-membership', action: 'Send membership information package' },
  { words: ['sponsor', 'partner', 'cooperation'], classification: 'partnership', template: 'et-partnership', action: 'Escalate to partnerships coordinator' },
  { words: ['media', 'interview', 'press'], classification: 'media', template: 'et-media', action: 'Coordinate spokesperson availability' },
  { words: ['document', 'legal', 'statute'], classification: 'legal/documents', template: 'et-documents', action: 'Verify and share official files' }
];

export function classifyMessage(text) {
  const source = text.toLowerCase();
  const rule = keywordRules.find((r) => r.words.some((w) => source.includes(w)));
  return rule || { classification: 'general inquiry', template: 'et-general', action: 'Review manually' };
}

export function urgencyScore(message) {
  const priorityWeight = { low: 1, normal: 2, high: 3, urgent: 4 };
  const ageDays = Math.floor((Date.now() - new Date(message.receivedAt).getTime()) / (1000 * 60 * 60 * 24));
  return (priorityWeight[message.priority] || 2) + (ageDays >= 2 ? 2 : 0);
}

export function followUpNeeded(message, thresholdDays = 2) {
  const ageDays = Math.floor((Date.now() - new Date(message.receivedAt).getTime()) / (1000 * 60 * 60 * 24));
  const isTerminal = ['replied', 'closed'].includes(message.status);
  return !isTerminal && ageDays >= thresholdDays;
}

export function suggestHashtags(category) {
  const base = ['#GDSFF', '#PrecisionStrengthDiscipline'];
  const map = {
    announcement: ['#FederationUpdate'],
    membership: ['#Membership', '#JoinGDSFF'],
    leadership: ['#Leadership'],
    event: ['#CompetitionDay'],
    gallery: ['#EventGallery'],
    documents: ['#OfficialDocuments'],
    partnership: ['#Partnership'],
    safety: ['#SafetyFirst']
  };
  return [...base, ...(map[category] || ['#GDSFF'])];
}
