# Todo CRUD API

A simple Node.js + TypeScript API that supports user login and basic CRUD operations for todo items. 
Data is stored in memory instead of a DB layer.

## Server

Start the server with:
```
npm start
```

## Endpoints

| Method | Endpoint     | Description                        | Auth Required |
|--------|--------------|------------------------------------|---------------|
| POST   | /users       | Register a new user                | No            |
| POST   | /users/login | Log in to existing account         | No            |
| POST   | /todos       | Create a new todo item             | Yes           |
| GET    | /todos       | Get all todos (optional filters)   | No            |
| PUT    | /todos/:id   | Update a todo (requires ownership) | Yes           |
| DELETE | /todos/:id   | Delete a todo (requires ownership) | Yes           |
