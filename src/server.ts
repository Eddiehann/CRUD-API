import express, { Request, Response } from "express";
import { Priority, TodoItem } from "./TodoItem"
const app = express();
const PORT = 3000;

app.use(express.json());

// simple in memory storage
const todoList: TodoItem[] = [];
let nextTodoId = 1;

function createTodo(ownerId: string, priority: Priority, content: string): TodoItem {
	return {
		id: nextTodoId++,
		ownerId,
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

// GET /
app.get("/", (req: Request, res: Response) => {
    res.send("Server running");
})

// GET /todos?priority=low|medium|high&ownerId=user1
app.get("/todos", (req: Request, res: Response) => {
    try {
        const { priority, ownerId } = req.query;

        let todos = todoList;

        // allow for filtering by priority/owner
        if (isValidPriority(priority)) todos = todos.filter((t) => t.priority === priority);
        if (typeof ownerId === "string") todos = todos.filter((t) => t.ownerId === ownerId);

        res.json({ 
            success: true,  
            data: todos
        });
    } catch (err) {
		res.status(500).json({
            success: false,  
            error: err.message 
        });
	}
})

// POST /todos
app.post("/todos", (req: Request, res: Response) => {
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
        
        const ownerId = "user1"; // placeholder
        
        const todo = createTodo(ownerId, priority, content);
		todoList.push(todo)
        res.json({ 
            success: true,  
            data: todo
        });
	} catch (err) {
		res.status(500).json({
            success: false,  
            error: err.message 
        });
	}
})

// PUT /todos/:id
app.put("/todos/:id", (req: Request, res: Response) => {
	try {
		const todo = todoList.find((t) => t.id === Number(req.params.id));
		
        if (!todo) {
			return res.status(404).json({
                success: false,
                error: "todo not found"
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
            data: todo
        });
	} catch (err: any) {
		res.status(500).json({
            success: false,  
            error: err.message 
        });
	}
});

// DELETE /todos/:id
app.delete("/todos/:id", (req: Request, res: Response) => {
	try {
		const indexToRemove = todoList.findIndex((t) => t.id === Number(req.params.id));
		
        if (indexToRemove === -1) {
			return res.status(404).json({
                success: false, 
                error: "todo not found" 
            });
		}

		todoList.splice(indexToRemove, 1);
		res.json({ 
            success: true,  
            data: todoList
        });
	} catch (err) {
		res.status(500).json({
            success: false,  
            error: err.message 
        });
	}
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});