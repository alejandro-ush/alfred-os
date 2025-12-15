'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/database";
import { CalendarIcon, Tag, Flag, CheckCircle2, Trash2, Circle, Undo2 } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { completeTask, deleteTask, restoreTask } from "@/actions/tasks";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
    task: Task;
}

const priorityConfig: Record<string, { label: string }> = {
    urgent: { label: "🔴 Urgent" },
    routine: { label: "🟢 Routine" },
    low: { label: "🔵 Low" },
    inbox: { label: "📥 Inbox" },
    idea: { label: "💡 Idea" },
};

export function TaskCard({ task }: TaskCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Determines if we are in "Trash Mode" based on task status
    const isTrash = task.is_deleted;

    // Fallback for custom or unknown priorities
    const priorityLabel = priorityConfig[task.priority]?.label || `🔘 ${task.priority}`;

    // Overdue logic only if NOT in trash and pending
    const isOverdue = !isTrash && task.due_date && isBefore(new Date(task.due_date), startOfDay(new Date())) && task.status === 'pending';

    const handleComplete = async () => {
        setIsLoading(true);
        const result = await completeTask(task.id);
        if (result.error) {
            toast.error("Error al completar la tarea");
        } else {
            toast.success("Tarea completada");
            setIsOpen(false);
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

        setIsLoading(true);
        const result = await deleteTask(task.id);
        if (result.error) {
            toast.error("Error al eliminar la tarea");
        } else {
            toast.success("Tarea eliminada");
            setIsOpen(false);
        }
        setIsLoading(false);
    };

    const handleRestore = async () => {
        setIsLoading(true);
        const result = await restoreTask(task.id);
        if (result.error) {
            toast.error("Error al restaurar la tarea");
        } else {
            toast.success("Tarea restaurada");
            setIsOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Card
                    className={cn(
                        "hover:bg-muted/50 transition-all cursor-pointer active:scale-95 duration-200 group relative overflow-hidden",
                        isOverdue ? "opacity-60 grayscale hover:opacity-90 hover:grayscale-0" : "",
                        isTrash ? "opacity-75 grayscale border-dashed" : ""
                    )}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn(
                            "text-sm font-medium line-clamp-1 transition-colors",
                            isOverdue ? "text-muted-foreground" : "text-foreground group-hover:text-primary",
                            isTrash ? "line-through text-muted-foreground" : ""
                        )}>
                            {task.title}
                        </CardTitle>
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {priorityLabel}
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
                            {task.description || "Sin descripción"}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="text-[10px] uppercase opacity-70">
                                {task.status.replace('_', ' ')}
                            </span>
                            {task.due_date && (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs",
                                    isOverdue ? "text-red-400 font-medium" : ""
                                )}>
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{format(new Date(task.due_date), "d MMM", { locale: es })}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full sm:max-w-md p-0 gap-0">
                {/* 1. Header con estilo */}
                <SheetHeader className="p-6 bg-muted/30 border-b space-y-4">
                    <div className="flex items-start justify-between">
                        <SheetTitle className={cn("text-2xl font-bold leading-tight tracking-tight", isTrash && "line-through text-muted-foreground")}>
                            {task.title}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-base text-muted-foreground/80">
                        {isTrash ? "Tarea en papelera. Restáurala para editar." : "Detalles y gestión de la tarea."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* 2. Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Circle className="w-3.5 h-3.5" /> Estado
                            </span>
                            <span className="text-sm font-medium capitalize">
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Flag className="w-3.5 h-3.5" /> Prioridad
                            </span>
                            <span className="text-sm font-medium">
                                {priorityLabel}
                            </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5" /> Vencimiento
                            </span>
                            <span className={cn(
                                "text-sm font-medium",
                                isOverdue ? "text-red-500" : ""
                            )}>
                                {task.due_date
                                    ? format(new Date(task.due_date), "PPP", { locale: es })
                                    : "Sin fecha"}
                            </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5" /> Categoría
                            </span>
                            <span className="text-sm font-medium capitalize">
                                {task.category || "General"}
                            </span>
                        </div>
                    </div>

                    {/* Descripción con espacio */}
                    {task.description && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Descripción
                            </h4>
                            <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {task.description}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Footer de Acciones */}
                <SheetFooter className="p-6 border-t mt-auto bg-background/50 backdrop-blur-sm">
                    <div className="flex w-full items-center gap-4 sm:justify-between">
                        {isTrash ? (
                            // Acciones de Papelera
                            <Button
                                className="flex-1 gap-2"
                                size="lg"
                                variant="default" // Primary style for Restore
                                onClick={handleRestore}
                                disabled={isLoading}
                            >
                                <Undo2 className="h-5 w-5" />
                                {isLoading ? "Restaurando..." : "Restaurar Tarea"}
                            </Button>
                        ) : (
                            // Acciones Normales (Activas)
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    <Trash2 className="h-5 w-5" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                                <Button
                                    className="flex-1 gap-2"
                                    size="lg"
                                    onClick={handleComplete}
                                    disabled={isLoading || task.status === 'completed'}
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                    {isLoading ? "Procesando..." : "Marcar Completada"}
                                </Button>
                            </>
                        )}
                    </div>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    );
}