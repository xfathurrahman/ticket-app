import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@ticket-app/ui/components/button";
import { Input } from "@ticket-app/ui/components/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ticket-app/ui/components/select";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	PRIORITIES,
	PRIORITY_LABELS,
	type Priority,
	STATUS_LABELS,
	STATUSES,
	type Status,
	type Ticket,
} from "@/components/tickets/constants";
import { StatsCards } from "@/components/tickets/stats-cards";
import { TicketFormDialog } from "@/components/tickets/ticket-form-dialog";
import { TicketList } from "@/components/tickets/ticket-list";
import { queryClient, trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

const statusFilterItems = [
	{ label: "All Statuses", value: "all" },
	...STATUSES.map((s) => ({ label: STATUS_LABELS[s], value: s })),
];

const priorityFilterItems = [
	{ label: "All Priorities", value: "all" },
	...PRIORITIES.map((p) => ({ label: PRIORITY_LABELS[p], value: p })),
];

const sortItems = [
	{ label: "Date Created", value: "createdAt" },
	{ label: "Priority", value: "priority" },
	{ label: "Status", value: "status" },
];

function DashboardPage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<Status | "all">("all");
	const [priority, setPriority] = useState<Priority | "all">("all");
	const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "status">(
		"createdAt",
	);
	const [sortDir] = useState<"asc" | "desc">("desc");

	const [formOpen, setFormOpen] = useState(false);
	const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => setSearch(searchInput), 300);
		return () => clearTimeout(timer);
	}, [searchInput]);

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

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: trpc.tickets.list.queryKey() });
		queryClient.invalidateQueries({ queryKey: trpc.tickets.stats.queryKey() });
	};

	const createMutation = useMutation({
		...trpc.tickets.create.mutationOptions(),
		onSuccess: () => {
			toast.success("Ticket created");
			invalidate();
			setFormOpen(false);
		},
	});

	const updateMutation = useMutation({
		...trpc.tickets.update.mutationOptions(),
		onSuccess: () => {
			toast.success("Ticket updated");
			invalidate();
			setFormOpen(false);
		},
	});

	const handleFormSubmit = (data: Partial<Ticket>) => {
		if (editingTicket) {
			updateMutation.mutate({ id: editingTicket.id, ...data });
		} else {
			createMutation.mutate(data as any);
		}
	};

	const handleAdd = () => {
		setEditingTicket(null);
		setFormOpen(true);
	};

	const handleEdit = (ticket: Ticket) => {
		setEditingTicket(ticket);
		setFormOpen(true);
	};

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

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<Input
						placeholder="Search tickets..."
						className="w-full max-w-xs"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<Select
						items={statusFilterItems}
						value={status}
						onValueChange={setStatus}
					>
						<SelectTrigger className="w-36">
							<SelectValue />
						</SelectTrigger>
						<SelectContent alignItemWithTrigger={false} side="bottom">
							<SelectGroup>
								{statusFilterItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select
						items={priorityFilterItems}
						value={priority}
						onValueChange={setPriority}
					>
						<SelectTrigger className="w-36">
							<SelectValue />
						</SelectTrigger>
						<SelectContent alignItemWithTrigger={false} side="bottom">
							<SelectGroup>
								{priorityFilterItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select items={sortItems} value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-36">
							<SelectValue />
						</SelectTrigger>
						<SelectContent alignItemWithTrigger={false} side="bottom">
							<SelectGroup>
								{sortItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<Button onClick={handleAdd}>
					<PlusIcon data-icon="inline-start" />
					Add Ticket
				</Button>
			</div>

			<TicketList
				tickets={listQuery.data}
				isLoading={listQuery.isLoading}
				onEdit={handleEdit}
			/>

			<TicketFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				ticket={editingTicket}
				onSubmit={handleFormSubmit}
				isPending={createMutation.isPending || updateMutation.isPending}
			/>
		</div>
	);
}
