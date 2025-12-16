import Link from "next/link"
import { Target, CalendarRange, Brain, User, Settings, LogOut, Trash2, Archive, NotebookPen, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { NewTaskDialog } from "@/components/tasks/new-task-dialog"
// import { Button } from "@/components/ui/button" // Assuming Button exists or reusing standard styles
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Assuming Avatar exists

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
        title: "Papelera",
        href: "/dashboard/trash",
        icon: Trash2,
    },
]

export function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen sticky top-0">
            <div className="p-6 border-b border-sidebar-border">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        A
                    </span>
                    Alfred OS
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href} // Using href directly from Link in Next.js 13+ (no need for anchor)
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                // "text-muted-foreground" // Default state
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto pt-6">
                    <NewTaskDialog label=" Agregar Tarea" />
                </div>
            </div>

            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-sm">
                        <span className="font-medium">User</span>
                        <span className="text-xs text-muted-foreground">user@example.com</span>
                    </div>
                    <LogOut className="w-4 h-4 ml-auto text-muted-foreground" />
                </div>
            </div>
        </aside>
    )
}
