---
title: Keyboard Shortcuts JSON Dataset
description: Common keyboard shortcuts for Windows and Mac with categories and actions.
category: reference
tags:
  - keyboard
  - shortcuts
  - productivity
  - windows
  - mac
records: 25
fields:
  - name: action
    type: string
    description: Action performed
  - name: windows
    type: string
    description: Windows shortcut
  - name: mac
    type: string
    description: macOS shortcut
  - name: category
    type: string
    description: Shortcut category
  - name: universal
    type: boolean
    description: Same on both platforms
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Keyboard Shortcuts JSON Dataset

Common keyboard shortcuts for productivity.

## Download

- [Download JSON](/datasets/keyboard-shortcuts.json)
- [Open in JSONLint](/?url=/datasets/keyboard-shortcuts.json)

## Sample Data

```json
{
  "shortcuts": [
    {
      "action": "Copy",
      "windows": "Ctrl+C",
      "mac": "Cmd+C",
      "category": "Clipboard",
      "universal": true
    }
  ]
}
```
