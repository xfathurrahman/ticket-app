import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { Priority, Status } from "@/components/tickets/constants";
import { StatsCards } from "@/components/tickets/stats-cards";
import { TicketList } from "@/components/tickets/ticket-list";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

function DashboardPage() {
	const [search] = useState("");
	const [status] = useState<Status | "all">("all");
	const [priority] = useState<Priority | "all">("all");
	const [sortBy] = useState<"createdAt" | "priority" | "status">("createdAt");
	const [sortDir] = useState<"asc" | "desc">("desc");

	const filter = useMemo(
		() => ({
			search: search.trim() || undefined,
			status: status === "all" ? undefined : status,
			priority: priority === "all" ? undefined : priority,
		}),
		[search, status, priority],
	);

	const listQuery = useQuery(
		trpc.tickets.list.queryOptions({
			...filter,
			sortBy,
			sortDir,
		}),
	);

	const statsQuery = useQuery(trpc.tickets.stats.queryOptions(filter));

	return (
		<div className="container mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-semibold text-xl tracking-tight">
					IT Ticket Dashboard
				</h1>
				<p className="text-muted-foreground text-sm">
					Track and manage internal IT support tickets.
				</p>
			</div>

			<StatsCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />

			<TicketList tickets={listQuery.data} isLoading={listQuery.isLoading} />
		</div>
	);
}
