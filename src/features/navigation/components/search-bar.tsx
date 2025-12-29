"use client";

import { useState, useEffect, useRef } from "react";

import { Search, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SEARCH_ENGINES = {
    google: {
        name: "Google",
        url: "https://www.google.com/search?q=",
        icon: "🔍",
    },
    bing: {
        name: "Bing",
        url: "https://www.bing.com/search?q=",
        icon: "🅱️",
    },
    baidu: {
        name: "百度",
        url: "https://www.baidu.com/s?wd=",
        icon: "🔎",
    },
} as const;

type SearchEngine = keyof typeof SEARCH_ENGINES;

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [engine, setEngine] = useState<SearchEngine>("google");
    const inputRef = useRef<HTMLInputElement>(null);

    // 从 localStorage 读取上次选择的搜索引擎
    useEffect(() => {
        const saved = localStorage.getItem("search-engine") as SearchEngine;
        if (saved && SEARCH_ENGINES[saved]) {
            setEngine(saved);
        }
    }, []);

    // 保存搜索引擎选择
    const handleEngineChange = (newEngine: SearchEngine) => {
        setEngine(newEngine);
        localStorage.setItem("search-engine", newEngine);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                inputRef.current?.blur();
                setQuery("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.open(
                `${SEARCH_ENGINES[engine].url}${encodeURIComponent(query)}`,
                "_blank"
            );
        }
    };

    const currentEngine = SEARCH_ENGINES[engine];

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-8 lg:px-16">
            <div className="relative flex items-center">
                {/* 搜索引擎选择 */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="absolute left-3 z-10 flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <span>{currentEngine.icon}</span>
                            <span className="hidden sm:inline">{currentEngine.name}</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {Object.entries(SEARCH_ENGINES).map(([key, value]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => handleEngineChange(key as SearchEngine)}
                                className={engine === key ? "bg-accent" : ""}
                            >
                                <span className="mr-2">{value.icon}</span>
                                {value.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* 搜索输入框 */}
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索..."
                    className="h-12 rounded-xl border-muted-foreground/20 bg-muted/50 pl-24 pr-16 text-base placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-background sm:pl-28"
                />

                {/* 快捷键提示 */}
                <kbd className="absolute right-4 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    Enter
                </kbd>
            </div>
        </form>
    );
}
