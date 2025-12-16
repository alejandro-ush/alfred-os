// app/(main)/dashboard/notes/page.tsx

import { createClient } from "@/utils/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";

export default async function NotesPage() {
    const supabase = await createClient();

    // Filtro: priority === 'idea'
    // Also is_deleted=false, status='pending' (usually notes are pending ideas)

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", false)
        .eq("priority", "idea")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notes:", error);
        return <div className="p-4 text-red-500">Error cargando notas</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Notas e Ideas</h1>
                    <p className="text-muted-foreground">
                        Espacio para tus pensamientos y borradores.
                    </p>
                </div>
                <div className="hidden lg:block">
                    {/* Botón específico: Pre-selecciona 'Idea' y oculta fecha */}
                    <NewTaskDialog
                        defaultPriority="idea"
                        hideDateInput={true}
                        label="Agregar Nota"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No tienes notas guardadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
