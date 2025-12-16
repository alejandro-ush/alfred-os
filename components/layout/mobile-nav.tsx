import Link from "next/link"
import { Target, CalendarRange, Brain, User, Trash2, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
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
        title: "Logbook",
        href: "/dashboard/logbook",
        icon: Archive,
    },
    {
        title: "Trash",
        href: "/dashboard/trash",
        icon: Trash2,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
]

export function MobileNav() {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t border-border flex items-center justify-around px-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-2"
                    )}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                </Link>
            ))}
        </nav>
    )
}
