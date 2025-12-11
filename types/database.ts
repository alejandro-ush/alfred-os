export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskOrigin = 'human' | 'ai' | 'system';

export interface Task {
    id: string; // uuid
    created_at: string; // timestamptz
    updated_at: string; // timestamptz
    user_id: string; // uuid

    title: string; // text
    description: string | null; // text
    status: TaskStatus;
    priority: TaskPriority;
    origin: TaskOrigin;

    due_date: string | null; // timestamptz

    ai_metadata: Json | null; // jsonb, matches the SQL definition

    is_deleted: boolean; // boolean
}
