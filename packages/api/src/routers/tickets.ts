import { db, tickets } from "@ticket-app/db";
import { TRPCError } from "@trpc/server";
import { and, asc, count, desc, eq, or, type SQL, sql } from "drizzle-orm";

import { publicProcedure, router } from "../index";
import {
	createTicketInput,
	deleteTicketInput,
	filterInput,
	listInput,
	updateTicketInput,
} from "../schemas/ticket";

function buildWhere(input: {
	search?: string;
	status?: string;
	priority?: string;
}): SQL | undefined {
	const parts: SQL[] = [];
	const search = input.search?.trim();
	if (search) {
		const pattern = `%${search.toLowerCase()}%`;
		const searchClause = or(
			sql`lower(${tickets.title}) like ${pattern}`,
			sql`lower(${tickets.assignedTo}) like ${pattern}`,
			sql`lower(coalesce(${tickets.notes}, '')) like ${pattern}`,
		);
		if (searchClause) parts.push(searchClause);
	}
	if (input.status) {
		parts.push(eq(tickets.status, input.status));
	}
	if (input.priority) {
		parts.push(eq(tickets.priority, input.priority));
	}
	if (parts.length === 0) return undefined;
	if (parts.length === 1) return parts[0];
	return and(...parts);
}

const priorityRank = sql`case ${tickets.priority}
  when 'high' then 0
  when 'medium' then 1
  when 'low' then 2
  else 3 end`;

const statusRank = sql`case ${tickets.status}
  when 'open' then 0
  when 'in_progress' then 1
  when 'resolved' then 2
  when 'closed' then 3
  else 4 end`;

export const ticketsRouter = router({
	list: publicProcedure
		.input(listInput.optional().default({}))
		.query(async ({ input }) => {
			const where = buildWhere(input);
			const sortBy = input.sortBy ?? "createdAt";
			const sortDir = input.sortDir ?? (sortBy === "priority" ? "asc" : "desc");
			const dir = sortDir === "asc" ? asc : desc;

			const orderBy =
				sortBy === "priority"
					? dir(priorityRank)
					: sortBy === "status"
						? dir(statusRank)
						: dir(tickets.createdAt);

			return db.select().from(tickets).where(where).orderBy(orderBy);
		}),

	stats: publicProcedure
		.input(filterInput.optional().default({}))
		.query(async ({ input }) => {
			const where = buildWhere(input);
			const [row] = await db
				.select({
					total: count(),
					open: sql<number>`sum(case when ${tickets.status} = 'open' then 1 else 0 end)`,
					inProgress: sql<number>`sum(case when ${tickets.status} = 'in_progress' then 1 else 0 end)`,
					highPriority: sql<number>`sum(case when ${tickets.priority} = 'high' then 1 else 0 end)`,
				})
				.from(tickets)
				.where(where);

			return {
				total: Number(row?.total ?? 0),
				open: Number(row?.open ?? 0),
				inProgress: Number(row?.inProgress ?? 0),
				highPriority: Number(row?.highPriority ?? 0),
			};
		}),

	create: publicProcedure
		.input(createTicketInput)
		.mutation(async ({ input }) => {
			const id = crypto.randomUUID();
			const notes = input.notes?.trim() ? input.notes.trim() : null;
			const [row] = await db
				.insert(tickets)
				.values({
					id,
					title: input.title,
					category: input.category,
					priority: input.priority,
					status: input.status ?? "open",
					assignedTo: input.assignedTo,
					notes,
				})
				.returning();
			return row;
		}),

	update: publicProcedure
		.input(updateTicketInput)
		.mutation(async ({ input }) => {
			const { id, ...rest } = input;
			const patch: Partial<typeof tickets.$inferInsert> = {
				updatedAt: new Date(),
			};

			if (rest.title !== undefined) patch.title = rest.title;
			if (rest.category !== undefined) patch.category = rest.category;
			if (rest.priority !== undefined) patch.priority = rest.priority;
			if (rest.status !== undefined) patch.status = rest.status;
			if (rest.assignedTo !== undefined) patch.assignedTo = rest.assignedTo;
			if (rest.notes !== undefined) {
				patch.notes = rest.notes?.trim() ? rest.notes.trim() : null;
			}

			const fieldKeys = Object.keys(rest).filter(
				(k) => rest[k as keyof typeof rest] !== undefined,
			);
			if (fieldKeys.length === 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "No fields to update",
				});
			}

			const [row] = await db
				.update(tickets)
				.set(patch)
				.where(eq(tickets.id, id))
				.returning();

			if (!row) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
			}
			return row;
		}),

	delete: publicProcedure
		.input(deleteTicketInput)
		.mutation(async ({ input }) => {
			const [row] = await db
				.delete(tickets)
				.where(eq(tickets.id, input.id))
				.returning({ id: tickets.id });

			if (!row) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
			}
			return { ok: true as const };
		}),
});
