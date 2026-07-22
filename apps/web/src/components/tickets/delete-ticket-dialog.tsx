import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@ticket-app/ui/components/alert-dialog";
import { Button } from "@ticket-app/ui/components/button";

import type { Ticket } from "./constants";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	ticket?: Ticket | null;
	onConfirm: (ticket: Ticket) => void;
	isPending?: boolean;
};

export function DeleteTicketDialog({
	open,
	onOpenChange,
	ticket,
	onConfirm,
	isPending,
}: Props) {
	if (!ticket) {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Ticket</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the ticket "{ticket.title}"? This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Button
						variant="outline"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						disabled={isPending}
						onClick={() => onConfirm(ticket)}
					>
						{isPending ? "Deleting..." : "Delete"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
