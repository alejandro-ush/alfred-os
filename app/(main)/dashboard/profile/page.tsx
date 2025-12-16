// app/(main)/dashboard/profile/page.tsx
import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Perfil de Usuario</h1>
            <p className="text-lg font-medium">🚧 Sección en Construcción</p>
            <p className="text-sm opacity-80">Aquí verás tus estadísticas y datos personales.</p>
        </div>
    );
}
