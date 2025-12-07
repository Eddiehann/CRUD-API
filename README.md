# Todo CRUD API

A simple Node.js + TypeScript REST API that supports user authentication and basic CRUD operations for todo list items.
Data is stored in in-memory arrays to simulatate a DB layer.

## Server

Start the server with:

```
npm start
```

## Endpoints

| Method | Endpoint     | Description                        | Auth Required |
| ------ | ------------ | ---------------------------------- | ------------- |
| POST   | /users       | Register a new user                | No            |
| POST   | /users/login | Log in to an existing account      | No            |
| POST   | /todos       | Create a new todo item             | Yes           |
| GET    | /todos       | Get all todos (optional filters)   | Yes           |
| PUT    | /todos/:id   | Update a todo (ownership required) | Yes           |
| DELETE | /todos/:id   | Delete a todo (ownership required) | Yes           |
