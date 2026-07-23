import { Link } from "@tanstack/react-router";
import { BookOpenIcon, TicketIcon } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

const navLinks = [
	{ to: "/", label: "Dashboard", external: false },
	{ to: "/docs", label: "Docs", external: true, icon: BookOpenIcon },
] as const;

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="flex items-center gap-2 font-semibold text-foreground tracking-tight transition-opacity hover:opacity-80"
					>
						<span className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
							<TicketIcon className="size-4" />
						</span>
						<span className="hidden sm:inline">IT Tickets</span>
					</Link>

					<nav className="flex items-center gap-1">
						{navLinks.map((link) => {
							if (link.external) {
								const Icon = "icon" in link ? link.icon : null;
								return (
									<a
										key={link.to}
										href={link.to}
										className="inline-flex h-8 items-center gap-1.5 px-3 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
									>
										{Icon ? <Icon className="size-3.5" /> : null}
										{link.label}
									</a>
								);
							}

							return (
								<Link
									key={link.to}
									to={link.to}
									className="inline-flex h-8 items-center px-3 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
									activeProps={{
										className:
											"inline-flex h-8 items-center px-3 text-sm font-medium text-foreground bg-muted",
									}}
								>
									{link.label}
								</Link>
							);
						})}
					</nav>
				</div>

				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
