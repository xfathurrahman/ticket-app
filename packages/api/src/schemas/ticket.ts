import { z } from "zod";

export const categoryEnum = z.enum([
	"hardware",
	"software",
	"network",
	"access",
	"other",
]);
export const priorityEnum = z.enum(["low", "medium", "high"]);
export const statusEnum = z.enum(["open", "in_progress", "resolved", "closed"]);

export const filterInput = z.object({
	search: z.string().optional(),
	status: statusEnum.optional(),
	priority: priorityEnum.optional(),
});

export const listInput = filterInput.extend({
	sortBy: z.enum(["createdAt", "priority", "status"]).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
});

export const createTicketInput = z.object({
	title: z.string().trim().min(1),
	category: categoryEnum,
	priority: priorityEnum,
	status: statusEnum.optional(),
	assignedTo: z.string().trim().min(1),
	notes: z.string().optional(),
});

export const updateTicketInput = z.object({
	id: z.string().min(1),
	title: z.string().trim().min(1).optional(),
	category: categoryEnum.optional(),
	priority: priorityEnum.optional(),
	status: statusEnum.optional(),
	assignedTo: z.string().trim().min(1).optional(),
	notes: z.string().nullable().optional(),
});

export const deleteTicketInput = z.object({
	id: z.string().min(1),
});

export type Category = z.infer<typeof categoryEnum>;
export type Priority = z.infer<typeof priorityEnum>;
export type Status = z.infer<typeof statusEnum>;
