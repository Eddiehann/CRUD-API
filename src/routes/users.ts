import { Router, Request, Response } from "express";
import { User } from "../models/User";

const router = Router();

// simple in memory storage
const users: User[] = [];

// user creation
// POST /users
router.post("/", (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || typeof email !== "string") {
			return res.status(400).json({
				success: false,
				error: "missing or invalid email",
			});
		}

		if (!password || typeof password !== "string") {
			return res.status(400).json({
				success: false,
				error: "missing or invalid password",
			});
		}

		// password encryption is omitted for the scope of this exercise
		const user = { email, password };
		users.push(user);
		res.json({
			success: true,
			data: user.email,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
});

// login endpoint
// POST /users/login
router.post("/login", (req: Request, res: Response) => {
	try {
		const user = users.find((u) => u.email === req.body.email);

		if (!user) {
			return res.status(404).json({
				success: false,
				error: "user not found",
			});
		}

		if (user.password === req.body.password) {
			res.json({
				success: true,
				data: user.email,
			});
		} else {
			res.status(401).json({
				success: false,
				error: "invalid password",
			});
		}
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
});

export default router;
