export function EmailDetailView(message, suggestedTemplate) {
  if (!message) return '<section class="panel"><p>Select a message to view details.</p></section>';
  return `
    <section class="panel">
      <h3>Email Detail</h3>
      <p><strong>From:</strong> ${message.senderName} (${message.senderEmail})</p>
      <p><strong>Organization:</strong> ${message.organization || '-'}</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Classification:</strong> ${message.classification}</p>
      <p><strong>Priority:</strong> ${message.priority}</p>
      <p><strong>Status:</strong> ${message.status}</p>
      <p><strong>Body:</strong> ${message.body}</p>
      <p><strong>Internal Notes:</strong> ${message.internalNotes.join(' | ')}</p>
      <div class="reply-box">
        <h4>Suggested Reply Draft</h4>
        <p>${suggestedTemplate?.content || 'No suggested template.'}</p>
      </div>
    </section>
  `;
}
