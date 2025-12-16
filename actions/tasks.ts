// actions/tasks.ts

'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createTaskSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    priority: z.enum(["idea", "low", "routine", "urgent", "inbox"]), // Ensure routine/inbox are covered
    description: z.string().optional(),
    due_date: z.string().optional().nullable(),
});

export async function createTask(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const rawDueDate = formData.get("due_date") as string;
    const rawData = {
        title: formData.get("title"),
        priority: formData.get("priority"),
        description: formData.get("description"),
        // Fix: Ensure empty string becomes null for Zod/DB
        due_date: rawDueDate === "" || rawDueDate === "undefined" ? null : rawDueDate,
    };

    const parseResult = createTaskSchema.safeParse(rawData);

    if (!parseResult.success) {
        return { error: "Invalid data" };
    }

    const { title, priority, description, due_date } = parseResult.data;

    const { error } = await supabase.from("tasks").insert({
        title,
        priority,
        description: description || null,
        due_date: due_date || null, // Redundant null check but safe
        status: 'pending',
        origin: 'app',
        user_id: user.id,
    });

    if (error) {
        console.error("Error creating task:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/focus");
    revalidatePath("/dashboard/trash");
    return { success: true };
}

export async function completeTask(taskId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("tasks")
        .update({ status: 'completed' })
        .eq('id', taskId)
        .eq('user_id', user.id); // Ensure ownership

    if (error) {
        console.error("Error completing task:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/focus");
    revalidatePath("/dashboard/trash");
    return { success: true };
}

export async function deleteTask(taskId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("tasks")
        .update({ is_deleted: true }) // Soft delete as suggested/preferred
        .eq('id', taskId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error deleting task:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/focus");
    revalidatePath("/dashboard/trash");
    return { success: true };
}

export async function restoreTask(taskId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("tasks")
        .update({ is_deleted: false })
        .eq('id', taskId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error restoring task:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/focus");
    revalidatePath("/dashboard/trash");
    return { success: true };
}

export async function deleteTaskPermanently(taskId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error permanently deleting task:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/trash");
    return { success: true };
}

export async function undoTask(taskId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("tasks")
        .update({ status: 'pending' })
        .eq('id', taskId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error undoing task:", error);
        return { error: error.message };
    }

    // Revalidate relevant paths where the task might reappear
    revalidatePath("/dashboard/focus");
    revalidatePath("/dashboard/plan");
    revalidatePath("/dashboard/brain");
    revalidatePath("/dashboard/logbook");
    return { success: true };
}
