//app/(main)/layout.tsx

import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { CommandMenu } from "@/components/search/command-menu";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen w-full flex-col lg:flex-row bg-background">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            {/* AGREGADO: p-4 lg:p-8 para dar espacio interno */}
            <main className="flex-1 overflow-y-auto w-full pb-24 lg:pb-0 p-4 lg:p-8">
                {children}
            </main>

            {/* Mobile Navigation */}
            <MobileNav />

            {/* Mobile FAB */}
            <div className="lg:hidden fixed bottom-20 right-4 z-50 drop-shadow-2xl">
                <NewTaskDialog label="Tarea" />
            </div>

            {/* Global Search */}
            <CommandMenu />
        </div>
    );
}