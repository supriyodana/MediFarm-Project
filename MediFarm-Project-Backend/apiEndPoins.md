## register and login and logout related endpoints 

### user registration

POST http://localhost:5000/api/user/register 

example 
Header : Content-Type: application/json
request body... JSON
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "yourPassword123"
}

Response....
Success (200): JSON body and session cookie set
{
  "message": "Registration successful",
  "user": { "email": "user@example.com", "name": "User Name", "role": "user" }
}

Errors: 400 if email already registered; 500 on server error.


### user login

POST http://localhost:5000/api/user/login

Header : Content-Type: application/json
request body... JSON
{
  "email": "user@example.com",
  "password": "yourPassword123"
}

Responce: 
Success (200): JSON body and session cookie set.
{
  "message": "Login successful",
  "user": { "email": "user@example.com", "name": "User Name", "role": "user" }
}

Errors: 401 for invalid email/password; 500 on server error.


### admin login
URL: http://localhost:5000/api/admin/login
Method: POST
Headers:  Content-Type: application/json
Body (raw → JSON):  {"username":"admin","password":"admin123"}

Send the request. Successful response (200):
{"message":"Login successful","user":{"username":"admin","role":"admin"}}
On failure you may get 401 with {"error":"Invalid username"} or {"error":"Invalid password"} or 500 for server errors.


### get current logged in user 

http://localhost:5000/api/me
Method :GET  

header : Cookie: medifarm_session=<session_id>

Response – Success (200)

{
  "user": {
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}

Errors : 401 Unauthorized → No active session


### Logout (User or Admin)

http://localhost:5000/api/logout
method: POST

Headers: Cookie: medifarm_session=<session_id>

Response – Success (200)

{
  "messege": "Logged out"
}

Errors

401 Unauthorized

500 Logout failed

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
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}

Errors:  500 Server error

### Get Product by med_id (Public)

GET
http://localhost:5000/api/public/products/:med_id

Response – Success (200)

{
  "data": {
    "med_id": "MEDabc123",
    "name": "Paracetamol",
    "price": 20,
    "stock": 100
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
    "name": "Aspirin"
  }
}

Errors : 

400 med_id already present/registered

401 Unauthorized

403 Admins only

500 Server error


### Update a Product by med_id (by Admin)

PUT
http://localhost:5000/api/admin/products/:med_id

Request Body

{
  "price": 60,
  "stock": 150
}

Response – 

Success (200)

{
  "message": "Product updated",
  "data": {
    "med_id": "MEDxyz456",
    "price": 60,
    "stock": 150
  }
}

Errors : 

404 Product not found

401 Unauthorized

403 Admins only

### Delete Product by med_id (by Admin)

DELETE 
http://localhost:5000/api/admin/products/:med_id

Response – 

Success (200)

{
  "message": "Product deleted"
}

Errors : 

404 Product not found

401 Unauthorized

403 Admins only

