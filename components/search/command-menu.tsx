"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    FileText,
    Search,
    ShoppingCart,
    Brain,
    Target,
    CalendarRange,
    Loader2,
    CheckCircle2,
    Circle,
    Inbox,
    LayoutDashboard
} from "lucide-react";
import { searchTasks } from "@/actions/tasks";
import { cn } from "@/lib/utils";

type SearchResult = {
    id: string;
    title: string;
    status: string;
    priority: string; // Added priority
    category: string;
    due_date: string | null;
};

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    // Toggle with Meta+K or Ctrl+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Debounced Search
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        const timeoutId = setTimeout(async () => {
            try {
                const data = await searchTasks(query);
                // Verify data is array before setting (safety)
                if (Array.isArray(data)) {
                    setResults(data as SearchResult[]);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Handle Selection
    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    // Helper for icons based on category/status
    const getIcon = (task: SearchResult) => {
        if (task.status === 'completed') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (task.category === 'shopping') return <ShoppingCart className="w-4 h-4 text-orange-500" />;
        if (task.category === 'personal') return <FileText className="w-4 h-4 text-blue-500" />;
        if (task.category === 'work') return <Target className="w-4 h-4 text-purple-500" />;
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    };

    // Helper for Smart Navigation
    const handleSelectTask = (task: SearchResult) => {
        setOpen(false);

        // 1. Shopping
        if (task.category === 'shopping') {
            router.push('/dashboard/shopping');
            return;
        }

        // 2. Notes (Idea)
        if (task.priority === 'idea') {
            router.push('/dashboard/notes');
            return;
        }

        // 3. Brain (Inbox)
        if (task.priority === 'inbox') {
            router.push('/dashboard/brain');
            return;
        }

        // 4. Focus (Today)
        const today = new Date().toISOString().split('T')[0];
        if (task.due_date && task.due_date.startsWith(today)) {
            router.push('/dashboard/focus');
            return;
        }

        // 5. Default Plan
        router.push('/dashboard/plan');
    };

    // Helper for Location Label
    const getLocationLabel = (task: SearchResult) => {
        if (task.category === 'shopping') return "SHOPPING";
        if (task.priority === 'idea') return "NOTA";
        if (task.priority === 'inbox') return "BRAIN";

        const today = new Date().toISOString().split('T')[0];
        if (task.due_date && task.due_date.startsWith(today)) return "FOCUS";

        if (task.due_date) return "PLAN";
        return "PLAN";
    };

    return (
        <>
            <p className="fixed bottom-0 left-0 p-2 text-xs text-muted-foreground hidden">
                Press{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Buscar tareas..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {loading && (
                        <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Buscando...
                        </div>
                    )}

                    {!loading && query.length > 0 && results.length === 0 && (
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    )}

                    {!loading && results.length > 0 && (
                        <CommandGroup heading="Resultados">
                            {results.map((task) => (
                                <CommandItem
                                    key={task.id}
                                    value={task.title}
                                    onSelect={() => handleSelectTask(task)}
                                >
                                    <div className="flex items-center gap-2">
                                        {getIcon(task)}
                                        <span>{task.title}</span>

                                        <span className="ml-2 text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                                            {getLocationLabel(task)}
                                        </span>

                                        {task.due_date && (
                                            <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {query.length === 0 && (
                        <CommandGroup heading="Sugerencias">
                            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/focus'))}>
                                <Target className="mr-2 h-4 w-4" />
                                <span>Focus</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/plan'))}>
                                <CalendarRange className="mr-2 h-4 w-4" />
                                <span>Plan</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/brain'))}>
                                <Brain className="mr-2 h-4 w-4" />
                                <span>Brain</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/shopping'))}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                <span>Shopping</span>
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
