# Decisions

Newest first. Every material product or technical choice gets a row.

| When (ISO 8601 with offset) | Decision | Why | Alternatives rejected | source | provenance_id |
|-----------------------------|----------|-----|----------------------|--------|---------------|
| 2026-11-09T14:29:00+01:00 | GitHub is the sole forge / source of truth for this repo (`origin` + `gh` PRs only) | One review surface; stop dual Origin/GitHub PRs | Cursor Origin as source of truth; dual remotes | source:our-skill | workflow.github-only |
| 2026-11-09T12:55:00+01:00 | Add `/rebuild-from-reference` skill for URL/screenshot/catalog rebuilds | Enable rebuild-from-liked-site workflow in the pack | Ad-hoc prompts only | source:our-skill | rebuild.analysis-sheet |
