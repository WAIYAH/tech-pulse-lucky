# REST APIs: Building Robust Web Services

REST (Representational State Transfer) APIs have become the standard for building web services and enabling communication between applications. Whether you're building a mobile app, integrating third-party services, or creating a backend for a web application, understanding REST API design and development is essential. This guide covers REST principles, best practices, and implementation strategies.

## What is REST?

REST is an architectural style for designing networked applications. It uses HTTP protocols and standard methods to create scalable, stateless web services that can be consumed by any client (web browsers, mobile apps, other servers).

### REST Principles

**Client-Server Architecture:** Clients and servers are separate, communicating through HTTP. Each can evolve independently.

**Statelessness:** Server doesn't store client context. Each request contains all information needed. Enables horizontal scaling.

**Uniform Interface:** Consistent way to communicate with APIs:
- Resources identified by URIs
- Manipulation of resources through standard HTTP methods
- Standard response format (usually JSON)

**Cacheability:** Responses marked as cacheable or non-cacheable. Improves performance.

**Layered System:** Client can't tell if connected directly to end server. Enables load balancers, proxies, middleware.

**Code on Demand (Optional):** Server can extend client functionality by sending executable code (JavaScript, etc.).

## RESTful API Fundamentals

### Resources and URIs

Everything in REST is a resource: users, products, orders, comments. Resources identified by URIs (Uniform Resource Identifiers).

```
Good URIs (resource-oriented):
/users
/users/123
/users/123/orders
/products
/products/456/reviews

Bad URIs (action-oriented):
/getUserById?id=123
/getProductReviews
/addNewComment
/deleteUser
```

Guidelines for URIs:
- Use nouns, not verbs (verbs come from HTTP methods)
- Use plural nouns for collections
- Use forward slashes for hierarchies
- Use lowercase
- Use hyphens to separate words (user-profiles not user_profiles)

### HTTP Methods (Verbs)

HTTP methods define what action to perform on resources.

**GET:** Retrieve resource(s). Should be safe and idempotent (no side effects).

```
GET /users - List all users
GET /users/123 - Get specific user
```

**POST:** Create new resource. Not idempotent (multiple requests create multiple resources).

```
POST /users - Create new user
Request body: { "name": "John", "email": "john@example.com" }
Response: 201 Created with new user ID
```

**PUT:** Replace entire resource. Idempotent (same request produces same result).

```
PUT /users/123 - Replace user 123
Request body: { "name": "John Updated", "email": "john@example.com" }
Response: 200 OK with updated resource
```

**PATCH:** Partially update resource. Idempotent.

```
PATCH /users/123 - Update specific fields
Request body: { "name": "John Updated" }
Response: 200 OK with updated resource
```

**DELETE:** Remove resource. Idempotent.

```
DELETE /users/123 - Delete user 123
Response: 204 No Content
```

**HEAD:** Like GET but returns headers only (no body). Check resource existence/size.

```
HEAD /users/123 - Check if user exists
```

**OPTIONS:** Describe communication options for resource.

```
OPTIONS /users - What methods are allowed?
Response headers: Allow: GET, POST, PUT, PATCH, DELETE
```

## API Response Format

### Status Codes

Inform client about request result:

**2xx Success:**
- 200 OK: Successful GET, PUT, PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE, no body to return

**3xx Redirection:**
- 301 Moved Permanently: Resource moved to new location
- 304 Not Modified: Cached response is still valid

**4xx Client Error:**
- 400 Bad Request: Invalid request format
- 401 Unauthorized: Authentication required
- 403 Forbidden: Authenticated but no permission
- 404 Not Found: Resource doesn't exist
- 409 Conflict: Request conflicts with current state

**5xx Server Error:**
- 500 Internal Server Error: Unexpected error
- 503 Service Unavailable: Server temporarily unavailable

### Response Body

