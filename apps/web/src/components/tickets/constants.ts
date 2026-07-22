export const CATEGORIES = [
	"hardware",
	"software",
	"network",
	"access",
	"other",
] as const;

export const PRIORITIES = ["low", "medium", "high"] as const;
export const STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];

export type Ticket = {
	id: string;
	title: string;
	category: string;
	priority: string;
	status: string;
	assignedTo: string;
	notes: string | null;
	createdAt: Date | string | number;
	updatedAt: Date | string | number;
};

export const CATEGORY_LABELS: Record<Category, string> = {
	hardware: "Hardware",
	software: "Software",
	network: "Network",
	access: "Access",
	other: "Other",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
};

export const STATUS_LABELS: Record<Status, string> = {
	open: "Open",
	in_progress: "In Progress",
	resolved: "Resolved",
	closed: "Closed",
};

export function formatDate(value: Date | string | number) {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
