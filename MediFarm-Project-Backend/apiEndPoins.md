
URL: http://localhost:5000/api/admin/login
Method: POST
Headers:  Content-Type: application/json
Body (raw → JSON):  {"username":"admin","password":"admin123"}

Send the request. Successful response (200):
{"message":"Login successful","user":{"username":"admin","role":"admin"}}
On failure you may get 401 with {"error":"Invalid username"} or {"error":"Invalid password"} or 500 for server errors.