# School Dashboard — Design System (source of truth)

Generated with UI/UX Pro Max (`--design-system "education student dashboard productivity planner"`),
then adapted for a light/dark app shell.

## Style
**Flat Design** — 2D, clean lines, bold accents, typography-first, icon-heavy.
No gradients, no heavy shadows (a 1px border defines surfaces). Hover = color/opacity shift,
150–200ms ease. Never scale transforms that shift layout.

## Color tokens

| Role        | Light            | Dark             | Tailwind            |
|-------------|------------------|------------------|---------------------|
| Primary     | `#0D9488`        | `#2DD4BF`        | `primary-600/400`   |
| Accent/CTA  | `#EA580C`        | `#FB923C`        | `accent-600/400`    |
| Background  | `#F0FDFA`-tinted slate-50 | `#0B1220` | `bg-app`            |
| Surface     | `#FFFFFF`        | `#111827`        | `bg-surface`        |
| Border      | slate-200        | slate-800        |                     |
| Text        | `#134E4A`/slate-900 | slate-100     |                     |
| Muted text  | slate-600 (min)  | slate-400        |                     |

### Status (always icon + label, never color alone)
- À faire → slate, `Circle` icon
- En cours → amber, `Timer` icon
- Fini → emerald, `CheckCircle2` icon

### Priority
- Basse → sky, `ArrowDown`
- Moyenne → amber, `Minus`
- Haute → rose, `ArrowUp`

### Course palette (categorical, fixed order, validated with dataviz `validate_palette.js`)
`#0D9488 #EA580C #2563EB #DB2777 #65A30D #7C3AED #D97706 #0891B2`
Course colors are always shown next to the course name (identity never color-alone).

## Typography
- Headings/numbers: **Fira Code** (600–700) — technical, precise, dashboard mood
- Body/UI: **Fira Sans** (400–600), 16px base on mobile, line-height 1.5

## Layout
- Mobile-first. < 1024px: top bar + bottom tab bar (44px+ targets). ≥ 1024px: fixed left sidebar.
- Container: `max-w-7xl`, 16px gutters on mobile, 32px desktop.
- Cards: `rounded-xl border bg-surface p-4/p-5`.
- z-index scale: nav 30, overlay 40, modal 50, toast 60.

## Interaction & a11y checklist
- `cursor-pointer` + visible `focus-visible` ring (primary) on all interactive elements
- Icon-only buttons have `aria-label`
- Forms use `<label for>`
- Drag & drop is also possible via keyboard (dnd-kit KeyboardSensor) and via a status menu on each card
- `prefers-reduced-motion` disables transitions
- Theme: follows system by default, user override (Système / Clair / Sombre) persisted locally

## Page designs

### Dashboard
Greeting + date → row of 4 stat tiles (À rendre, En cours, En retard, Taux de complétion)
→ 2-column grid: "Tâches du jour" (checklist from daily_tasks) | "Échéances à venir" (7 days)
→ "Progression par cours" (thin bars, course label + value text).

### Cours
Header + "Nouveau cours" CTA → responsive grid (1/2/3 cols) of course cards
(color band left, name, teacher, assignment count, delete). Modal form with color swatches.

### Devoirs
Header + CTA → filter bar (statut chips, priorité chips, cours select, reset) synced to URL
→ list of assignment rows (course dot + name, title, deadline w/ overdue flag, priority badge,
status select, edit, delete).

### To-do du jour (Trello)
Day switcher (← date →, "Aujourd'hui") + quick add input
→ 3 columns À faire / En cours / Fini (stacked on mobile, 3-col on md+), drag & drop cards.

### Calendrier
Month switcher → 7-col grid (Mon-first), each day shows count badge of due assignments
+ course dots; selected day lists its assignments below (mobile) / beside (desktop).
