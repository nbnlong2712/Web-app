# User Story: US-13 - Submit tool + Moderation

## Basic Information
- **ID**: US-13
- **Title**: Submit tool + Moderation
- **Priority**: P1
- **Story Points**: 3
- **Status**: Todo
- **Dependencies**: US-07

## Story
As a **submitter**, I want a **Submit Tool form** (name, link, description, optional email) and **moderation** **so that** I can contribute new tools.

## Acceptance Criteria
- [ ] Given the form is valid, When submitted, Then save into table `submissions` with status `pending` and send an email notification to admin (if configured).
- [ ] Given the admin reviews, When approved, Then move data to table `tools` and set `last_updated`.

## Tasks & Subtasks
- [ ] Create Submit Tool form
- [ ] Implement form validation
- [ ] Add submission logic to save to `submissions` table
- [ ] Implement admin moderation UI

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