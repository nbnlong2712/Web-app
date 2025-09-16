# User Story: US-06 - CTR/affiliate tracking

## Basic Information
- **ID**: US-06
- **Title**: CTR/affiliate tracking
- **Priority**: P0
- **Story Points**: 3
- **Status**: Todo
- **Dependencies**: US-05

## Story
As a **product owner**, I want to **track outbound clicks** from the Visit button (attach UTM/ID) **so that** I can measure CTR and affiliate revenue.

## Acceptance Criteria
- [ ] Given an outbound click occurs, When the log request is sent, Then store: tool_id, timestamp, source_page, query_id (if any), session_id.
- [ ] Given I need to view CTR, When aggregating, Then display: clicks / impressions for 7/30 days and top tools.

## Tasks & Subtasks
- [ ] Implement click logging endpoint (/go/[slug])
- [ ] Add UTM parameter handling
- [ ] Create clicks table in Supabase
- [ ] Implement CTR tracking logic

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