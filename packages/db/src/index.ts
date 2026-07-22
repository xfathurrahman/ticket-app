import { env } from "@ticket-app/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export function createDb() {
	const queryClient = postgres(env.DATABASE_URL);
	return drizzle(queryClient, { schema });
}

export const db = createDb();
export { eq } from "drizzle-orm";
export { tickets } from "./schema";
