import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const tickets = pgTable("tickets", {
	id: text("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	category: varchar("category", { length: 50 }).notNull(),
	priority: varchar("priority", { length: 50 }).notNull(),
	status: varchar("status", { length: 50 }).notNull().default("open"),
	assignedTo: varchar("assigned_to", { length: 255 }).notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});
