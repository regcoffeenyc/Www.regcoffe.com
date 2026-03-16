export function DashboardCards(metrics) {
  return `
    <section>
      <h2>Operations Dashboard</h2>
      <div class="card-grid">
        <article class="card"><h3>Pending Emails</h3><strong>${metrics.pendingEmails}</strong></article>
        <article class="card"><h3>Pending Social Drafts</h3><strong>${metrics.pendingDrafts}</strong></article>
        <article class="card"><h3>Urgent Items</h3><strong>${metrics.urgentItems}</strong></article>
        <article class="card"><h3>Follow-ups Needed</h3><strong>${metrics.followUps}</strong></article>
      </div>
    </section>
  `;
}
