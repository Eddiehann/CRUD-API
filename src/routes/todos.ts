import { Router, Request, Response } from "express";
import { Priority, TodoItem } from "../models/TodoItem";
import { authToken, AuthRequest } from "../middleware/authToken";

const router = Router();

// simple in memory storage
const todoList: TodoItem[] = [];
let nextTodoId = 1;

function createTodo(
	userEmail: string,
	priority: Priority,
	content: string
): TodoItem {
	return {
		id: nextTodoId++,
		userEmail,
		priority,
		content,
	};
}

function isValidPriority(priority: any): priority is Priority {
	return (
		typeof priority === "string" &&
		(priority === "low" || priority === "medium" || priority === "high")
	);
}

// CRUD api
// GET /todos?priority=low|medium|high&userEmail=user@gmail.com
router.get("/", authToken, (req: AuthRequest, res: Response) => {
	try {
		const { priority, userEmail } = req.query;
		let todos = todoList;

		// allow for filtering by priority/owner
		if (isValidPriority(priority))
			todos = todos.filter((t) => t.priority === priority);
		if (typeof userEmail === "string")
			todos = todos.filter((t) => t.userEmail === userEmail);

		res.json({
			success: true,
			data: todos,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
});

// POST /todos
router.post("/", authToken, (req: AuthRequest, res: Response) => {
	try {
		const { priority, content } = req.body;

		if (!isValidPriority(priority)) {
			return res.status(400).json({
				success: false,
				error: "missing or invalid priority",
			});
		}

		if (!content || typeof content !== "string") {
			return res.status(400).json({
				success: false,
				error: "missing or invalid content",
			});
		}

		const todo = createTodo(req.user!, priority, content);
		todoList.push(todo);
		res.json({
			success: true,
			data: todo,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
});

// PUT /todos/:id
router.put("/:id", authToken, (req: AuthRequest, res: Response) => {
	try {
		const todo = todoList.find((t) => t.id === Number(req.params.id));

		if (!todo) {
			return res.status(404).json({
				success: false,
				error: "todo not found",
			});
		}

		// ownership authentication
		if (!req.user || req.user !== todo.userEmail) {
			return res.status(401).json({
				success: false,
				error: "unauthorized",
			});
		}

		const { priority, content } = req.body;

		// optional
		if (priority) {
			if (isValidPriority(priority)) todo.priority = priority;
			else {
				return res.status(400).json({
					success: false,
					error: "invalid priority",
				});
			}
		}

		// optional
		if (content) {
			if (typeof content !== "string") {
				return res.status(400).json({
					success: false,
					error: "invalid content",
				});
			}
			todo.content = content;
		}

		res.json({
			success: true,
			data: todo,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
});

// DELETE /todos/:id
router.delete("/:id", authToken, (req: AuthRequest, res: Response) => {
	try {
		const indexToRemove = todoList.findIndex(
			(t) => t.id === Number(req.params.id)
		);

		if (indexToRemove === -1) {
			return res.status(404).json({
				success: false,
				error: "todo not found",
			});
		}

		// ownership authentication
		if (!req.user || req.user !== todoList[indexToRemove].userEmail) {
			return res.status(401).json({
				success: false,
				error: "unauthorized",
			});
		}

		todoList.splice(indexToRemove, 1);
		res.json({
			success: true,
			data: todoList,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
});

export default router;
