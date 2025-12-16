// app/(main)/dashboard/logbook/page.tsx

import { createClient } from "@/utils/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import { Archive } from "lucide-react";
import { isToday, isYesterday, isSameWeek, format } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "@/types/database";

export default async function LogbookPage() {
    const supabase = await createClient();

    // Fetch COMPLETED tasks
    // Ordenamos por updated_at para ver arriba lo último que se modificó/completó
    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", false)
        .eq("status", "completed")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching logbook tasks:", error);
        return <div className="p-4 text-red-500">Error cargando el historial</div>;
    }

    // --- LÓGICA DE AGRUPACIÓN (Buckets) ---
    // Igual que en el Plan, pero mirando hacia atrás
    const buckets = {
        completedToday: [] as Task[],
        completedYesterday: [] as Task[],
        completedThisWeek: [] as Task[],
        older: [] as Task[],
    };

    const now = new Date();

    if (tasks) {
        tasks.forEach((task) => {
            // Usamos updated_at porque es cuando se completó la tarea
            // Si updated_at es null (raro), usamos due_date como fallback
            const dateStr = task.updated_at || task.due_date;
            const date = new Date(dateStr!);

            if (isToday(date)) {
                buckets.completedToday.push(task);
            } else if (isYesterday(date)) {
                buckets.completedYesterday.push(task);
            } else if (isSameWeek(date, now, { weekStartsOn: 1 })) {
                buckets.completedThisWeek.push(task);
            } else {
                buckets.older.push(task);
            }
        });
    }

    const hasTasks = tasks && tasks.length > 0;

    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
            {/* ENCABEZADO */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Logbook</h1>
                    <Archive className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">
                    Historial de tareas completadas.
                </p>
            </div>

            {/* ESTADO VACÍO */}
            {!hasTasks && (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-lg">No has completado ninguna tarea recientemente.</p>
                </div>
            )}

            {/* SECCIÓN 1: HOY (Se ve vívido y claro) */}
            {buckets.completedToday.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-green-600">
                        ✅ Completado Hoy
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {buckets.completedToday.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}

            {/* SECCIÓN 2: AYER (Un poco menos de opacidad) */}
            {buckets.completedYesterday.length > 0 && (
                <section className="space-y-4 opacity-85">
                    <h2 className="text-xl font-semibold text-foreground/80">Ayer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {buckets.completedYesterday.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}

            {/* SECCIÓN 3: ESTA SEMANA (Más transparente y un poco gris) */}
            {buckets.completedThisWeek.length > 0 && (
                <section className="space-y-4 opacity-75">
                    <h2 className="text-xl font-semibold text-foreground/70">Esta Semana</h2>
                    {/* grayscale-[0.5] desatura los colores a la mitad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grayscale-[0.5]">
                        {buckets.completedThisWeek.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}

            {/* SECCIÓN 4: ANTERIORES (Muy transparente y totalmente gris) */}
            {buckets.older.length > 0 && (
                <section className="space-y-4 opacity-60">
                    <h2 className="text-xl font-semibold text-foreground/60">Archivo Antiguo</h2>
                    {/* grayscale total para lo viejo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grayscale">
                        {buckets.older.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}
        </div>
    );
}