import { federationInfo, socialDrafts, emails, contacts, templates, recentActivity } from './data/mockData.js';
import { classifyMessage, followUpNeeded, suggestHashtags, urgencyScore } from './utils/automation.js';
import { AdminLayout } from './components/AdminLayout.js';
import { DashboardCards } from './components/DashboardCards.js';
import { SocialDraftEditor } from './components/SocialDraftEditor.js';
import { SocialCalendar } from './components/SocialCalendar.js';
import { EmailInbox } from './components/EmailInbox.js';
import { EmailDetailView } from './components/EmailDetailView.js';
import { ReplyTemplatePicker } from './components/ReplyTemplatePicker.js';
import { ContactsTable } from './components/ContactsTable.js';
import { FollowUpPanel } from './components/FollowUpPanel.js';
import { SettingsPage } from './components/SettingsPage.js';

const state = {
  activeView: 'dashboard',
  isAuthenticated: false,
  selectedEmailId: null,
  socialFilter: { q: '', status: 'all', platform: 'all' },
  emailFilter: ''
};

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'social', label: 'Social Content' },
  { key: 'email', label: 'Email Inbox' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'templates', label: 'Templates' },
  { key: 'settings', label: 'Settings' }
];

const app = document.getElementById('app');

function renderLogin() {
  app.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <h1>${federationInfo.shortName} Media & Communications Bot</h1>
        <p>${federationInfo.name}</p>
        <p class="muted">Protected admin route placeholder (local auth).</p>
        <form id="login-form" class="login-form">
          <input name="username" placeholder="Admin username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Enter Admin Panel</button>
        </form>
      </div>
    </div>
  `;
}

function filteredDrafts() {
  return socialDrafts.filter((d) => {
    const q = state.socialFilter.q.toLowerCase();
    const byQ = q ? [d.title, d.category, d.captionShort].join(' ').toLowerCase().includes(q) : true;
    const byStatus = state.socialFilter.status === 'all' || d.status === state.socialFilter.status;
    const byPlatform = state.socialFilter.platform === 'all' || d.platforms.includes(state.socialFilter.platform);
    return byQ && byStatus && byPlatform;
  });
}

function filteredEmails() {
  const q = state.emailFilter.toLowerCase();
  return emails
    .map((m) => {
      const ai = classifyMessage(`${m.subject} ${m.body}`);
      return { ...m, aiClassification: ai.classification, aiTemplate: ai.template, aiAction: ai.action, score: urgencyScore(m) };
    })
    .filter((m) => [m.senderName, m.subject, m.classification, m.status].join(' ').toLowerCase().includes(q))
    .sort((a, b) => b.score - a.score);
}

function dashboardView() {
  const pendingEmails = emails.filter((e) => !['replied', 'closed'].includes(e.status)).length;
  const pendingDrafts = socialDrafts.filter((d) => d.status !== 'published').length;
  const urgentItems = emails.filter((e) => e.priority === 'urgent').length;
  const followUps = emails.filter((e) => followUpNeeded(e, 2)).length;
  const nextPosts = socialDrafts.filter((d) => d.scheduledAt).slice(0, 3);

  return `
    ${DashboardCards({ pendingEmails, pendingDrafts, urgentItems, followUps })}
    <section class="panel"><h3>Recent Activity</h3><ul>${recentActivity.map((a) => `<li>${a.action}: ${a.detail} (${a.when})</li>`).join('')}</ul></section>
    <section class="panel"><h3>Next Scheduled Posts</h3><ul>${nextPosts.map((p) => `<li>${p.title} — ${new Date(p.scheduledAt).toLocaleString()}</li>`).join('')}</ul></section>
    ${FollowUpPanel(
      emails.filter((e) => followUpNeeded(e, 2)).map((e) => ({ subject: e.subject, reason: 'No response in configured threshold window' }))
    )}
  `;
}

function socialView() {
  const items = filteredDrafts();
  return `
    <section class="panel inline-controls">
      <input id="social-search" placeholder="Search drafts" value="${state.socialFilter.q}" />
      <select id="social-status"><option value="all">all status</option><option value="draft">draft</option><option value="approved">approved</option><option value="scheduled">scheduled</option><option value="published">published</option></select>
      <select id="social-platform"><option value="all">all platform</option><option value="facebook">facebook</option><option value="instagram">instagram</option></select>
    </section>
    ${SocialDraftEditor()}
    <section class="panel"><h3>Post Preview Cards</h3>
      <div class="preview-grid">${items
        .map(
          (d) => `<article class="card"><h4>${d.title}</h4><p>${d.captionShort}</p><p><strong>KA:</strong> ${d.georgianCaption}</p><p><strong>EN:</strong> ${d.englishCaption}</p><p>${d.hashtags.join(' ')}</p><p class="muted">Media: ${d.mediaAssets.join(', ')}</p></article>`
        )
        .join('')}</div>
    </section>
    ${SocialCalendar(items)}
  `;
}

function emailView() {
  const messages = filteredEmails();
  const selected = messages.find((m) => m.id === state.selectedEmailId) || messages[0];
  const template = templates.email.find((t) => t.id === selected?.suggestedReplyTemplateId || t.id === selected?.aiTemplate);

  return `
    <section class="panel inline-controls"><input id="email-search" placeholder="Search message history" value="${state.emailFilter}" /></section>
    <div class="split-layout">
      ${EmailInbox(messages)}
      ${EmailDetailView(selected, template)}
    </div>
    <section class="panel">
      <h3>Assistant Recommendations</h3>
      <p><strong>Suggested Type:</strong> ${selected?.aiClassification || '-'}</p>
      <p><strong>Recommended Action:</strong> ${selected?.aiAction || '-'}</p>
      <p><strong>Follow-up Needed:</strong> ${selected ? (followUpNeeded(selected, 2) ? 'Yes' : 'No') : '-'}</p>
    </section>
  `;
}

function contactsView() {
  return `${ContactsTable(contacts)}<section class="panel"><h3>Export-Friendly Structure</h3><p>Contacts are kept in flat JSON fields for CSV/DB export and future CRM sync.</p></section>`;
}

function templatesView() {
  return `
    <section class="panel"><h3>Social Templates</h3><ul>${templates.social.map((t) => `<li><strong>${t.label}</strong> (${t.category})<p>${t.content}</p></li>`).join('')}</ul></section>
    ${ReplyTemplatePicker(templates.email)}
  `;
}

function settingsView() {
  return SettingsPage();
}

function renderApp() {
  if (!state.isAuthenticated) {
    renderLogin();
    return;
  }

  const views = {
    dashboard: dashboardView,
    social: socialView,
    email: emailView,
    contacts: contactsView,
    templates: templatesView,
    settings: settingsView
  };

  app.innerHTML = AdminLayout({ navItems, activeView: state.activeView, body: views[state.activeView](), federation: federationInfo });

  const statusEl = document.getElementById('social-status');
  const platformEl = document.getElementById('social-platform');
  if (statusEl) statusEl.value = state.socialFilter.status;
  if (platformEl) platformEl.value = state.socialFilter.platform;
}

function bindEvents() {
  document.addEventListener('submit', (event) => {
    if (event.target.id === 'login-form') {
      event.preventDefault();
      state.isAuthenticated = true;
      renderApp();
    }

    if (event.target.id === 'social-draft-form') {
      event.preventDefault();
      const formData = new FormData(event.target);
      const platforms = formData.getAll('platforms');
      const category = formData.get('category');
      const newDraft = {
        id: `sp-${Math.floor(Math.random() * 100000)}`,
        title: formData.get('title'),
        platforms,
        category,
        captionShort: formData.get('captionShort'),
        captionMedium: formData.get('captionMedium'),
        captionLong: formData.get('captionLong'),
        georgianCaption: formData.get('georgianCaption'),
        englishCaption: formData.get('englishCaption'),
        hashtags: suggestHashtags(category),
        mediaAssets: (formData.get('mediaAssets') || '').split(',').map((x) => x.trim()).filter(Boolean),
        status: formData.get('scheduledAt') ? 'scheduled' : 'draft',
        scheduledAt: formData.get('scheduledAt') ? new Date(formData.get('scheduledAt')).toISOString() : '',
        createdBy: 'Admin User'
      };
      socialDrafts.unshift(newDraft);
      state.activeView = 'social';
      renderApp();
    }
  });

  document.addEventListener('click', (event) => {
    const nav = event.target.dataset.nav;
    if (nav) {
      state.activeView = nav;
      renderApp();
      return;
    }

    const emailId = event.target.closest('[data-open-email]')?.dataset.openEmail;
    if (emailId) {
      state.selectedEmailId = emailId;
      renderApp();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'social-search') state.socialFilter.q = event.target.value;
    if (event.target.id === 'social-status') state.socialFilter.status = event.target.value;
    if (event.target.id === 'social-platform') state.socialFilter.platform = event.target.value;
    if (event.target.id === 'email-search') state.emailFilter = event.target.value;
    if (['social-search', 'social-status', 'social-platform', 'email-search'].includes(event.target.id)) renderApp();
  });
}

bindEvents();
renderApp();
