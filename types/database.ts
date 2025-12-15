export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// ⚠️ AJUSTADO: Alineado con lo que n8n envía por defecto
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived';

// ⚠️ AJUSTADO: Alineado con la Lógica v2.1 de nuestro Prompt
export type TaskPriority = 'urgent' | 'routine' | 'low' | 'inbox' | 'idea';

// ⚠️ AJUSTADO: Alineado con los orígenes reales del sistema
export type TaskOrigin = 'telegram' | 'voice' | 'app' | 'system';

export interface Task {
    id: string; // uuid
    user_id: string; // uuid
    created_at: string; // timestamptz
    updated_at?: string; // timestamptz (opcional)

    title: string; // text
    description: string | null; // text

    status: TaskStatus;
    priority: TaskPriority;
    origin: TaskOrigin;

    // 📅 Nuevos campos v3.1
    due_date: string | null; // timestamptz
    category: string; // text (Ej: work, home, finance)
    estimated_duration: number; // int (minutos)
    is_habit: boolean; // boolean

    ai_metadata: Json | null; // jsonb
    is_deleted: boolean; // boolean
}