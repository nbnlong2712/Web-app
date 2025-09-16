# User Story: US-10 - Skeleton shimmer

## Basic Information
- **ID**: US-10
- **Title**: Skeleton shimmer
- **Priority**: P1
- **Story Points**: 2
- **Status**: Todo
- **Dependencies**: None

## Story
As a **visitor**, while waiting for data I want to see **skeleton shimmer (glass card)** **so that** the experience feels smooth.

## Acceptance Criteria
- [ ] Given data is loading, When wait time >100ms, Then show skeleton cards with shimmer effect, and hide them when data is ready.
- [ ] Given the skeleton is displayed, When viewed on different screen sizes, Then it maintains the same layout proportions as the actual cards.
- [ ] Given the skeleton is displayed, When CSS is disabled, Then it degrades gracefully without breaking the layout.

## Tasks & Subtasks
- [ ] Create skeleton card component with glass styling
  - [ ] Implement glass card styling matching the Neo-Glassmorphism theme
  - [ ] Create responsive skeleton layout that matches ToolCard dimensions
  - [ ] Add proper ARIA attributes for accessibility
- [ ] Implement shimmer effect
  - [ ] Create animated shimmer using CSS keyframes
  - [ ] Ensure shimmer animation is smooth and performant
  - [ ] Make shimmer animation respect user's reduced motion preferences
- [ ] Integrate skeleton cards with loading states
  - [ ] Add loading state detection to tool grid component
  - [ ] Display skeleton cards when loading takes >100ms
  - [ ] Hide skeleton cards when data is ready
- [ ] Test skeleton implementation
  - [ ] Verify skeleton appears after 100ms delay
  - [ ] Test responsive behavior on different screen sizes
  - [ ] Verify accessibility with screen readers

## Dev Agent Record
### Agent Model Used
TBD

### Debug Log References
TBD

### Completion Notes
TBD

### File List
TBD

### Change Log
TBD

## QA Results
TBD

## Testing
TBD

## Dev Notes
### Project Structure
The skeleton component should be placed in the components directory following the established structure:
```
components/
├─ ui/                             # shadcn/ui components
├─ ToolCard.tsx
├─ ToolDetail.tsx
├─ Filters.tsx
├─ SearchBox.tsx
├─ Skeletons.tsx                   # New skeleton components will go here
└─ Skeletons.tsx
```

[Source: docs/architecture/source-tree.md]

### UI Framework
- Tailwind + shadcn/ui, motion via Framer Motion; theme: Neo‑Glassmorphism (dark gradient background, glass cards and modals, 2xl radius, 100–150ms micro-interactions).

[Source: docs/architecture/5-front-end-application-structure.md]

### Styling, A11y & Motion
- **Tailwind‑first**: Prefer composable utility classes; extract repeated class lists to a `cx` helper.
- **Glass UI**: Respect theme tokens (blur, borders, subtle shadows).
- **Motion**: Short (100–150ms) micro‑interactions; avoid excessive parallax/heavy animations.

[Source: docs/architecture/coding_standards.md#7]

### Performance & Quality Budgets
- Home SSR TTFB ≤ 500ms
- Filter response time ≤ 300ms
- Lighthouse Perf ≥ 85
- Lighthouse Accessibility ≥ 90
- Use `next/image` with correct sizing; lazy‑load thumbnails; code‑split heavy features.

[Source: docs/architecture/coding_standards.md#9]

### Testing Standards
- **Unit**: Vitest + Testing Library per entity.
- **Snapshots**: minimal; prefer explicit assertions.
- **Coverage**: add/keep tests for new/changed logic.

[Source: docs/architecture/coding_standards.md#8]