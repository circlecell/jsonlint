---
title: Mock Transactions JSON Dataset
description: Sample financial transaction data for testing banking features and accounting systems.
category: api-mocks
tags:
  - transactions
  - finance
  - mock-data
  - testing
  - banking
records: 12
fields:
  - name: id
    type: string
    description: Transaction ID
  - name: type
    type: string
    description: credit/debit
  - name: amount
    type: number
    description: Transaction amount
  - name: description
    type: string
    description: Transaction note
  - name: category
    type: string
    description: Expense category
  - name: status
    type: string
    description: Transaction status
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Transactions JSON Dataset

Sample financial transactions for banking tests.

## Download

- [Download JSON](/datasets/mock-transactions.json)
- [Open in JSONLint](/?url=/datasets/mock-transactions.json)

## Sample Data

```json
{
  "transactions": [
    {
      "id": "TXN-001",
      "type": "credit",
      "amount": 2500.00,
      "description": "Salary deposit",
      "category": "income",
      "status": "completed"
    }
  ]
}
```
