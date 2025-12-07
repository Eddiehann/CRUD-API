export type Priority = "low" | "medium" | "high";

export interface TodoItem {
	id: number;
	userEmail: string;
	priority: Priority;
	content: string;
}
