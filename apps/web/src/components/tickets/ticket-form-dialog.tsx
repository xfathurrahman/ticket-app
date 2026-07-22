import { Button } from "@ticket-app/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ticket-app/ui/components/dialog";
import { Input } from "@ticket-app/ui/components/input";
import { Label } from "@ticket-app/ui/components/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ticket-app/ui/components/select";
import { Textarea } from "@ticket-app/ui/components/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
	CATEGORIES,
	CATEGORY_LABELS,
	type Category,
	PRIORITIES,
	PRIORITY_LABELS,
	type Priority,
	STATUS_LABELS,
	STATUSES,
	type Status,
	type Ticket,
} from "./constants";

type FormData = {
	title: string;
	assignedTo: string;
	category: Category | null;
	priority: Priority | null;
	status: Status | null;
	notes: string;
};

const categoryItems = [
	{ label: "Select category", value: null },
	...CATEGORIES.map((c) => ({ label: CATEGORY_LABELS[c], value: c })),
];

const priorityItems = [
	{ label: "Select priority", value: null },
	...PRIORITIES.map((p) => ({ label: PRIORITY_LABELS[p], value: p })),
];

const statusItems = [
	{ label: "Select status", value: null },
	...STATUSES.map((s) => ({ label: STATUS_LABELS[s], value: s })),
];

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	ticket?: Ticket | null;
	onSubmit: (data: Partial<Ticket>) => void;
	isPending?: boolean;
};

export function TicketFormDialog({
	open,
	onOpenChange,
	ticket,
	onSubmit,
	isPending,
}: Props) {
	const isEdit = !!ticket;
	const [data, setData] = useState<FormData>({
		title: "",
		assignedTo: "",
		category: null,
		priority: null,
		status: "open",
		notes: "",
	});

	useEffect(() => {
		if (open) {
			if (ticket) {
				setData({
					title: ticket.title,
					assignedTo: ticket.assignedTo,
					category: ticket.category as Category,
					priority: ticket.priority as Priority,
					status: ticket.status as Status,
					notes: ticket.notes || "",
				});
			} else {
				setData({
					title: "",
					assignedTo: "",
					category: null,
					priority: null,
					status: "open",
					notes: "",
				});
			}
		}
	}, [open, ticket]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const title = data.title.trim();
		const assignedTo = data.assignedTo.trim();

		if (!title) return toast.error("Title is required");
		if (!assignedTo) return toast.error("Assignee is required");
		if (!data.category) return toast.error("Category is required");
		if (!data.priority) return toast.error("Priority is required");
		if (!data.status) return toast.error("Status is required");

		onSubmit({
			title,
			assignedTo,
			category: data.category,
			priority: data.priority,
			status: data.status,
			notes: data.notes.trim() || undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit Ticket" : "New Ticket"}</DialogTitle>
				</DialogHeader>

				<form
					id="ticket-form"
					onSubmit={handleSubmit}
					className="grid gap-4 py-4"
				>
					<div className="grid gap-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={data.title}
							onChange={(e) => setData({ ...data, title: e.target.value })}
							placeholder="Brief description of the issue"
							disabled={isPending}
							autoFocus
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="assignedTo">Assigned To</Label>
						<Input
							id="assignedTo"
							value={data.assignedTo}
							onChange={(e) => setData({ ...data, assignedTo: e.target.value })}
							placeholder="Name or email"
							disabled={isPending}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label>Category</Label>
							<Select
								items={categoryItems}
								value={data.category}
								onValueChange={(val) => setData({ ...data, category: val })}
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false} side="bottom">
									<SelectGroup>
										{categoryItems.map((item) => (
											<SelectItem key={String(item.value)} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label>Priority</Label>
							<Select
								items={priorityItems}
								value={data.priority}
								onValueChange={(val) => setData({ ...data, priority: val })}
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false} side="bottom">
									<SelectGroup>
										{priorityItems.map((item) => (
											<SelectItem key={String(item.value)} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label>Status</Label>
							<Select
								items={statusItems}
								value={data.status}
								onValueChange={(val) => setData({ ...data, status: val })}
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false} side="bottom">
									<SelectGroup>
										{statusItems.map((item) => (
											<SelectItem key={String(item.value)} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							value={data.notes}
							onChange={(e) => setData({ ...data, notes: e.target.value })}
							placeholder="Additional details (optional)"
							className="min-h-20 resize-none"
							disabled={isPending}
						/>
					</div>
				</form>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button type="submit" form="ticket-form" disabled={isPending}>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
