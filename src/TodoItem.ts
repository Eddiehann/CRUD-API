export type Priority = "low" | "medium" | "high";

export interface TodoItem {
	id: number;
	ownerId: string;
    priority: Priority;
	content: string;
}