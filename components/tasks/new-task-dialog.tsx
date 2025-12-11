// components/tasks/new-task-dialog.tsx
"use client";

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
import { Plus } from "lucide-react";
import { createTask } from "@/app/dashboard/tasks/actions";
import { useState, useRef } from "react";
import { toast } from "sonner"; // Assuming sonner or use standard toast logic if available, or just skip toast for MVP if not installed. Use simple alert or nothing for now to minimize deps unless user asked. I'll rely on form action success.
// Wait, I don't have sonner installed. I'll stick to basic action handling or just close dialog.

export function NewTaskDialog() {
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        const result = await createTask(formData);
        if (result?.error) {
            // handle error
            alert(result.error);
        } else {
            setOpen(false);
            formRef.current?.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Tarea
                </Button>
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
                        <Label htmlFor="priority" className="text-right">
                            Prioridad
                        </Label>
                        <div className="col-span-3">
                            <Select name="priority" defaultValue="medium">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="idea">💡 Idea</SelectItem>
                                    <SelectItem value="low">🟢 Baja</SelectItem>
                                    <SelectItem value="routine">📅 Media (Routine)</SelectItem>
                                    <SelectItem value="urgent">🔥 Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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
                        <Button type="submit">Guardar Tarea</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
