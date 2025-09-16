# User Story: US-09 - Copy link

## Basic Information
- **ID**: US-09
- **Title**: Copy link
- **Priority**: P1
- **Story Points**: 1
- **Status**: Todo
- **Dependencies**: US-05

## Story
As a **visitor**, I want to **copy the tool link** in the detail view **so that** I can share it.

## Acceptance Criteria
- [ ] Given I am on the tool detail, When I press **Copy Link**, Then the link with UTM/affiliate (if any) is copied to the clipboard and a "Copied" toast appears.
- [ ] Given the clipboard operation fails, When I press **Copy Link**, Then a user-friendly error message is displayed.
- [ ] Given I press **Copy Link**, When the operation succeeds, Then the button text changes to "Copied" temporarily before reverting.

## Tasks & Subtasks
- [ ] Add Copy Link button to ToolDetail component
  - [ ] Design Copy Link button with appropriate styling
  - [ ] Position button near the Visit button in the ToolDetail component
  - [ ] Ensure button is accessible via keyboard navigation
- [ ] Implement copy to clipboard functionality
  - [ ] Create utility function for copying text to clipboard
  - [ ] Handle success and error cases appropriately
  - [ ] Ensure copied link includes UTM parameters if present
- [ ] Add "Copied" toast notification
  - [ ] Implement toast component for success feedback
  - [ ] Add auto-dismiss functionality after 2-3 seconds
  - [ ] Ensure toast is accessible to screen readers
- [ ] Test copy link functionality
  - [ ] Verify link is correctly copied to clipboard
  - [ ] Test error handling when clipboard access is denied
  - [ ] Verify toast notifications appear correctly

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
The copy link functionality should be implemented within the existing ToolDetail component:
```
components/
├─ ui/                             # shadcn/ui components
├─ ToolCard.tsx
├─ ToolDetail.tsx                  # Add copy link functionality here
├─ Filters.tsx
├─ SearchBox.tsx
└─ Skeletons.tsx
```

[Source: docs/architecture/source-tree.md]

### UI Framework
- Tailwind + shadcn/ui, motion via Framer Motion; theme: Neo‑Glassmorphism (dark gradient background, glass cards and modals, 2xl radius, 100–150ms micro-interactions).

[Source: docs/architecture/5-front-end-application-structure.md]

### Component Requirements
- ToolDetail component displays full description, pricing (free/paid), tags, last_updated, Visit (primary), Copy Link (secondary)
- Copy Link button should be clearly differentiated from the primary Visit button

[Source: docs/stories/US-05-tool-detail.md]

### Styling, A11y & Motion
- **Tailwind‑first**: Prefer composable utility classes; extract repeated class lists to a `cx` helper.
- **Glass UI**: Respect theme tokens (blur, borders, subtle shadows).
- **A11y**: visible focus states, semantic HTML, proper ARIA; SSR results region uses `aria-live="polite"`.

[Source: docs/architecture/coding_standards.md#7]

### Testing Standards
- **Unit**: Vitest + Testing Library per entity.
- **Snapshots**: minimal; prefer explicit assertions.
- **Coverage**: add/keep tests for new/changed logic.

[Source: docs/architecture/coding_standards.md#8]

### Implementation Notes
- Use the Clipboard API for copying text
- Handle cases where Clipboard API is not available or permissions are denied
- Consider using a fallback method for older browsers
- Ensure UTM parameters are preserved when copying links