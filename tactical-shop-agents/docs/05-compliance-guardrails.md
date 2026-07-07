# Compliance Guardrails

This file is both human policy and machine policy: the prohibited-items list is
embedded in every agent prompt, and the hard rules are enforced by Make filters
(see README §Hard safety rails).

---

## 1. Prohibited items (never buy, list, sell, or advertise)

- Firearms of any kind (pistols, rifles, shotguns), including airsoft/blank-fire
  convertibles and receivers/frames.
- Ammunition, primers, propellants, reloading components.
- Regulated weapon parts: barrels, bolts/bolt carriers, trigger assemblies,
  suppressors/silencers, functional magazines, conversion kits.
- Explosives, pyrotechnics, grenades (including training/inert without permits).
- Prohibited knives per Georgian law (automatic/gravity knives above legal
  thresholds) — check each blade product individually.
- Items under export-control/dual-use lists (night-vision above Gen-1 and
  thermal optics may require permits — verify HS code before listing; when in
  doubt, block and escalate to human).

**Allowed (our niche):** apparel, boots, plate carriers and soft-armor-carrier
shells (verify local rules if ballistic panels are ever considered — currently
NOT sold), belts, holsters, optics *accessories* (mounts, covers, filters),
backpacks, gloves, eyewear, patches, admin pouches, flashlights, IFAK pouches
(without prescription meds).

**Machine enforcement:** Chief Engineer prompt blocks product creation on
keyword/HS-code match and raises a high incident; SKU store has
`status=blocked_compliance`; Field agent holds any order containing a blocked
SKU; Marketing agent refuses briefs.

## 2. Meta (Facebook/Instagram) ad policy notes — tactical niche

- Ads must not promote weapons, ammunition, or weapon modifications. Weapon
  *accessories* (holsters, slings, cases, optics accessories, safes) are
  allowed but must target **18+** only. Always set the age gate.
- Body armor: Meta restricts promotion in some regions; keep plate-carrier ads
  positioned as load-bearing/outdoor equipment, never "stops bullets" claims,
  and monitor rejection patterns.
- No imagery of weapons pointed at the viewer, violence against people, or
  realistic combat against humans. Range/outdoor/training contexts are safer.
- No claims of military/police endorsement without proof; "mil-spec" only with
  actual spec references.
- Organic posts have looser rules than paid ads, but repeated ad rejections can
  restrict the whole ad account — the Marketing agent flags every rejection to
  the CEO, and 2+ rejections in 30 days pause all ad proposals pending human
  review.
- Commerce (FB/IG Shop) prohibits weapon-related listings more broadly than
  ads; keep holsters etc. on the website and use Shop for apparel/packs/boots
  if listings get rejected.

## 3. Georgian VAT / customs notes

*Preparation aid — confirm with a licensed Georgian accountant.*

- **VAT registration** is mandatory once taxable turnover exceeds 100,000 GEL
  in any continuous 12-month period; the system assumes VAT-registered status
  (18% on domestic sales, input VAT deductible).
- **Domestic sales:** VAT = gross × 18/118. **Exports** of goods are
  zero-rated — keep courier export documentation as proof.
- **Imports:** import VAT 18% on (customs value + duty); customs duty 0%, 5%
  or 12% depending on HS code (most textiles/footwear 0–12%). Goods imported
  by a VAT payer: import VAT is creditable. Keep declarations (SAD) linked to
  freight batches for landed-cost math.
- **Declarations:** monthly VAT return via **rs.ge** by the 15th of the
  following month; payment same deadline. The Accountant agent's monthly
  `VAT Export` sheet feeds this but a human files it.
- Personal-importer thresholds (300 GEL / 30 kg) do NOT apply to commercial
  imports — always declare commercially.
- Income/profit tax: Georgian "Estonian model" CIT taxes distributed profit at
  15% — retained/reinvested profit untaxed; discuss dividend policy with the
  accountant.

## 4. Data privacy basics

- Georgian Law on Personal Data Protection applies (and GDPR if actively
  selling into the EU): collect only what fulfillment needs (name, phone,
  address, email); publish a bilingual privacy policy; obtain consent for
  marketing email (checkbox at checkout, not pre-ticked); honor deletion
  requests — Admin Supervisor routes them to the human within 10 days.
- Data locations to document: WooCommerce host, Make.com (EU zone —
  eu1.make.com), Google Sheets, Anthropic API (30-day retention), Meta,
  courier systems. List these in the privacy policy.
- Never place card data anywhere in this system — payments stay inside
  TBC/PayPal (PCI scope stays with the gateways).
- Prompts must not include more customer PII than the task needs; support
  payloads pass handle + order id, not full profiles.
- Retention: close support threads purge message bodies after 12 months
  (quarterly manual cleanup job); ledger data kept 6 years (tax requirement).

## 5. Consumer rights (Georgia)

14-day return right for distance sales (unused goods); defective goods:
repair/replacement/refund at consumer's choice within warranty. The Field
agent's RMA rules implement this; `reject` proposals always require human
approval.
