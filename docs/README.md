# JSONLint Documentation

This folder contains all documentation, content, and planning materials for JSONLint.com.

## Structure

```
docs/
├── README.md                    # This file
├── ROADMAP.md                   # Master SEO roadmap with all planned tools/content
├── SEO_STRATEGY.md              # Overall SEO strategy
├── AHREFS_RESEARCH_GUIDE.md     # How to use Ahrefs for keyword research
├── CONTENT_PROMPTS.md           # Prompts for generating content
├── CONTENT_REVIEW.md            # Content quality checklist
│
├── content/
│   └── completed/               # Published articles (served by Next.js)
│       ├── mastering-json-format.md
│       ├── json-parse-error.md
│       ├── python-json.md
│       └── ... (13 total)
│
├── datasets/                    # Dataset documentation (served by Next.js)
│   ├── us-states-with-detail.md
│   ├── programming-languages.md
│   └── emoticons.md
│
└── tools/                       # Tool implementation prompts
    ├── README.md                # Tools overview & workflow
    ├── completed/               # Implemented tools (15)
    └── pending/                 # Tools to implement (18)
        ├── _json-to-xml.md
        ├── _json-to-csharp.md
        ├── _json-to-excel.md
        └── ... (see tools/README.md)
```

## Workflow

### Adding New Content

1. Check `ROADMAP.md` for prioritized content ideas
2. Create the article in `content/completed/` 
3. Update `ROADMAP.md` status
4. Add internal links to/from related pages
5. Update footer if high-volume article

### Adding New Tools

1. Check `tools/pending/` for implementation prompts
2. Read the full prompt file before starting
3. Create the tool page in `/app/[tool-name]/`
4. Follow SEO requirements in the prompt:
   - 800-1,200 words of content
   - Internal links to related tools/articles
   - FAQ section
5. Update navigation:
   - `components/Footer.tsx` — Add to appropriate column
   - `components/Header.tsx` — Add to dropdown if high-volume
6. Add cross-links to related existing pages
7. Move prompt from `tools/pending/` to `tools/completed/`
8. Update `ROADMAP.md` status

## Key Files

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Master list of all planned work with priorities |
| `SEO_STRATEGY.md` | Overall SEO approach and keyword strategy |
| `CONTENT_PROMPTS.md` | Templates for generating consistent content |
| `AHREFS_RESEARCH_GUIDE.md` | How to find new keyword opportunities |

## Content Guidelines

- All articles should be 800-1,500 words
- Include code examples where relevant
- Link to at least 2 tools and 2 related articles
- Follow the structure in `CONTENT_PROMPTS.md`
