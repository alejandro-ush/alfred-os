// app/(main)/dashboard/plan/page.tsx
import { createClient } from "@/utils/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import { startOfTomorrow, isTomorrow, isSameWeek, addWeeks, format } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "@/types/database";

// Priority weights helper
const getPriorityWeight = (p: string) => {
    switch (p) {
        case 'urgent': return 5;
        // case 'high': return 4; // Not in standard type but requested flow
        case 'routine': return 3; // Equivalent to medium/routine
        case 'low': return 2;
        case 'inbox': return 1;
        case 'idea': return 0;
        default: return 1;
    }
};

export default async function PlanPage() {
    const supabase = await createClient();

    // Lógica: Tareas futuras (a partir de mañana)
    const futureDateStart = startOfTomorrow().toISOString();

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", false)
        .eq("status", "pending")
        .gt("due_date", futureDateStart)
        .order("due_date", { ascending: true }); // Primary sort by date from DB

    if (error) {
        console.error("Error fetching plan tasks:", error);
        return <div className="p-4 text-red-500">Error cargando tareas</div>;
    }

    // Buckets
    const buckets = {
        tomorrow: [] as Task[],
        thisWeek: [] as Task[], // Resto de esta semana
        nextWeek: [] as Task[],
        later: [] as Task[],
    };

    const now = new Date();

    if (tasks) {
        tasks.forEach((task) => {
            const date = new Date(task.due_date!); // Safe assertion per query filter gt due_date

            if (isTomorrow(date)) {
                buckets.tomorrow.push(task);
            } else if (isSameWeek(date, now, { weekStartsOn: 1 })) {
                buckets.thisWeek.push(task);
            } else if (isSameWeek(date, addWeeks(now, 1), { weekStartsOn: 1 })) {
                buckets.nextWeek.push(task);
            } else {
                buckets.later.push(task);
            }
        });
    }

    // Apply Sorting: Priority DESC within each bucket
    const sortTasks = (taskList: Task[]) => {
        return taskList.sort((a, b) => {
            const weightA = getPriorityWeight(a.priority);
            const weightB = getPriorityWeight(b.priority);
            return weightB - weightA; // DESC
        });
    };

    buckets.tomorrow = sortTasks(buckets.tomorrow);
    buckets.thisWeek = sortTasks(buckets.thisWeek);
    buckets.nextWeek = sortTasks(buckets.nextWeek);
    buckets.later = sortTasks(buckets.later);

    const hasTasks = tasks && tasks.length > 0;

    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Plan Semanal</h1>
                <p className="text-muted-foreground text-lg">
                    Visión de tus compromisos futuros.
                </p>
            </div>

            {!hasTasks && (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-lg">No hay tareas planificadas para el futuro 🎉</p>
                </div>
            )}

            {/* SECCIÓN: MAÑANA */}
            {buckets.tomorrow.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground/90">
                        🌅 Mañana
                        <span className="text-sm font-normal text-muted-foreground capitalize">
                            — {format(new Date(buckets.tomorrow[0].due_date!), "EEEE d", { locale: es })}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {buckets.tomorrow.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}

            {/* SECCIÓN: ESTA SEMANA (Restante) */}
            {buckets.thisWeek.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground/90">📅 Resto de la Semana</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {buckets.thisWeek.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}

            {/* SECCIÓN: PRÓXIMA SEMANA */}
            {buckets.nextWeek.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground/90">🚀 Próxima Semana</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {buckets.nextWeek.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}

            {/* SECCIÓN: MÁS ADELANTE */}
            {buckets.later.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground/90">🔮 Más Adelante</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {buckets.later.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </section>
            )}
        </div>
    );
}
