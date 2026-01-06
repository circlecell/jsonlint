---
title: Mock Users JSON Dataset
description: Sample user data for testing authentication, user management, and CRUD operations in your applications.
category: api-mocks
tags:
  - users
  - mock-data
  - testing
  - authentication
  - api
records: 12
fields:
  - name: id
    type: number
    description: Unique user identifier
  - name: username
    type: string
    description: Login username
  - name: email
    type: string
    description: Email address
  - name: name
    type: object
    description: First and last name
  - name: age
    type: number
    description: User age
  - name: role
    type: string
    description: User role (admin, editor, viewer)
  - name: active
    type: boolean
    description: Account status
  - name: created
    type: string
    description: Account creation date
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Users JSON Dataset

Realistic sample user data for testing authentication systems, user management features, and API development.

## Quick Stats

- **12 users** with varied roles and statuses
- **~2 KB** file size
- **Fields:** id, username, email, name, age, role, active, created

## Download

- [Download JSON](/datasets/mock-users.json)
- [Open in JSONLint](/?url=/datasets/mock-users.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier | `1` |
| `username` | string | Login username | `"johndoe"` |
| `email` | string | Email address | `"john.doe@example.com"` |
| `name` | object | First and last name | `{"first": "John", "last": "Doe"}` |
| `age` | number | User age | `32` |
| `role` | string | Permission level | `"admin"` |
| `active` | boolean | Is account active | `true` |
| `created` | string | Creation date (ISO) | `"2023-01-15"` |

## Roles Distribution

- **3 admins** - Full system access
- **4 editors** - Content management
- **5 viewers** - Read-only access
- **3 inactive** - Deactivated accounts

## Sample Data

```json
{
  "users": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "name": {"first": "John", "last": "Doe"},
      "age": 32,
      "role": "admin",
      "active": true,
      "created": "2023-01-15"
    },
    {
      "id": 2,
      "username": "janesmith",
      "email": "jane.smith@example.com",
      "name": {"first": "Jane", "last": "Smith"},
      "age": 28,
      "role": "editor",
      "active": true,
      "created": "2023-02-20"
    }
  ]
}
```

## Usage Examples

### JavaScript - User Table

```javascript
const response = await fetch('https://jsonlint.com/datasets/mock-users.json');
const { users } = await response.json();

// Filter active users
const activeUsers = users.filter(u => u.active);

// Group by role
const byRole = users.reduce((acc, user) => {
  acc[user.role] = acc[user.role] || [];
  acc[user.role].push(user);
  return acc;
}, {});

// Get full name
const fullName = user => `${user.name.first} ${user.name.last}`;
```

### React Component

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('https://jsonlint.com/datasets/mock-users.json')
      .then(res => res.json())
      .then(data => setUsers(data.users));
  }, []);
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name.first} {user.name.last}
          <span className={user.active ? 'active' : 'inactive'}>
            {user.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Testing API Endpoints

```javascript
// Mock API for testing
app.get('/api/users', (req, res) => {
  const data = require('./mock-users.json');
  res.json(data.users);
});

app.get('/api/users/:id', (req, res) => {
  const data = require('./mock-users.json');
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).json({ error: 'Not found' });
});
```

## Use Cases

- **Prototype development** - Build UIs before the backend is ready
- **Unit testing** - Consistent test data for user-related features
- **Demo applications** - Realistic data for showcasing features
- **API mocking** - Stand-in data for development environments
- **Documentation** - Example payloads in API docs

## Related Datasets

- [Mock Products](/datasets/mock-products) - E-commerce test data
- [Countries](/datasets/countries) - Add location data to users
