// app/dashboard/tasks/page.tsx
import { createClient } from "@/utils/supabase/server";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { TaskCard } from "@/components/tasks/task-card";
import { Task } from "@/types/database";

export default async function TasksPage() {
    const supabase = await createClient();

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        return <div>Error al cargar las tareas.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Mis Tareas</h1>
                <NewTaskDialog />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tasks?.map((task) => (
                    <TaskCard key={task.id} task={task as Task} />
                ))}
                {tasks?.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        No hay tareas pendientes. ¡Crea una nueva!
                    </div>
                )}
            </div>
        </div>
    );
}
