import { publicProcedure, router } from "../index";
import { ticketsRouter } from "./tickets";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	tickets: ticketsRouter,
});
export type AppRouter = typeof appRouter;
