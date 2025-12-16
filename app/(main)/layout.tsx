//app/(main)/layout.tsx

import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { CommandMenu } from "@/components/search/command-menu";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSearchBtn } from "@/components/search/mobile-search-btn";

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
            {/* Mobile FAB System */}
            <div className="lg:hidden fixed bottom-20 right-4 z-50 flex flex-col gap-3 items-end">
                {/* Search FAB - Opens CommandMenu */}
                <MobileSearchBtn />

                {/* New Task FAB */}
                <NewTaskDialog
                    customTrigger={
                        <Button className="h-14 w-14 rounded-full shadow-xl p-0">
                            <Plus className="h-6 w-6" />
                        </Button>
                    }
                />
            </div>

            {/* Global Search */}
            <CommandMenu />
        </div>
    );
}