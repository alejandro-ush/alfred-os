//app/(main)/dashboard/focus/page.tsx

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

    // Logic v4: Focus
    // - status: pending
    // - is_deleted: false
    // - Filter: priority = 'urgent' OR due_date <= TODAY (End of Day)
    const today = new Date();
    // Set to end of day in local time/server time to include tasks due today

    // ISO string for comparison. Supabase timestamptz comparison works best with ISO.
    // However, JS `new Date()` is UTC in many server envs, but here we are local.
    // Let's use `endOfDay` logic but simplistic for ISO string:
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const todayISO = endOfToday.toISOString();

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "pending")
        .eq("is_deleted", false)
        .lte("due_date", todayISO)
        .order("priority", { ascending: false }) // Urgent first
        .order("due_date", { ascending: true }); // Then by date

    if (error) {
        console.error("Error fetching tasks:", error);
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Focus</h1>
                    <p className="text-muted-foreground text-lg">Tu objetivo principal para hoy.</p>
                </div>
                <div className="flex items-center">
                    <NewTaskDialog label=" Agregar Tarea" />
                </div>
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
                        <p className="text-muted-foreground text-lg">¡Todo limpio! No tienes tareas pendientes hoy 🎉</p>
                    </div>
                </div>
            )}

        </div>
    );
}
