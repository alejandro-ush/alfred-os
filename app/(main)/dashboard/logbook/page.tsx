// app/(main)/dashboard/logbook/page.tsx
import { createClient } from "@/utils/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import { Archive } from "lucide-react";

export default async function LogbookPage() {
    const supabase = await createClient();

    // Fetch COMPLETED tasks
    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", false)
        .eq("status", "completed")
        .order("updated_at", { ascending: false }); // Most recently completed first

    if (error) {
        console.error("Error fetching logbook tasks:", error);
        return <div className="p-4 text-red-500">Error cargando el historial</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Logbook</h1>
                    <Archive className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                    Historial de tareas completadas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No has completado ninguna tarea recientemente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
