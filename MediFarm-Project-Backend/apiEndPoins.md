
### user registration and login

POST http://localhost:5000/api/user/register 

example request body... JSON
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

JSON example(request body)
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


#### admin login
URL: http://localhost:5000/api/admin/login
Method: POST
Headers:  Content-Type: application/json
Body (raw → JSON):  {"username":"admin","password":"admin123"}

Send the request. Successful response (200):
{"message":"Login successful","user":{"username":"admin","role":"admin"}}
On failure you may get 401 with {"error":"Invalid username"} or {"error":"Invalid password"} or 500 for server errors.