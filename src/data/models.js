/**
 * Data model reference for future backend/API validation.
 */
export const ModelSchemas = {
  socialPost: {
    id: 'string',
    title: 'string',
    platforms: ['facebook', 'instagram'],
    category: 'announcement|membership|leadership|event|gallery|documents|partnership|safety',
    captionShort: 'string',
    captionMedium: 'string',
    captionLong: 'string',
    georgianCaption: 'string',
    englishCaption: 'string',
    hashtags: ['string'],
    mediaAssets: ['mediaAssetId'],
    status: 'draft|approved|scheduled|published',
    scheduledAt: 'ISODate',
    createdBy: 'string',
    createdAt: 'ISODate',
    updatedAt: 'ISODate'
  },
  mediaAsset: {
    id: 'string',
    type: 'image|video|document',
    url: 'string',
    alt: 'string',
    source: 'upload|external',
    linkedPostId: 'string'
  },
  message: {
    id: 'string',
    senderName: 'string',
    senderEmail: 'string',
    senderPhone: 'string?',
    organization: 'string?',
    subject: 'string',
    body: 'string',
    classification: 'membership|partnership|media|general inquiry|legal/documents',
    priority: 'low|normal|high|urgent',
    status: 'new|in progress|waiting|replied|closed',
    suggestedReplyTemplateId: 'string?',
    internalNotes: ['string'],
    receivedAt: 'ISODate',
    updatedAt: 'ISODate'
  },
  contact: {
    id: 'string',
    name: 'string',
    email: 'string',
    phone: 'string?',
    organization: 'string?',
    categoryTag: 'string',
    notes: 'string',
    followUpStatus: 'none|scheduled|needed|completed',
    lastInteraction: 'ISODate'
  },
  template: {
    id: 'string',
    type: 'social|email',
    label: 'string',
    category: 'string',
    content: 'string'
  },
  activityLog: {
    id: 'string',
    actor: 'string',
    action: 'string',
    entityType: 'socialPost|message|contact|task',
    entityId: 'string',
    timestamp: 'ISODate'
  },
  followUpTask: {
    id: 'string',
    sourceType: 'message|contact|socialPost',
    sourceId: 'string',
    dueAt: 'ISODate',
    status: 'open|done',
    reason: 'string'
  }
};
