export function SocialDraftEditor() {
  return `
    <section class="panel">
      <h3>Create Post Draft</h3>
      <form id="social-draft-form" class="form-grid">
        <input name="title" required placeholder="Draft title" />
        <select name="category" required>
          <option value="announcement">announcement</option><option value="membership">membership</option>
          <option value="leadership">leadership</option><option value="event">event</option>
          <option value="gallery">gallery</option><option value="documents">documents</option>
          <option value="partnership">partnership</option><option value="safety">safety</option>
        </select>
        <label><input type="checkbox" name="platforms" value="facebook" checked /> Facebook</label>
        <label><input type="checkbox" name="platforms" value="instagram" /> Instagram</label>
        <input name="captionShort" placeholder="Short caption" required />
        <textarea name="captionMedium" placeholder="Medium caption"></textarea>
        <textarea name="captionLong" placeholder="Long caption"></textarea>
        <input name="georgianCaption" placeholder="Georgian caption" />
        <input name="englishCaption" placeholder="English caption" />
        <input name="mediaAssets" placeholder="Media placeholder (comma separated)" />
        <input name="scheduledAt" type="datetime-local" />
        <button type="submit">Save Draft</button>
      </form>
    </section>
  `;
}
