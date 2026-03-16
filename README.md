# GDSFF Media & Communications Bot

Internal admin dashboard/bot for the **Georgian Dynamic Shooting & Functional Fitness Federation (GDSFF)**.

- Organization: Georgian Dynamic Shooting & Functional Fitness Federation
- Website: gdsff.org
- Email: office@gdsff.org
- Phone: +995 511 560038
- Slogan: Precision. Strength. Discipline.

## What works now

This local admin tool is fully usable today as an internal workflow system:

1. **Dashboard**
   - Pending emails, pending social drafts, urgent items, follow-up counters
   - Recent activity panel
   - Next scheduled posts list

2. **Social Content module**
   - Create social drafts (Facebook / Instagram / both)
   - Category tagging (announcement, membership, leadership, event, gallery, documents, partnership, safety)
   - Short/medium/long caption fields
   - Georgian + English captions
   - Automatic hashtag suggestions by category
   - Status handling (draft/approved/scheduled/published)
   - Preview cards
   - Content calendar/list table
   - Search/filter by status/platform/text

3. **Email Inbox module**
   - Inbox list + detail panel
   - Classification types (membership, partnership, media, general inquiry, legal/documents)
   - Priority handling (low/normal/high/urgent)
   - Status workflow (new/in progress/waiting/replied/closed)
   - Suggested reply templates
   - Internal notes display
   - Searchable message history

4. **Contacts/Leads module**
   - Name, email, phone, organization, category/tag, notes, follow-up status
   - Flat export-friendly structure for CSV/database migration

5. **Templates module**
   - Social templates (launch, membership, leadership, docs, event, gallery, partnership, safety)
   - Email templates (membership, partnership, media, documents, thank-you, confirmation, general)

6. **Assistant/Automation logic**
   - Keyword-based message classification
   - Suggested response type/template
   - Next-action recommendations
   - Urgency scoring
   - Follow-up flagging when unanswered for configurable days

7. **Security/access placeholder**
   - Local protected admin route concept (login gate)
   - Config placeholder section for auth/providers/tokens
   - No hardcoded live secrets

## Placeholder-only (integration-ready)

The tool **does not** claim direct control of Facebook, Instagram, or email without real authentication and backend wiring.

Current placeholder integrations:
- Direct Facebook publishing
- Direct Instagram publishing
- Direct mailbox sync/send (IMAP, Gmail, Microsoft 365)

## Run locally

Because this build uses static ES modules, run it through any local web server.

### Option A: Python
```bash
python3 -m http.server 4173
```
Then open:
- `http://localhost:4173`

### Option B: Any static server
Serve repository root as a static site and open the same route.

## Future integration roadmap

1. Add backend (Node/Next API/FastAPI) for durable database storage.
2. Add admin auth provider (JWT + RBAC, SSO, or OAuth).
3. Add Meta Graph API integration for Facebook/Instagram publishing.
4. Add mailbox connectors (Microsoft 365 Graph, Gmail API, or IMAP).
5. Add scheduled worker for automated follow-up tasks and reminders.
6. Add audit logs + role-restricted workflows for federation governance.

## File structure

- `index.html` – app shell
- `src/main.js` – app orchestration, view routing, state/actions
- `src/styles.css` – professional dark UI styles
- `src/data/mockData.js` – sample production-like records
- `src/data/models.js` – data model references for backend contracts
- `src/utils/automation.js` – classification, urgency, follow-up, hashtag logic
- `src/components/*` – reusable UI modules

