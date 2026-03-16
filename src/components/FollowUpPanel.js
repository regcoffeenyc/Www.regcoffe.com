export function FollowUpPanel(tasks) {
  return `
    <section class="panel">
      <h3>Follow-up Needed</h3>
      <ul>
        ${tasks.map((t) => `<li>${t.subject} — ${t.reason}</li>`).join('') || '<li>No follow-up tasks right now.</li>'}
      </ul>
    </section>
  `;
}
