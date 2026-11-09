# Typography reference

**Read before choosing fonts or section labels.**  
Personal preferences for this user. Companion libraries (Taste Skill, 21st, Impeccable) may still suggest other faces — **owned overrides in this pack win** for this user’s projects. Do not edit third-party packages to enforce these rules; follow this file and `taste-memory.md`.

Specimen: [`../assets/baseline-preferences-specimen/`](../assets/baseline-preferences-specimen/)

## Hard must-nots

| Rule | Provenance | Status |
|------|------------|--------|
| Do **not** use **Space Grotesk** | `type.no-space-grotesk` · `source:user-feedback:baseline` | rejected |
| Do **not** use the bullet character **•** (U+2022) in UI copy, labels, separators, or decorative lists | `type.no-bullet-char` · `source:user-feedback` | rejected |
| Do **not** use monospace for expressive headings, navigation, marketing copy, section labels, badges, or decorative “technical” styling | `type.no-decorative-mono` · `source:user-feedback:baseline` | rejected |
| Retain monospace only when function requires it (code examples, true code UI). Tabular numbers → `font-variant-numeric: tabular-nums`, not a mono family | same | active rule |
| Do **not** reproduce Baseline’s small uppercase label recipe as a default: **0.75rem / weight 500 / uppercase / 0.22em tracking** | `type.section-label-tracked-caps` · `source:user-feedback:baseline` | rejected |
| Do **not** ship Times / Times New Roman / Georgia / browser-default **serif** for product UI chrome, template headers, nav, or body | `type.no-default-serif-ui` · `source:user-feedback` | rejected |
| Do **not** leave font CSS miswired (`--font-sans: var(--font-sans)` circular, Geist vars unused) so the UI falls back to that serif stack | same | rejected |
| Choosing an approved font does **not** automatically produce good typography — still craft scale, weight, leading, tracking, contrast, and wrapping | `source:our-skill` | active |
| Preserve existing anti-defaults: avoid Inter / Roboto / Arial as the expressive brand face (`anti.inter-everywhere`). Do **not** expand the rejected-font list with unstated personal dislikes | `source:impeccable` + this file | active |

## Family policy

1. **Usually use one family well.** Add a second only for a clear role (e.g. display vs body) after the brief needs it.
2. **Do not randomly rotate fonts** or introduce several families on one page.
3. Keep **candidates** out of the approved default pool until the user visually approves them.
4. Prefer loading from the official source URL with `display=swap`; verify the face actually loads.

---

## Approved default pool

### Onest — confirmed preferred

| Field | Value |
|-------|--------|
| Approval | **Confirmed preferred** · `type.onest-default` · `source:user-feedback:baseline` |
| Roles | Large editorial / marketing display; supporting UI and body |
| Suggested weights | **500** large editorial display · **400** supporting / body |
| Official source | https://fonts.google.com/specimen/Onest |
| Also | https://onest.md/en |

**Specimen copy (shared across comparisons):**

- Headline: Own The Court  
- Paragraph: Coaching, match play, and academy pathways built for players who want a clearer path from first lesson to competition.  
- Navigation: Programs · Coaching · Membership · Contact  
- Section label: Training programs  

---

## Proposed shortlist (awaiting visual approval)

Status on each row is **proposed** — not an approved default. Do not ship as the project face without user sign-off. Show candidates in the specimen only, clearly labeled.

### General Sans

| Field | Value |
|-------|--------|
| Approval | **Proposed candidate** · `type.candidate-general-sans` · `source:assistant-proposed` |
| Suitable roles | Restrained, confident headings; supporting UI |
| Suggested weights | 500–600 headings · 400 supporting |
| Official source | https://www.fontshare.com/fonts/general-sans/ |

### Instrument Sans

