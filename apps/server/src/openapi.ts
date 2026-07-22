import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import {
	categoryEnum,
	priorityEnum,
	statusEnum,
} from "@ticket-app/api/schemas/ticket";
import { db, tickets } from "@ticket-app/db";

export const openapiRouter = new OpenAPIHono();

// 1. Definisikan Schema Zod (Bisa re-use yang sudah ada, tapi tambahkan openapi metadata)
const TicketSchema = z
	.object({
		id: z.string().openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		title: z.string().openapi({ example: "Fix printer in Lobby" }),
		category: categoryEnum.openapi({ example: "hardware" }),
		priority: priorityEnum.openapi({ example: "high" }),
		status: statusEnum.openapi({ example: "open" }),
		assignedTo: z.string().openapi({ example: "fathur" }),
		notes: z.string().nullable().openapi({ example: "The printer is jammed" }),
		createdAt: z
			.string()
			.or(z.number())
			.openapi({ example: "2024-03-24T12:00:00Z" }),
		updatedAt: z
			.string()
			.or(z.number())
			.openapi({ example: "2024-03-24T12:00:00Z" }),
	})
	.openapi("Ticket");

// 2. Buat Spesifikasi Route
const getTicketsRoute = createRoute({
	method: "get",
	path: "/api/tickets",
	tags: ["Tickets"],
	summary: "Get all tickets",
	description:
		"Retrieve a list of all IT tickets. Perfect for AI to read the current state.",
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.array(TicketSchema),
				},
			},
			description: "List of tickets",
		},
	},
});

// 3. Implementasi Handler (Tinggal copy/call logic yang ada)
openapiRouter.openapi(getTicketsRoute, async (c) => {
	const allTickets = await db.select().from(tickets);
	return c.json(allTickets as unknown as z.infer<typeof TicketSchema>[], 200);
});

// 4. Daftarkan spec openapi.json
openapiRouter.doc("/openapi.json", {
	openapi: "3.1.0",
	info: {
		title: "IT Ticket Dashboard API",
		version: "1.0.0",
		description: "API for managing IT Tickets. Designed for AI integration.",
	},
});

// 5. Daftarkan UI Scalar
openapiRouter.get(
	"/docs",
	apiReference({
		theme: "kepler",
		spec: {
			url: "/openapi.json",
		},
	}),
);
