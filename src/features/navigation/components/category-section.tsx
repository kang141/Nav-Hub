"use client";

import { useState, useId } from "react";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, ChevronRight, GripVertical, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DraggableNavCard } from "./draggable-nav-card";
import { AddItemDialog } from "./add-item-dialog";
import { ViewAllDialog } from "./view-all-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { useNavigationStore, type NavigationState } from "@/stores/navigation-store";

import type { NavCategory, NavItem } from "@/types/navigation";
import type { LucideIcon } from "lucide-react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const MAX_VISIBLE_ITEMS = 4;

interface CategorySectionProps {
    category: NavCategory;
    dragHandleProps?: {
        attributes: DraggableAttributes;
        listeners: SyntheticListenerMap | undefined;
    };
    isDragging?: boolean;
}

export function CategorySection({ category, dragHandleProps, isDragging }: CategorySectionProps) {
    const updateItem = useNavigationStore((state: NavigationState) => state.updateItem);
    const addItem = useNavigationStore((state: NavigationState) => state.addItem);
    const deleteItem = useNavigationStore((state: NavigationState) => state.deleteItem);
    const deleteCategory = useNavigationStore((state: NavigationState) => state.deleteCategory);
    const reorderItems = useNavigationStore((state: NavigationState) => state.reorderItems);
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [viewAllOpen, setViewAllOpen] = useState(false);
    const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
    const dndContextId = useId();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            reorderItems(category.id, active.id as string, over.id as string);
        }
    };

    const handleUpdateItem = (itemId: string, updates: Partial<NavItem>) => {
        updateItem(category.id, itemId, updates);
    };

    const handleAddItem = (url: string, title: string, description: string) => {
        addItem(category.id, {
            id: `item-${Date.now()}`,
            title,
            description,
            url,
        });
    };

    const handleDeleteItem = (itemId: string) => {
        deleteItem(category.id, itemId);
    };

    const handleDeleteCategory = () => {
        deleteCategory(category.id);
        setDeleteCategoryOpen(false);
    };

    const getIcon = (iconName: string): LucideIcon => {
        return (Icons as unknown as Record<string, LucideIcon>)[iconName] || Icons.Folder;
    };

    const CategoryIcon = getIcon(category.icon || "Folder");
    const visibleItems = category.items.slice(0, MAX_VISIBLE_ITEMS);
    const hasMore = category.items.length > MAX_VISIBLE_ITEMS;

    return (
        <section className="space-y-3">
            {/* 分类标题 - 可拖拽区域 + 右键菜单 */}
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div
                        {...dragHandleProps?.attributes}
                        {...dragHandleProps?.listeners}
                        className={`group flex items-center gap-2 text-muted-foreground rounded-lg px-2 py-1 -mx-2 transition-colors ${dragHandleProps ? "cursor-grab active:cursor-grabbing hover:bg-muted/50" : ""
                            } ${isDragging ? "opacity-50" : ""}`}
                    >
                        {dragHandleProps && (
                            <GripVertical className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                        <CategoryIcon className="h-4 w-4" />
                        <h2 className="text-sm font-medium flex-1">{category.name}</h2>
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setAddItemOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        添加链接
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={() => setDeleteCategoryOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除分类
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            {/* 链接列表 */}
            <div className="space-y-2">
                <DndContext
                    id={dndContextId}
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={visibleItems.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {visibleItems.map((item) => (
                            <DraggableNavCard
                                key={item.id}
                                item={item}
                                onUpdate={handleUpdateItem}
                                onDelete={handleDeleteItem}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {/* 查看更多按钮 */}
                {hasMore && (
                    <button
                        onClick={() => setViewAllOpen(true)}
                        className="flex w-full items-center justify-center gap-1 rounded-xl bg-muted/30 p-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                        查看全部 {category.items.length} 个
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}

                {/* 添加链接按钮 */}
                <button
                    onClick={() => setAddItemOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 p-3 text-sm text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary"
                >
                    <Plus className="h-4 w-4" />
                    添加链接
                </button>
            </div>

            <AddItemDialog
                open={addItemOpen}
                onOpenChange={setAddItemOpen}
                onAdd={handleAddItem}
            />

            <ViewAllDialog
                category={category}
                open={viewAllOpen}
                onOpenChange={setViewAllOpen}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={() => setAddItemOpen(true)}
            />

            <ConfirmDialog
                open={deleteCategoryOpen}
                onOpenChange={setDeleteCategoryOpen}
                title="删除分类"
                description={`确定要删除分类「${category.name}」及其所有 ${category.items.length} 个链接吗？此操作无法撤销。`}
                onConfirm={handleDeleteCategory}
                confirmText="删除"
                destructive
            />
        </section>
    );
}
