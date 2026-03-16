export function ReplyTemplatePicker(templates) {
  return `
    <section class="panel">
      <h3>Reply Template Picker</h3>
      <ul class="template-list">
        ${templates.map((t) => `<li><strong>${t.label}</strong><p>${t.content}</p></li>`).join('')}
      </ul>
    </section>
  `;
}
