import { trpcServer } from "@hono/trpc-server";
// OpenAPI imports
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createContext } from "@ticket-app/api/context";
import { appRouter } from "@ticket-app/api/routers/index";
import {
	categoryEnum,
	priorityEnum,
	statusEnum,
} from "@ticket-app/api/schemas/ticket";
import { db, eq, tickets } from "@ticket-app/db";
import { env } from "@ticket-app/env/server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new OpenAPIHono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	}),
);

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

// --- OpenAPI Schemas ---
const TicketSchema = z
	.object({
		id: z.string().openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		title: z.string().openapi({ example: "Fix printer in Lobby" }),
		category: categoryEnum,
		priority: priorityEnum,
		status: statusEnum,
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

const CreateTicketSchema = z
	.object({
		title: z.string().openapi({ example: "Fix printer in Lobby" }),
		category: categoryEnum,
		priority: priorityEnum,
		status: statusEnum.optional(),
		assignedTo: z.string().openapi({ example: "fathur" }),
		notes: z.string().optional().openapi({ example: "Paper jam on tray 2" }),
	})
	.openapi("CreateTicket");

const UpdateTicketSchema = CreateTicketSchema.partial().openapi("UpdateTicket");

const ErrorSchema = z
	.object({
		error: z.string().openapi({ example: "Ticket not found" }),
	})
	.openapi("ErrorResponse");

// --- OpenAPI Routes Specs ---
const getTicketsRoute = createRoute({
	method: "get",
	path: "/tickets",
	tags: ["Tickets"],
	summary: "List all tickets",
	description: "Retrieve a list of all IT tickets.",
	responses: {
		200: {
			content: { "application/json": { schema: z.array(TicketSchema) } },
			description: "List of tickets",
		},
	},
});

const createTicketRoute = createRoute({
	method: "post",
	path: "/tickets",
	tags: ["Tickets"],
	summary: "Create a ticket",
	description: "Create a new IT ticket.",
	request: {
		body: {
			content: { "application/json": { schema: CreateTicketSchema } },
		},
	},
	responses: {
		201: {
			content: { "application/json": { schema: TicketSchema } },
			description: "The created ticket",
		},
	},
});

const updateTicketRoute = createRoute({
	method: "patch",
	path: "/tickets/{id}",
	tags: ["Tickets"],
	summary: "Update a ticket",
	description: "Update an existing IT ticket by ID.",
	request: {
		params: z.object({
			id: z
				.string()
				.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		}),
		body: {
			content: { "application/json": { schema: UpdateTicketSchema } },
		},
	},
	responses: {
		200: {
			content: { "application/json": { schema: TicketSchema } },
			description: "The updated ticket",
		},
		404: {
			content: { "application/json": { schema: ErrorSchema } },
			description: "Ticket not found",
		},
	},
});

const deleteTicketRoute = createRoute({
	method: "delete",
	path: "/tickets/{id}",
	tags: ["Tickets"],
	summary: "Delete a ticket",
	description: "Delete an existing IT ticket by ID.",
	request: {
		params: z.object({
			id: z
				.string()
				.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.object({ ok: z.boolean().openapi({ example: true }) }),
				},
			},
			description: "Delete confirmation",
		},
		404: {
			content: { "application/json": { schema: ErrorSchema } },
			description: "Ticket not found",
		},
	},
});

// --- Handlers ---
app.openapi(getTicketsRoute, async (c) => {
	const allTickets = await db.select().from(tickets);
	return c.json(allTickets as unknown as z.infer<typeof TicketSchema>[], 200);
});

app.openapi(createTicketRoute, async (c) => {
	const body = c.req.valid("json");
	const id = crypto.randomUUID();
	const [row] = await db
		.insert(tickets)
		.values({
			id,
			title: body.title,
			category: body.category,
			priority: body.priority,
			status: body.status ?? "open",
			assignedTo: body.assignedTo,
			notes: body.notes?.trim() ? body.notes.trim() : null,
		})
		.returning();

	return c.json(row as unknown as z.infer<typeof TicketSchema>, 201);
});

app.openapi(updateTicketRoute, async (c) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	const patch: Partial<typeof tickets.$inferInsert> = {
		updatedAt: new Date(),
	};
	if (body.title !== undefined) patch.title = body.title;
	if (body.category !== undefined) patch.category = body.category;
	if (body.priority !== undefined) patch.priority = body.priority;
	if (body.status !== undefined) patch.status = body.status;
	if (body.assignedTo !== undefined) patch.assignedTo = body.assignedTo;
	if (body.notes !== undefined)
		patch.notes = body.notes?.trim() ? body.notes.trim() : null;

	const [row] = await db
		.update(tickets)
		.set(patch)
		.where(eq(tickets.id, id))
		.returning();

	if (!row) {
		return c.json({ error: "Ticket not found" }, 404);
	}
	return c.json(row as unknown as z.infer<typeof TicketSchema>, 200);
});

app.openapi(deleteTicketRoute, async (c) => {
	const { id } = c.req.valid("param");
	const [row] = await db
		.delete(tickets)
		.where(eq(tickets.id, id))
		.returning({ id: tickets.id });

	if (!row) {
		return c.json({ error: "Ticket not found" }, 404);
	}
	return c.json({ ok: true }, 200);
});

// --- UI & Spec ---
// Docs live at public /docs (not under /api) — HTML UI, not an API endpoint.
// REST/tRPC still go through /api/*; Vite/Vercel strip that prefix before Hono.
app.doc("/openapi.json", {
	openapi: "3.1.0",
	info: {
		title: "IT Ticket API",
		version: "1.0.0",
		description:
			"API for managing IT Tickets. Designed for AI integration and external clients.",
	},
	servers: [
		{
			url: "/api",
			description: "Public API (Vite proxy / Vercel)",
		},
		{
			url: "/",
			description: "Direct server (localhost:3000)",
		},
	],
});

// Absolute /openapi.json so Scalar works at public /docs (not nested under /api/docs)
app.get(
	"/docs",
	Scalar({
		url: "/openapi.json",
		theme: "kepler",
		pageTitle: "IT Ticket API",
	}),
);

export default app;
