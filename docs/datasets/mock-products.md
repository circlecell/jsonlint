---
title: Mock Products JSON Dataset
description: Sample e-commerce product data for testing shopping carts, catalogs, and product management features.
category: api-mocks
tags:
  - products
  - ecommerce
  - mock-data
  - testing
  - shopping
records: 12
fields:
  - name: id
    type: number
    description: Unique product identifier
  - name: name
    type: string
    description: Product name
  - name: sku
    type: string
    description: Stock keeping unit
  - name: price
    type: number
    description: Product price
  - name: currency
    type: string
    description: Currency code
  - name: category
    type: string
    description: Product category
  - name: inStock
    type: boolean
    description: Availability status
  - name: rating
    type: number
    description: Average rating (1-5)
  - name: reviews
    type: number
    description: Number of reviews
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Products JSON Dataset

Realistic e-commerce product data for testing shopping experiences, catalog displays, and inventory management.

## Quick Stats

- **12 products** across multiple categories
- **~2 KB** file size
- **Fields:** id, name, sku, price, currency, category, inStock, rating, reviews

## Download

- [Download JSON](/datasets/mock-products.json)
- [Open in JSONLint](/?url=/datasets/mock-products.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier | `1` |
| `name` | string | Product name | `"Wireless Headphones"` |
| `sku` | string | Stock keeping unit | `"WH-1001"` |
| `price` | number | Price in currency | `149.99` |
| `currency` | string | Currency code | `"USD"` |
| `category` | string | Product category | `"Electronics"` |
| `inStock` | boolean | Is available | `true` |
| `rating` | number | Average rating | `4.5` |
| `reviews` | number | Review count | `328` |

## Categories

- **Electronics** - Headphones, Speakers, Keyboards, Smart Watches
- **Sports** - Running Shoes, Yoga Mat
- **Home & Kitchen** - Water Bottles, Desk Lamps
- **Accessories** - Wallets, Backpacks
- **Food & Beverage** - Coffee Beans
- **Health** - Protein Powder

## Sample Data

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "sku": "WH-1001",
      "price": 149.99,
      "currency": "USD",
      "category": "Electronics",
      "inStock": true,
      "rating": 4.5,
      "reviews": 328
    },
    {
      "id": 7,
      "name": "Mechanical Keyboard",
      "sku": "MK-7001",
      "price": 159.99,
      "currency": "USD",
      "category": "Electronics",
      "inStock": true,
      "rating": 4.9,
      "reviews": 756
    }
  ]
}
```

## Usage Examples

### JavaScript - Product Listing

```javascript
const response = await fetch('https://jsonlint.com/datasets/mock-products.json');
const { products } = await response.json();

// Filter in-stock products
const available = products.filter(p => p.inStock);

// Sort by price
const byPrice = products.sort((a, b) => a.price - b.price);

// Calculate average rating
const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

// Filter by category
const electronics = products.filter(p => p.category === 'Electronics');
```

### React - Product Card

```jsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="sku">SKU: {product.sku}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <div className="rating">
        {'★'.repeat(Math.round(product.rating))}
        <span>({product.reviews} reviews)</span>
      </div>
      <button disabled={!product.inStock}>
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
```

### Shopping Cart Logic

```javascript
function addToCart(cart, productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product || !product.inStock) return cart;
  
  return [...cart, { ...product, quantity }];
}

function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

## Use Cases

- **E-commerce prototypes** - Build product pages and catalogs
- **Shopping cart testing** - Test add-to-cart, checkout flows
- **Search and filter** - Test product search implementations
- **Price calculations** - Test discount and tax calculations
- **Inventory systems** - Test stock management features

## Related Datasets

- [Mock Users](/datasets/mock-users) - Customer data for orders
- [Currencies](/datasets/currencies) - Multi-currency support
