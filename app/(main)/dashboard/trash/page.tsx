import { createClient } from "@/utils/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";

export default async function TrashPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch deleted tasks
    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching trash tasks:", error);
        return <div className="p-8 text-red-500">Error al cargar la papelera.</div>;
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">Papelera</h1>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {tasks?.length || 0}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                    <span>Items eliminados</span>
                </div>
            </header>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                {tasks && tasks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} isTrashView={true} />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Trash2 className="h-12 w-12 opacity-20" />
                        <p>La papelera está vacía</p>
                    </div>
                )}
            </div>
        </div>
    );
}
