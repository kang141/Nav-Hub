"use client";

import { useState } from "react";

import { Pencil, Trash2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditItemDialog } from "./edit-item-dialog";
import { ConfirmDialog } from "../shared/confirm-dialog";
import { getFaviconUrl, getColorFromString } from "@/lib/favicon-cache";

import type { NavItem } from "@/types/navigation";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface NavCardProps {
    item: NavItem;
    onUpdate: (itemId: string, updates: Partial<NavItem>) => void;
    onDelete?: (itemId: string) => void;
    dragHandleProps?: {
        attributes: DraggableAttributes;
        listeners: SyntheticListenerMap | undefined;
    };
}

export function NavCard({ item, onUpdate, onDelete, dragHandleProps }: NavCardProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const faviconUrl = getFaviconUrl(item.url);
    const iconColor = item.iconColor || getColorFromString(item.title);
    const iconText = item.title.slice(0, 2);

    const handleSave = (updates: Partial<NavItem>) => {
        onUpdate(item.id, updates);
    };

    const handleDelete = () => {
        onDelete?.(item.id);
        setDeleteOpen(false);
    };

    const renderIcon = () => {
        if (item.useTextIcon) {
            return (
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: iconColor }}
                >
                    {iconText}
                </div>
            );
        }

        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/80 overflow-hidden">
                {faviconUrl && !imgError ? (
                    <img
                        src={faviconUrl}
                        alt={`${item.title} icon`}
                        className="h-6 w-6 object-contain"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: iconColor }}
                    >
                        {iconText}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex items-center gap-3 rounded-xl bg-card/50 p-3 transition-colors hover:bg-card border border-transparent hover:border-border/50"
                    >
                        {/* 拖拽手柄 */}
                        {dragHandleProps && (
                            <div
                                {...dragHandleProps.attributes}
                                {...dragHandleProps.listeners}
                                className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 transition-opacity -ml-1"
                            >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}

                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 flex-1 min-w-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {renderIcon()}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-foreground truncate text-sm">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                    {item.description}
                                </p>
                            </div>
                        </a>
                    </motion.div>
                </ContextMenuTrigger>

                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        自定义
                    </ContextMenuItem>
                    {onDelete && (
                        <>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                                onClick={() => setDeleteOpen(true)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                            </ContextMenuItem>
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            <EditItemDialog
                item={item}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="删除链接"
                description={`确定要删除「${item.title}」吗？此操作无法撤销。`}
                onConfirm={handleDelete}
                confirmText="删除"
                destructive
            />
        </>
    );
}
