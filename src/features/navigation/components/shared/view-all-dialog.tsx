"use client";

import * as Icons from "lucide-react";
import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { NavCard } from "../card/nav-card";

import type { NavCategory, NavItem } from "@/types/navigation";
import type { LucideIcon } from "lucide-react";

interface ViewAllDialogProps {
    category: NavCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateItem: (itemId: string, updates: Partial<NavItem>) => void;
    onDeleteItem: (itemId: string) => void;
    onAddItem: () => void;
}

export function ViewAllDialog({
    category,
    open,
    onOpenChange,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
}: ViewAllDialogProps) {
    if (!category) return null;

    const getIcon = (iconName: string): LucideIcon => {
        return (Icons as unknown as Record<string, LucideIcon>)[iconName] || Icons.Folder;
    };

    const CategoryIcon = getIcon(category.icon || "Folder");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CategoryIcon className="h-5 w-5" />
                        {category.name}
                        <span className="text-sm font-normal text-muted-foreground">
                            ({category.items.length} 个链接)
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
                    <div className="grid gap-2 sm:grid-cols-2 pr-2">
                        {category.items.map((item) => (
                            <NavCard
                                key={item.id}
                                item={item}
                                onUpdate={onUpdateItem}
                                onDelete={onDeleteItem}
                            />
                        ))}
                    </div>

                    {/* 添加链接按钮 */}
                    <button
                        onClick={() => {
                            onOpenChange(false);
                            setTimeout(onAddItem, 100);
                        }}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 p-4 text-sm text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary mr-2"
                    >
                        <Plus className="h-4 w-4" />
                        添加链接
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
