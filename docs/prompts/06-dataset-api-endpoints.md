# Prompt 06: Dataset API Endpoints

## Objective
Create API routes that serve datasets with proper headers, allowing developers to fetch datasets programmatically with features like filtering and pagination.

## Current State
Datasets are served as static files from `/datasets/{name}.json`

## Target State
API routes at `/api/datasets/` with:
- List all datasets with metadata
- Get single dataset with optional filtering
- Proper CORS headers for cross-origin requests
- Content-Type and caching headers
- Optional query params for slicing data

## API Design

### List Datasets
```
GET /api/datasets
Response: {
  datasets: [
    { name: "countries", records: 250, size: "45KB", ... },
    ...
  ]
}
```

### Get Dataset
```
GET /api/datasets/countries
GET /api/datasets/countries?limit=10
GET /api/datasets/countries?limit=10&offset=20
GET /api/datasets/countries?fields=code,name
Response: {
  data: [...],
  meta: { total: 250, limit: 10, offset: 0 }
}
```

### Get Single Record
```
GET /api/datasets/countries/US
Response: { code: "US", name: "United States", ... }
```

## Tasks
1. Create `/api/datasets/route.ts` - List all datasets
2. Create `/api/datasets/[name]/route.ts` - Get dataset with filtering
3. Create `/api/datasets/[name]/[id]/route.ts` - Get single record
4. Add CORS headers for cross-origin access
5. Add caching headers (CDN-friendly)
6. Document API in a new markdown file

## Files to Create
- `app/api/datasets/route.ts`
- `app/api/datasets/[name]/route.ts`
- `app/api/datasets/[name]/[id]/route.ts`
- `docs/content/completed/datasets-api.md` - API documentation

## Acceptance Criteria
- All endpoints return valid JSON
- CORS allows any origin (public API)
- Proper HTTP status codes (200, 404, 400)
- Query params work correctly
- Response times < 100ms
- API documentation is complete
