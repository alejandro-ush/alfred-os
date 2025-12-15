// actions/tasks.ts

'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createTaskSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    priority: z.enum(["idea", "low", "routine", "urgent"]),
    description: z.string().optional(),
});

export async function createTask(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const rawData = {
        title: formData.get("title"),
        priority: formData.get("priority"),
        description: formData.get("description"),
    };

    const parseResult = createTaskSchema.safeParse(rawData);

    if (!parseResult.success) {
        return { error: "Invalid data" };
    }

    const { title, priority, description } = parseResult.data;

    const { error } = await supabase.from("tasks").insert({
        title,
        priority,
        description: description || null,
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
