"use client";

import { useState, useEffect } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    const [time, setTime] = useState("");
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("zh-CN", { hour12: false }));

            const hour = now.getHours();
            if (hour < 6) setGreeting("夜深了，注意休息");
            else if (hour < 9) setGreeting("早上好，新的一天开始了");
            else if (hour < 12) setGreeting("上午好，工作顺利");
            else if (hour < 14) setGreeting("中午好，记得吃饭");
            else if (hour < 18) setGreeting("下午好，继续加油");
            else if (hour < 22) setGreeting("晚上好，放松一下");
            else setGreeting("夜深了，早点休息");
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="flex items-center justify-between px-8 py-6 lg:px-16">
            <div>
                <h1 className="text-2xl font-semibold text-primary">Hi, 欢迎回来</h1>
                <p className="mt-1 text-sm text-muted-foreground">{greeting}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-2xl font-mono font-medium tabular-nums">{time}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
