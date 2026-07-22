import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ticket-app/ui/components/card";
import { Skeleton } from "@ticket-app/ui/components/skeleton";

type Stats = {
	total: number;
	open: number;
	inProgress: number;
	highPriority: number;
};

const items: { key: keyof Stats; label: string }[] = [
	{ key: "total", label: "Total Tickets" },
	{ key: "open", label: "Open" },
	{ key: "inProgress", label: "In Progress" },
	{ key: "highPriority", label: "High Priority" },
];

export function StatsCards({
	stats,
	isLoading,
}: {
	stats?: Stats;
	isLoading?: boolean;
}) {
	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{items.map(({ key, label }) => (
				<Card key={key} size="sm">
					<CardHeader>
						<CardDescription>{label}</CardDescription>
						<CardTitle className="font-semibold text-2xl tabular-nums">
							{isLoading ? (
								<Skeleton className="h-7 w-12" />
							) : (
								(stats?.[key] ?? 0)
							)}
						</CardTitle>
					</CardHeader>
					<CardContent className="hidden" />
				</Card>
			))}
		</div>
	);
}
