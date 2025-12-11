"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, FileText, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    {
        title: "Inicio",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Tareas",
        url: "/dashboard/tasks",
        icon: ListTodo,
    },
    {
        title: "Notas",
        url: "/dashboard/notes",
        icon: FileText,
    },
    {
        title: "Configuración",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className, ...props }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn("flex h-full flex-col border-r border-border bg-card", className)} {...props}>
            <div className="flex h-14 items-center border-b border-border px-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-foreground">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Alfred OS</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.url}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.url
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="border-t border-border p-4 text-xs text-muted-foreground">
                <p>Alfred OS v0.1.0</p>
            </div>
        </div>
    );
}
