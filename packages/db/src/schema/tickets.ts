import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tickets = sqliteTable("tickets", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	category: text("category").notNull(),
	priority: text("priority").notNull(),
	status: text("status").notNull().default("open"),
	assignedTo: text("assigned_to").notNull(),
	notes: text("notes"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});
