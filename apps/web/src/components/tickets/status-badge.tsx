import { Badge } from "@ticket-app/ui/components/badge";
import { cn } from "@ticket-app/ui/lib/utils";

import {
	PRIORITY_LABELS,
	type Priority,
	STATUS_LABELS,
	type Status,
} from "./constants";

const statusClass: Record<Status, string> = {
	open: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-300",
	in_progress:
		"border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300",
	resolved:
		"border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
	closed: "border-transparent bg-muted text-muted-foreground",
};

const priorityClass: Record<Priority, string> = {
	high: "border-transparent bg-red-500/15 text-red-700 dark:text-red-300",
	medium:
		"border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300",
	low: "border-transparent bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

export function StatusBadge({ status }: { status: string }) {
	const key = status as Status;
	const label = STATUS_LABELS[key] ?? status;
	return (
		<Badge variant="outline" className={cn(statusClass[key])}>
			{label}
		</Badge>
	);
}

export function PriorityBadge({ priority }: { priority: string }) {
	const key = priority as Priority;
	const label = PRIORITY_LABELS[key] ?? priority;
	return (
		<Badge variant="outline" className={cn(priorityClass[key])}>
			{label}
		</Badge>
	);
}