Always return JSON with consistent structure:

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2025-01-28T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {
      "field": "email",
      "reason": "Required field missing"
    }
  },
  "timestamp": "2025-01-28T10:30:00Z"
}
```

## API Versioning

APIs evolve over time. Versioning prevents breaking existing clients.

### Versioning Strategies

**URL Path Versioning (Most Common):**
```
/api/v1/users
/api/v2/users
```

**Query Parameter:**
```
/api/users?version=1
/api/users?version=2
```

**Header-based:**
```
GET /api/users
Accept: application/vnd.api+json;version=1
```

## Authentication and Authorization

### Authentication (Who are you?)

**API Keys:** Simple, but less secure. Token in header or query parameter.

```javascript
fetch('/api/users', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
})
```

**OAuth 2.0:** Industry standard for secure authentication/delegation.

```javascript
// User logs in through third-party
// App receives access token
// Use token for subsequent requests
fetch('/api/users', {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
})
```

**JWT (JSON Web Token):** Self-contained tokens with encoded information.

```
Header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
Payload: eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
Signature: SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Authorization (What can you do?)

**Role-Based Access Control (RBAC):**
```
/admin/users - Only admin role
/profile - Any authenticated user
/public/products - Anyone
```

## Building APIs: Common Frameworks

### Node.js/Express

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// GET - List users
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ];
  res.json({ success: true, data: users });
});

// POST - Create user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: { message: 'Name and email required' }
    });
  }
  
  const newUser = { id: 3, name, email };
  res.status(201).json({ success: true, data: newUser });
});

// PUT - Update user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = { id: parseInt(id), ...req.body };
  res.json({ success: true, data: updatedUser });
});

// DELETE - Delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on :3000'));
```

### Python/Flask

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

users = [
    {'id': 1, 'name': 'John', 'email': 'john@example.com'},
    {'id': 2, 'name': 'Jane', 'email': 'jane@example.com'}
]

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({'success': True, 'data': users})

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'success': False, 'error': {'message': 'Name and email required'}}), 400
    
    new_user = {'id': len(users) + 1, **data}
    users.append(new_user)
    return jsonify({'success': True, 'data': new_user}), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'success': False, 'error': {'message': 'User not found'}}), 404
    
    user.update(request.get_json())
    return jsonify({'success': True, 'data': user})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

### Java/Spring Boot

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public ResponseEntity<?> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse(true, users));
    }
    
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest request) {
        if (request.getName() == null || request.getEmail() == null) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Name and email required"));
        }
        
        User newUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse(true, newUser));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
        @PathVariable Long id,
        @RequestBody UserRequest request
    ) {
        User updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(new ApiResponse(true, updatedUser));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

## Advanced API Features

### Pagination

Handle large result sets efficiently:

```
GET /api/users?page=1&limit=20
GET /api/users?skip=0&take=20
GET /api/users?offset=0&limit=20

Response headers:
X-Total-Count: 1000
X-Page: 1
X-Page-Size: 20
```

### Filtering and Searching

```
GET /api/products?category=electronics
GET /api/products?price_min=100&price_max=500
GET /api/users?search=john
GET /api/orders?status=pending&date_from=2025-01-01
```

### Sorting

```
GET /api/products?sort=price:asc
GET /api/users?sort=-created_at (descending)
GET /api/orders?sort=date:desc,total:asc (multiple)
```

### Rate Limiting

Prevent abuse by limiting requests:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## API Documentation

Well-documented APIs are easier to use and maintain.

### OpenAPI/Swagger

Standard for documenting REST APIs:

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: List all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
```

Tools like Swagger UI and Redoc generate interactive documentation from OpenAPI specs.

## API Security Best Practices

**Use HTTPS:** Always encrypt transmission with SSL/TLS

**Validate Input:** Reject invalid requests immediately

**Rate Limiting:** Prevent abuse and DDoS attacks

**CORS (Cross-Origin Resource Sharing):** Control which origins can access API

```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
```

**API Keys/Tokens:** Rotate regularly, never commit to code

**Logging and Monitoring:** Track API usage, errors, and security events

**Error Messages:** Don't expose sensitive information in errors

## Testing APIs

### Manual Testing

Use tools like Postman or curl:

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

### Automated Testing

Write tests for API endpoints:

```javascript
describe('User API', () => {
  it('should create user', async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'John', email: 'john@example.com' })
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('John');
  });
});
```

## Conclusion

REST APIs are the backbone of modern web development. Master resource-oriented design, understand HTTP methods deeply, implement proper error handling, and prioritize security and documentation. Start building simple CRUD APIs and gradually add advanced features like pagination, filtering, and authentication. A well-designed REST API provides a clear contract between client and server, scales reliably, and creates excellent developer experience. Invest time in API design and documentation—it pays dividends in maintainability and adoption.
