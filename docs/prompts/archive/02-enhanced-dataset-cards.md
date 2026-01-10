# Prompt 02: Enhanced Dataset Cards on Learn Page

## Objective
Improve the dataset cards on the Learn page to show more useful information at a glance, making it easier for users to find the right dataset.

## Current State
Dataset cards show only:
- Icon
- Title (with "JSON Dataset" stripped)
- Description (2 lines)

## Target State
Enhanced cards showing:
- Category badge (color-coded by category)
- Title
- Description
- Record count badge (e.g., "250 records")
- File size badge (e.g., "45 KB")
- Field names preview (e.g., "code, name, capital, +2 more")
- Quick action buttons:
  - Copy first record
  - Open in Validator
  - Download

## Visual Design
```
┌─────────────────────────────────────────────────┐
│ [Geographic]                        250 records │
│                                                 │
│ 🗄️ Countries                                    │
│                                                 │
│ Complete list of world countries with ISO      │
│ codes, capitals, currencies, and population... │
│                                                 │
│ Fields: code, name, capital, currency +1       │
│                                                 │
│ [Copy Sample] [Open in Validator] [Download]   │
└─────────────────────────────────────────────────┘
```

## Tasks
1. Create a new `DatasetCard` component with enhanced layout
2. Add category color mapping (geographic=blue, api-mocks=green, etc.)
3. Implement "Copy Sample" functionality (copies first record)
4. Implement "Open in Validator" link with query param
5. Update the Learn page grid to use the new cards
6. Make cards responsive (stack actions on mobile)

## Files to Create/Modify
- `components/DatasetCard.tsx` - New enhanced card component
- `app/learn/page.tsx` - Update to use new DatasetCard
- `app/page.tsx` - Add support for `?data=` query param to pre-load JSON

## Acceptance Criteria
- Cards display all metadata from Prompt 01
- Copy Sample copies valid JSON to clipboard
- Open in Validator navigates with data pre-loaded
- Download triggers file download
- Responsive on mobile devices
- Accessible (keyboard navigation, screen readers)
