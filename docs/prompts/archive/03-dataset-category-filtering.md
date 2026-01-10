# Prompt 03: Dataset Category Filtering

## Objective
Add filtering and search functionality to the datasets section on the Learn page, allowing users to quickly find datasets by category or keyword.

## Current State
- All datasets displayed in a flat grid
- No filtering or search
- No visual grouping by category

## Target State
- Filter bar with category pills/tabs
- Search input for keyword filtering
- Smooth transitions when filtering
- URL state for shareable filtered views (e.g., `/learn?category=geographic`)
- "All" option to show everything

## Categories
Based on dataset types:
- **All** - Show everything (default)
- **API Mocks** - Users, products, orders, e-commerce data
- **Geographic** - Countries, cities, timezones, locations
- **Reference** - Standards, codes, enumerations
- **Configuration** - Settings, feature flags, i18n
- **Testing** - Edge cases, sample data for testing

## Visual Design
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 [Search datasets...]                                     │
├─────────────────────────────────────────────────────────────┤
│ [All] [API Mocks] [Geographic] [Reference] [Config] [Test] │
└─────────────────────────────────────────────────────────────┘

│ Showing 12 datasets in "Geographic"                         │

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Card 1  │ │ Card 2  │ │ Card 3  │
└─────────┘ └─────────┘ └─────────┘
```

## Tasks
1. Create `DatasetFilter` component with category tabs
2. Add search input with debounced filtering
3. Implement client-side filtering logic
4. Add URL query param sync (`?category=geographic&q=country`)
5. Add result count display
6. Add empty state for no results
7. Animate cards when filtering (fade in/out)

## Files to Create/Modify
- `components/DatasetFilter.tsx` - New filter component
- `app/learn/page.tsx` - Integrate filtering, make client component for interactivity
- `lib/dataset-utils.ts` - Add filter/search functions

## Acceptance Criteria
- Users can filter by category
- Users can search by keyword (searches title, description, tags)
- URL updates when filtering (supports browser back/forward)
- Shareable URLs work (e.g., `/learn?category=geographic`)
- Smooth animations when results change
- Clear "no results" message with suggestion to clear filters
- Mobile-friendly (horizontal scroll for category pills if needed)
