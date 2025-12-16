"use client";

import Link from "next/link"
import { Target, CalendarRange, Brain, User, Trash2, Archive, LayoutDashboard, ShoppingCart, Settings, NotebookPen } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Focus",
        href: "/dashboard/focus",
        icon: Target,
    },
    {
        title: "Plan",
        href: "/dashboard/plan",
        icon: CalendarRange,
    },
    {
        title: "Brain",
        href: "/dashboard/brain",
        icon: Brain,
    },
    {
        title: "Shopping",
        href: "/dashboard/shopping",
        icon: ShoppingCart,
    },
    {
        title: "Notas",
        href: "/dashboard/notes",
        icon: NotebookPen,
    },
    {
        title: "Logbook",
        href: "/dashboard/logbook",
        icon: Archive,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        title: "Trash",
        href: "/dashboard/trash",
        icon: Trash2,
    },
]

export function MobileNav() {
    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t border-border flex items-center justify-start gap-6 px-6 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            <style jsx>{`
                nav::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors min-w-[3.5rem]"
                    )}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                </Link>
            ))}
        </nav>
    )
}
