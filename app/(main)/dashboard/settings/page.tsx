// app/(main)/dashboard/settings/page.tsx
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <Settings className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Ajustes</h1>
            <p className="text-lg font-medium">🚧 Sección en Construcción</p>
            <p className="text-sm opacity-80">Pronto podrás configurar tu experiencia Alfred OS.</p>
        </div>
    );
}
