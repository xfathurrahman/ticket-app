import { Button } from "@ticket-app/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ticket-app/ui/components/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@ticket-app/ui/components/empty";
import { Skeleton } from "@ticket-app/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ticket-app/ui/components/table";
import { PencilIcon, Trash2Icon } from "lucide-react";

import {
	CATEGORY_LABELS,
	type Category,
	formatDate,
	type Ticket,
} from "./constants";
import { PriorityBadge, StatusBadge } from "./status-badge";

type Props = {
	tickets?: Ticket[];
	isLoading?: boolean;
	onEdit?: (ticket: Ticket) => void;
	onDelete?: (ticket: Ticket) => void;
};

function categoryLabel(value: string) {
	return CATEGORY_LABELS[value as Category] ?? value;
}

export function TicketList({ tickets, isLoading, onEdit, onDelete }: Props) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 4 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
					<Skeleton key={i} className="h-14 w-full" />
				))}
			</div>
		);
	}

	if (!tickets?.length) {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyTitle>No tickets</EmptyTitle>
					<EmptyDescription>
						Create a ticket or adjust filters to see results.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<>
			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Assigned</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tickets.map((ticket) => (
							<TableRow key={ticket.id}>
								<TableCell className="max-w-[220px] truncate font-medium">
									{ticket.title}
								</TableCell>
								<TableCell>{categoryLabel(ticket.category)}</TableCell>
								<TableCell>
									<PriorityBadge priority={ticket.priority} />
								</TableCell>
								<TableCell>
									<StatusBadge status={ticket.status} />
								</TableCell>
								<TableCell>{ticket.assignedTo}</TableCell>
								<TableCell>{formatDate(ticket.createdAt)}</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-1">
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => onEdit?.(ticket)}
											aria-label={`Edit ${ticket.title}`}
										>
											<PencilIcon />
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => onDelete?.(ticket)}
											aria-label={`Delete ${ticket.title}`}
										>
											<Trash2Icon />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 md:hidden">
				{tickets.map((ticket) => (
					<Card key={ticket.id} size="sm">
						<CardHeader>
							<div className="flex items-start justify-between gap-2">
								<div className="flex min-w-0 flex-col gap-1">
									<CardTitle className="truncate">{ticket.title}</CardTitle>
									<CardDescription>
										{categoryLabel(ticket.category)} · {ticket.assignedTo}
									</CardDescription>
								</div>
								<div className="flex shrink-0 gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => onEdit?.(ticket)}
										aria-label={`Edit ${ticket.title}`}
									>
										<PencilIcon />
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => onDelete?.(ticket)}
										aria-label={`Delete ${ticket.title}`}
									>
										<Trash2Icon />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="flex flex-wrap items-center gap-2">
							<PriorityBadge priority={ticket.priority} />
							<StatusBadge status={ticket.status} />
							<span className="text-muted-foreground">
								{formatDate(ticket.createdAt)}
							</span>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
