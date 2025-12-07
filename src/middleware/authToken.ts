import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: string; // userEmail from payload
}

export function authToken(req: AuthRequest, res: Response, next: NextFunction) {
	const authHeader = req.header("authorization");
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			success: false,
			error: "missing token",
		});
	}

	jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
		if (err) {
			return res.status(403).json({
				success: false,
				error: "invalid token",
			});
		}

		const payload = user as JwtPayload;

		req.user = payload.user;
		next();
	});
}
