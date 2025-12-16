// components/search/mobile-search-btn.tsx

"use client";

import { Search } from "lucide-react";

export function MobileSearchBtn() {
    return (
        <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-lg border border-border"
        >
            <Search className="h-5 w-5" />
        </button>
    );
}
