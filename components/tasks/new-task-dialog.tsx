// components/tasks/new-task-dialog.tsx
"use client";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CalendarIcon } from "lucide-react";
import { createTask } from "@/actions/tasks";
import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";

interface NewTaskDialogProps {
    defaultPriority?: string;
    hideDateInput?: boolean;
    label?: string;
    customTrigger?: React.ReactNode;
}

export function NewTaskDialog({
    defaultPriority = "routine",
    hideDateInput = false,
    label = "Nueva Tarea",
    customTrigger,
}: NewTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState("general");
    const [priority, setPriority] = useState(defaultPriority); // State for priority
    const pathname = usePathname();
    const formRef = useRef<HTMLFormElement>(null);

    // Context-Aware Default
    useEffect(() => {
        if (open) {
            if (pathname?.includes("/shopping")) {
                setCategory("shopping");
                // User can keep default priority or change it
            } else if (pathname?.includes("/notes")) {
                setCategory("personal"); // Or general, user preference
                setPriority("idea"); // Force priority to idea for notes
            } else {
                setCategory("general");
                setPriority(defaultPriority);
            }
        }
    }, [open, pathname, defaultPriority]);

    async function clientAction(formData: FormData) {
        if (isSubmitting) return; // Guard clause: Previene doble click
        setIsSubmitting(true);

        // Append date manually formatting as YYYY-MM-DD to avoid Timezone issues
        if (date) {
            // CORRECCIÓN AQUÍ: Usamos format() en lugar de toISOString()
            // Esto evita que la fecha se guarde como "ayer" debido a la conversión UTC
            formData.append("due_date", format(date, "yyyy-MM-dd"));
        }

        // Append Category
        formData.append("category", category);
        // Priority is handled by the select name attribute but we want to ensure state sync if we controlled it
        // actually the Select component below uses name="priority" so formData gets it automatically from the form.
        // BUT if we want to force the state value (which we set via useEffect), we should make the Select controlled.
        // Let's rely on the form data extraction, BUT we must control the Select value to reflect the useEffect change visually.
        formData.set("priority", priority); // Ensure controlled value is sent (though name=priority usually handles it)

        try {
            const result = await createTask(formData);
            if (result?.error) {
                alert(result.error);
            } else {
                setOpen(false);
                setDate(undefined); // Reset date
                formRef.current?.reset();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {customTrigger ? (
                    customTrigger
                ) : (
                    <Button className="gap-2 w-full justify-center">
                        <Plus className="h-4 w-4" />
                        {label}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Tarea</DialogTitle>
                    <DialogDescription>
                        Añade una nueva tarea a tu lista. Haz clic en guardar cuando termines.
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={clientAction} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Título
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Revisar correos..."
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Categoría
                        </Label>
                        <div className="col-span-3">
                            <Select value={category} onValueChange={setCategory} name="category">
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="work">Trabajo</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="shopping">🛒 Compras</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                            Prioridad
                        </Label>
                        <div className="col-span-3">
                            <Select name="priority" value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="idea">💡 Idea</SelectItem>
                                    <SelectItem value="inbox">📥 Inbox</SelectItem>
                                    <SelectItem value="low">🔵 Baja</SelectItem>
                                    <SelectItem value="routine">🟢 Media </SelectItem>
                                    <SelectItem value="urgent">🔥 Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {!hideDateInput && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Vencimiento
                            </Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-md border shadow" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={{ before: new Date() }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Detalles
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descripción opcional"
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar Tarea"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}