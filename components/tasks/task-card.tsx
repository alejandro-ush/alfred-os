// components/tasks/task-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/database";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TaskCardProps {
    task: Task;
}

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    low: "secondary",
    medium: "default",
    high: "destructive",
    urgent: "destructive",
};

export function TaskCard({ task }: TaskCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium line-clamp-1 text-foreground">
                    {task.title}
                </CardTitle>
                <Badge variant={priorityColors[task.priority] || "outline"}>
                    {task.priority}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
                    {task.description || "Sin descripción"}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] uppercase">
                        {task.status.replace('_', ' ')}
                    </Badge>
                    {task.due_date && (
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{format(new Date(task.due_date), "dd MMM", { locale: es })}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
