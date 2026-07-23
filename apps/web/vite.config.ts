import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 3001,
		proxy: {
			// API surface — strip /api so Hono sees /trpc, /tickets, etc.
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			// Docs UI + OpenAPI spec are not API routes; serve as top-level paths
			"/docs": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
			"/openapi.json": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		tailwindcss(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
	],
});
