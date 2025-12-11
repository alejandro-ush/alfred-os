import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import { LogOut } from "lucide-react";
import { MobileNav } from "@/components/dashboard/mobile-nav";

interface HeaderProps {
    userEmail: string | undefined;
}

export function Header({ userEmail }: HeaderProps) {
    return (
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-6 lg:gap-0">
            <MobileNav />
            <div className="flex flex-1 items-center justify-between">
                <div className="text-sm text-foreground">
                    <span className="text-muted-foreground hidden sm:inline">Conectado como: </span>
                    <span className="font-medium">{userEmail}</span>
                </div>
                <form action={signOut}>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                    </Button>
                </form>
            </div>
        </header>
    );
}
