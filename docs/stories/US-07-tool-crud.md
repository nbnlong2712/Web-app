# User Story: US-07 - Tool CRUD (Admin)

## Basic Information
- **ID**: US-07
- **Title**: Tool CRUD (Admin)
- **Priority**: P0
- **Story Points**: 5
- **Status**: Todo
- **Dependencies**: None

## Story
As an **admin/editor**, I want to **add/edit tools** (name, slug, description, link, affiliate_id, pricing, category, tags, last_updated) **so that** I can seed the initial 100–200 tools.

## Acceptance Criteria
- [ ] Given I am a logged-in admin, When creating/editing a tool, Then validate required fields: name, url, unique slug, pricing, category, ≥1 tag.
- [ ] Given save succeeds, When updating, Then the `last_updated` field is automatically set to now().

## Tasks & Subtasks
- [ ] Create admin tool management UI
- [ ] Implement add/edit tool forms
- [ ] Add validation for required fields
- [ ] Implement save functionality with last_updated auto-update

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
TBD