import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import usersRouter from "./routes/users";
import todosRouter from "./routes/todos";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/todos", todosRouter);

// GET /
app.get("/", (req: Request, res: Response) => {
	res.send("Server running");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
