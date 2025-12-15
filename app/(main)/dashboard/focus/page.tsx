import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { TaskCard } from "@/components/tasks/task-card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Task } from "@/types/database";

export default async function FocusPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "pending")
        .eq('is_deleted', false)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Focus</h1>
                    <p className="text-muted-foreground">Tu objetivo principal para hoy.</p>
                </div>
                <NewTaskDialog />
            </div>

            {tasks && tasks.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task: Task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="flex-1 rounded-lg border border-dashed shadow-sm flex items-center justify-center bg-card text-card-foreground p-12">
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground">No tienes tareas pendientes. ¡Estás al día!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