| Field | Value |
|-------|--------|
| Approval | **Proposed candidate** · `type.candidate-instrument-sans` · `source:assistant-proposed` |
| Suitable roles | Editorial headings; versatile supporting text |
| Suggested weights | 500–600 headings · 400 supporting |
| Official source | https://fonts.google.com/specimen/Instrument+Sans |

### Manrope

| Field | Value |
|-------|--------|
| Approval | **Proposed candidate** · `type.candidate-manrope` · `source:assistant-proposed` |
| Suitable roles | Clean, structured product typography |
| Suggested weights | 500–600 headings · 400 supporting |
| Official source | https://fonts.google.com/specimen/Manrope |

---

## Baseline hero typography recipe

**Provenance:** `type.hero-baseline` · `source:user-feedback:baseline` (+ measurement detail `source:baseline-reference`)  
**Use case:** Short, confident marketing headlines (optional pattern — not mandatory on every project).

### Exact reference

| Property | Value |
|----------|--------|
| Family | Onest |
| Weight | 500 |
| Headline | “Own The Court” |
| Transform | Uppercase |
| Font size | 12.5vw |
| Line-height | 0.85 |
| Letter-spacing | -0.02em |
| Composition | Broad horizontal layout with generous surrounding space |
| Color | White text on a darkened photographic background |

### Transferable principle

Scale, tight spacing, medium weight (500), strong contrast, and intentional line breaks create the character **together**. Copying only the family or only the uppercase transform will not reproduce the effect.

### Adapt — do not cargo-cult

- Do **not** require a loader, photography, uppercase headlines, or this exact `12.5vw` size on every future project.
- Do **not** apply the original nowrap rule blindly to longer copy or narrow screens.
- Adapt wrapping and sizing to content; preserve zoom readability; check overflow.
- Uppercase is approved **here**; it is not a global mandate (see rejected section-label treatment below).

### Optional entrance (reference behavior)

Keep optional; honor `prefers-reduced-motion` with a static final state.

1. Wrap each word in an overflow-hidden clipping container.
2. Start inner words at `translateY(115%)` and `opacity: 0`.
3. Animate to `translateY(0)` and `opacity: 1`.
4. Duration **1100ms**, easing **easeOutExpo**, stagger **140ms**.
5. Allow descender padding so glyphs are not clipped.
6. Skip or collapse the animation when reduced motion is requested.

`easeOutExpo` reference curve: `cubic-bezier(0.16, 1, 0.3, 1)` (or the motion library’s expo-out preset).

---

## Section labels

### Rejected treatment

**Provenance:** `type.section-label-tracked-caps` · `source:user-feedback:baseline` · status **rejected**

Baseline’s hero and “TRAINING PROGRAMS” both used Onest. The rejection is at the **treatment** level, not a rejection of Onest:

- ~0.75rem  
- weight 500  
- uppercase  
- letter-spacing ~0.22em  

Do not ship this as the default eyebrow / section label.  
Do **not** ban uppercase globally — the approved hero uses it successfully.  
Do **not** infer rejection of all dots, badges, or footer column headings.

### Proposed replacement (not yet a visual-approved specimen)

**Provenance:** `type.section-label-sentence` · `source:assistant-proposed` · status **proposed**

| Property | Proposed default |
|----------|------------------|
| Case | Sentence case — e.g. “Training programs” |
| Family | Same family as the page |
| Size | ≈ 0.875–1rem |
| Weight | 400 or 500 |
| Tracking | Normal, or at most 0.02em |
| Color | Clear contrast; quiet hierarchy under the section heading |
| Omit | Drop the label if it only repeats the heading below |

Mark implementations that use this recipe as **proposed** in `decision.md` until the user confirms a visual specimen.

---

## Companion override note

If Taste Skill, 21st catalog components, or Impeccable steer toward Space Grotesk, decorative monospace labels, or the rejected tracked-caps eyebrow, **restyle to this pack’s rules** after install. Preserve installed third-party packages; enforce personal overrides here and in project tokens — not by forking companions.
