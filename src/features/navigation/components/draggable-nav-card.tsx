"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { NavCard } from "./nav-card";

import type { NavItem } from "@/types/navigation";

interface DraggableNavCardProps {
    item: NavItem;
    onUpdate: (itemId: string, updates: Partial<NavItem>) => void;
    onDelete: (itemId: string) => void;
}

export function DraggableNavCard({ item, onUpdate, onDelete }: DraggableNavCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <NavCard
                item={item}
                onUpdate={onUpdate}
                onDelete={onDelete}
                dragHandleProps={{ attributes, listeners }}
            />
        </div>
    );
}
