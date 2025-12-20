## register and login and logout related endpoints 

### user registration

POST http://localhost:5000/api/user/register 
 
Header: Content-Type: application/json

request body... JSON
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "Password123"
}

Response....
Success (200): JSON body and session cookie set
{
  "message": "Registration successful",
  "user": { "email": "user@example.com", 
          "name": "User Name", 
          "role": "user" 
          }
}

Errors: 
(if email already registered)
400 - Email already registered

(on server error)
500 - Server error


### user login

POST http://localhost:5000/api/user/login

Header: Content-Type: application/json

request body... JSON
{
  "email": "user@example.com",
  "password": "Password123"
}

Responce: 
Success (200): JSON body and session cookie set.
{
  "message": "Login successful",
  "user": { "email": "user@example.com", 
          "name": "User Name", 
          "role": "user" 
          }
}

Errors:
 401 for invalid email/password
 500 on server error.


### admin login
URL: http://localhost:5000/api/admin/login
Method: POST

Headers:  Content-Type: application/json

Request Body: json

{
  "username": "admin",
  "password": "admin123"
}

Response (Success - 200):

{
  "message": "Login successful",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}

Errors:

401 - Invalid username/password
500 - Server error


### get current logged in user(User or Admin)

http://localhost:5000/api/me
Method :GET  

header: 
Cookie: medifarm_session=<session_id>

Response – Success (200)

{
  "user": {
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}

OR for Admin:

{
  "user": {
    "username": "admin",
    "role": "admin"
  }
}

Errors: 
401 Unauthorized - No active session


### Logout (User or Admin)

http://localhost:5000/api/logout
method: POST

Headers: Cookie: medifarm_session=<session_id>

Response – Success (200)

{
  "messege": "Logged out"
}

Errors:
401 - Unauthorized
500 - Logout failed

## session check - for testing 

### User Protected Route (Session Check) --for testing only

method: GET
http://localhost:5000/api/user/protected

Headers : Cookie: medifarm_session=<session_id>

Response – Success (200)
{
  "message": "Welcome User Name! You are authenticated.",
  "user": {
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
} 

Errors : 401 Unauthorized: No active session

### Admin Protected Route(Session check) -- for testting only

GET
http://localhost:5000/api/admin/protected

Headers: Cookie: medifarm_session=<session_id>

Response – Success (200)

{
  "message": "Welcome Admin admin! You are authenticated."
}

Errors: 
401 Unauthorized
403 Admins only

## public endpoints (not require user login)

### Public Product APIs -> Get All Products (Public)

GET
http://localhost:5000/api/public/products

Response – Success (200)

{
  "data": [
    {
      "med_id": "MEDabc123",
      "name": "Paracetamol",
      "description": "Pain relief tablet",
      "price": 20,
      "stock": 100,
      "category": "Medicine",
      "image": "image-url",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}

Errors:  500 Server error

### Get Product by med_id (Public)

GET
http://localhost:5000/api/public/products/:med_id

Example: http://localhost:5000/api/public/products/MEDabc123

Response – Success (200)

{
  "data": {
    "med_id": "MEDabc123",
    "name": "Paracetamol",
    "price": 20,
    "stock": 100,
    "category": "Medicine",
    "image": "image-url",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}

Errors : 
404 Product not found
500 Server error


## Admin Product Management APIs 
All routes below require admin login + session cookie

### Create Product (Admin)

POST
http://localhost:5000/api/admin/products

Headers: 

Content-Type: application/json
Cookie: medifarm_session=<session_id>

Request Body

{
  "name": "Aspirin",
  "description": "Pain relief",
  "price": 50,
  "stock": 200,
  "category": "Medicine",
  "image": "image-url"
}

Response – 

Success (201)

{
  "message": "Product created",
  "data": {
    "med_id": "MEDxyz456",
    "name": "Aspirin",
    "description": "Pain relief",
    "price": 50,
    "stock": 200,
    "category": "Medicine",
    "image": "image-url",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}

Errors : 

400 med_id already exists

401 Unauthorized

403 Admins only

500 Server error


### Update a Product by med_id (by Admin)

PUT
http://localhost:5000/api/admin/products/:med_id

Headers:
Content-Type: application/json
Cookie: medifarm_session=<session_id>

Request Body

{
  "price": 60,
  "stock": 150,
  "name": "Aspirin Extra"
}

Response – 

Success (200)

{
  "message": "Product updated",
  "data": {
    "med_id": "MEDxyz456",
    "name": "Aspirin Extra",
    "description": "Pain relief",
    "price": 60,
    "stock": 150,
    "category": "Medicine",
    "image": "image-url",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-02T10:00:00.000Z"
  }
}

Errors : 

404 Product not found

401 Unauthorized

403 Admins only

### Delete Product by med_id (by Admin)

DELETE 
http://localhost:5000/api/admin/products/:med_id

Example: http://localhost:5000/api/admin/products/MEDxyz456

Headers: Cookie: medifarm_session=<session_id>

Response – 

Success (200)

{
  "message": "Product deleted"
}

Errors : 

404 Product not found

401 Unauthorized

403 Admins only

500 - Server error

## Admin Order Management:

GET /api/admin/orders - Get all orders (query: ?status=, ?page=, ?limit=)

GET /api/admin/orders/:orderId - Get order details

PUT /api/admin/orders/:orderId/status - Update order status (body: { status, estimatedDelivery, cancellationReason })

PUT /api/admin/orders/:orderId/payment - Update payment status (body: { paymentStatus })

## User Cart and Order Managemnt 

### Cart operations

GET /api/user/cart - Get user's cart

POST /api/user/cart/add - Add item to cart (body: { productId, quantity })

PUT /api/user/cart/update/:productId - Update item quantity (body: { quantity })

DELETE /api/user/cart/remove/:productId - Remove item from cart

DELETE /api/user/cart/clear - Clear entire cart

### Order Operations:

POST /api/user/orders/place - Place order from cart (body: { shippingAddress, paymentMethod })

GET /api/user/orders - Get user's orders (query: ?status=)

GET /api/user/orders/:orderId - Get order details

PUT /api/user/orders/:orderId/cancel - Cancel order (body: { reason })