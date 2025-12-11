// app/dashboard/tasks/actions.ts
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
        user_id: user.id, // Implicitly handled by RLS typically, but good to be explicit if table allows. Wait, RLS normally enforces it on select/update, but on insert we usually need to provide it OR have a default `auth.uid()`. Let's assume we provide it to be safe, or just let Supabase handle it if the policy forces it. Usually `user_id` column defaults to `auth.uid()` if set up that way, otherwise we send it. The user said "Aprovecha que RLS ya filtra por usuario...", that usually implies filtering. I'll send it explicitly.
    });

    if (error) {
        console.error("Error creating task:", error);
        // Tip Pro: Devolvemos el mensaje real para verlo en el navegador si falla
        return { error: error.message };
        /*return { error: "Failed to create task" };*/
    }

    revalidatePath("/dashboard/tasks");
    return { success: true };
}
