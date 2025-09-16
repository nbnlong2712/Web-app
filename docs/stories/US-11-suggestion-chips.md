# User Story: US-11 - Suggestion chips

## Basic Information
- **ID**: US-11
- **Title**: Suggestion chips
- **Priority**: P1
- **Story Points**: 2
- **Status**: Todo
- **Dependencies**: US-01

## Story
As a **visitor**, I want **quick suggestion chips** under the chat box (e.g., "write content", "generate image", "translation") **so that** I can explore.

## Acceptance Criteria
- [ ] Given the home page, When it renders, Then show 6 hot use-case chips; When a chip is clicked, Then fill the input and run the search.
- [ ] Given a suggestion chip is clicked, When the search executes, Then the results are displayed below the input.
- [ ] Given the suggestion chips are displayed, When viewed on mobile, Then they wrap appropriately without overflowing the container.

## Tasks & Subtasks
- [ ] Create suggestion chips component
  - [ ] Design chip components with glass styling matching Neo-Glassmorphism theme
  - [ ] Implement responsive layout for chips
  - [ ] Add proper ARIA attributes for accessibility
- [ ] Implement chip click behavior
  - [ ] Add click handler to fill chat input with chip text
  - [ ] Trigger search when chip is clicked
  - [ ] Ensure keyboard navigation works for chips
- [ ] Integrate suggestion chips with chat input
  - [ ] Position chips below the chat input component
  - [ ] Ensure chips are visible when the page loads
  - [ ] Test integration with existing search functionality
- [ ] Define initial set of suggestion chips
  - [ ] Select 6 representative use cases in EN/VI
  - [ ] Ensure chips cover diverse tool categories
  - [ ] Validate chip text with product owner

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
The suggestion chips component should be placed in the components directory following the established structure:
```
components/
├─ ui/                             # shadcn/ui components
├─ ToolCard.tsx
├─ ToolDetail.tsx
├─ Filters.tsx
├─ SearchBox.tsx
├─ Skeletons.tsx
└─ SuggestionChips.tsx             # New suggestion chips component will go here
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

### Component Requirements
- Components should be keyboard navigable
- Components should have proper focus states
- Components should work on both desktop and mobile devices

[Source: docs/architecture/5-front-end-application-structure.md#components]

### Testing Standards
- **Unit**: Vitest + Testing Library per entity.
- **Snapshots**: minimal; prefer explicit assertions.
- **Coverage**: add/keep tests for new/changed logic.

[Source: docs/architecture/coding_standards.md#8]

### Suggested Chip Text
Based on the existing taxonomy, here are suggested chips:
1. "Write content" / "Viết nội dung"
2. "Generate image" / "Tạo hình ảnh"
3. "Translation" / "Dịch thuật"
4. "Video editing" / "Chỉnh sửa video"
5. "Code assistant" / "Trợ lý lập trình"
6. "Audio transcription" / "Chuyển âm thanh thành văn bản"