// app/(main)/dashboard/shopping/page.tsx
import { createClient } from "@/utils/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ShoppingPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Logic: Tasks with category 'shopping' and pending status
    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", false)
        .eq("status", "pending")
        .eq("category", "shopping")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching shopping tasks:", error);
        return <div className="p-4 text-red-500">Error cargando lista de compras</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 border-b pb-4">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Lista de Compras 🛒</h1>
                    <p className="text-muted-foreground text-sm">
                        Items pendientes por comprar
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {tasks && tasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg h-64">
                        <ShoppingCart className="h-12 w-12 opacity-20 mb-4" />
                        <p className="text-lg font-medium">Todo comprado. ¡Bien hecho! 🎉</p>
                        <p className="text-sm opacity-70">Añade items seleccionando la categoría 'shopping'.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
