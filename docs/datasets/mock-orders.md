---
title: Mock Orders JSON Dataset
description: Sample e-commerce order data for testing order management and fulfillment systems.
category: api-mocks
tags:
  - orders
  - ecommerce
  - mock-data
  - testing
  - fulfillment
records: 12
fields:
  - name: id
    type: string
    description: Order ID
  - name: customer_id
    type: number
    description: Customer reference
  - name: status
    type: string
    description: Order status
  - name: total
    type: number
    description: Order total
  - name: items
    type: number
    description: Item count
  - name: created
    type: string
    description: Order date
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Orders JSON Dataset

Sample order data for e-commerce testing.

## Download

- [Download JSON](/datasets/mock-orders.json)
- [Open in JSONLint](/?url=/datasets/mock-orders.json)

## Sample Data

```json
{
  "orders": [
    {
      "id": "ORD-001",
      "customer_id": 1,
      "status": "delivered",
      "total": 149.99,
      "items": 3,
      "created": "2024-01-05"
    }
  ]
}
```
