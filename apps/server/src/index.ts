import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@ticket-app/api/context";
import { appRouter } from "@ticket-app/api/routers/index";
import { env } from "@ticket-app/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { openapiRouter } from "./openapi.js";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
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

// Vercel deployment: Mount OpenAPI REST routes
app.route("/", openapiRouter);

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
