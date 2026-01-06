# Prompt 07: Dataset Contribution System

## Objective
Allow users to submit new datasets for inclusion in the repository, with a simple form and review process.

## Current State
No way for users to contribute datasets

## Target State
- Contribution form at `/datasets/contribute`
- Form collects: name, description, category, JSON data, source/license info
- Client-side validation of JSON
- Submission creates a GitHub issue (or sends email)
- Thank you page with contribution guidelines

## Form Fields
1. **Dataset Name** - Text input, required
2. **Description** - Textarea, required, max 500 chars
3. **Category** - Dropdown (API Mocks, Geographic, Reference, Config, Testing)
4. **Tags** - Comma-separated text input
5. **JSON Data** - Monaco editor with validation
6. **Source** - Where the data came from
7. **License** - Dropdown (Public Domain, CC0, CC-BY, MIT, Other)
8. **Your Name** - Optional attribution
9. **Email** - For follow-up questions

## Submission Flow
1. User fills form
2. Client validates JSON is parseable
3. Client validates required fields
4. On submit, POST to `/api/datasets/contribute`
5. API creates GitHub issue with dataset details (using GitHub API)
6. Show success message with issue link
7. Maintainer reviews and merges

## Tasks
1. Create `/datasets/contribute/page.tsx` - Contribution form
2. Create `/api/datasets/contribute/route.ts` - Handle submissions
3. Set up GitHub API integration for issue creation
4. Add form validation (client + server)
5. Create success/error states
6. Add link to contribute from Learn page

## Files to Create
- `app/datasets/contribute/page.tsx`
- `app/api/datasets/contribute/route.ts`
- `lib/github.ts` - GitHub API helper

## Environment Variables Needed
- `GITHUB_TOKEN` - For creating issues
- `GITHUB_REPO` - Repository for issues (e.g., "user/jsonlint")

## Acceptance Criteria
- Form validates JSON before submission
- All required fields are enforced
- GitHub issue is created with formatted content
- User sees confirmation with issue link
- Form is accessible and mobile-friendly
- Rate limiting to prevent spam
