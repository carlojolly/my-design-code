# Baseline preferences specimen

Lightweight **reference artifact** for agents and reviewers — not an application and not a rebuild of the Baseline Tennis site.

Demonstrates:

1. Approved Onest hero typography (`type.hero-baseline`)
2. Proposed font candidates (General Sans, Instrument Sans, Manrope) — labeled, not defaults
3. Rejected vs proposed section-label treatments (rejected block is isolated)
4. Fullscreen nav open/close (`motion.fullscreen-nav-baseline`)
5. Footer composition (`craft.footer-baseline`)

## Open locally

```bash
# from repo root — serve the skill root so doc links resolve
python3 -m http.server 8765 --bind 127.0.0.1 --directory skills/frontend-design
# then visit http://127.0.0.1:8765/assets/baseline-preferences-specimen/
```

## Isolation rules

- Elements marked `data-specimen-role="rejected-example"` exist only for comparison. **Do not** copy their styles into production.
- Candidate font panels are `status: proposed`. Do not ship them as project defaults without user approval.
- Specimen contact/social copy is fictional (`.example`). Never paste it into a real product.

## Related docs

- `../../references/typography.md`
- `../../references/motion-stack.md`
- `../../references/ui-craft-patterns.md`
- `../../references/taste-memory.md`
- `../../references/provenance.md`
