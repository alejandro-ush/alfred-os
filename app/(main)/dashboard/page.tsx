import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Brain, CalendarDays, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const today = new Date();
    // Format YYYY-MM-DD for simpler comparison if due_date is just date
    const todayISO = today.toISOString();

    // 1. Fetch Focus Tasks (Pending & Completed for Progress calculation)
    // Criteria: is_deleted=false AND (due_date <= today OR priority='urgent')
    const { data: focusTasks } = await supabase
        .from("tasks")
        .select("status")
        .eq("is_deleted", false)
        .or(`due_date.lte.${todayISO},priority.eq.urgent`);

    // Calculate Focus Metrics
    const focusTotal = focusTasks?.length || 0;
    const focusCompleted = focusTasks?.filter(t => t.status === 'completed').length || 0;
    const focusPending = focusTotal - focusCompleted;
    const progressPercentage = focusTotal > 0 ? Math.round((focusCompleted / focusTotal) * 100) : 0;

    // 2. Fetch Brain/Inbox Count (Strictly Pending)
    // Criteria: is_deleted=false AND due_date IS NULL AND status != 'completed'
    const { count: brainCount } = await supabase
        .from("tasks")
        .select("*", { count: 'exact', head: true })
        .eq("is_deleted", false)
        .is("due_date", null)
        .neq("status", "completed");

    // Greeting Logic
    const hour = today.getHours();
    let greeting = "Buenas noches";
    if (hour < 12) greeting = "Buenos días";
    else if (hour < 20) greeting = "Buenas tardes";

    return (
        <div className="flex flex-col h-full space-y-8 p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{greeting}, Alejandro.</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {/* Focus Card */}
                <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Focus (Para hoy)
                        </CardTitle>
                        <Target className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">
                            {focusPending}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {focusCompleted} tareas completadas hoy
                        </p>
                    </CardContent>
                </Card>

                {/* Brain Card */}
                <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Brain / Inbox
                        </CardTitle>
                        <Brain className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">
                            {brainCount || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tareas sin fecha asignada
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Progreso diario
                    </span>
                    <span className="text-muted-foreground">{progressPercentage}%</span>
                </div>
                {/* Custom Tailwind Progress Bar */}
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    {progressPercentage === 100
                        ? "¡Objetivos cumplidos! 🎉"
                        : "Sigue así, cada paso cuenta."}
                </p>
            </div>
        </div>
    );
}
