"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { CategorySection } from "./category-section";

import type { NavCategory } from "@/types/navigation";

interface DraggableCategoryProps {
    category: NavCategory;
}

export function DraggableCategory({ category }: DraggableCategoryProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`mb-6 break-inside-avoid ${isDragging ? "z-50" : ""}`}
        >
            <CategorySection
                category={category}
                dragHandleProps={{ attributes, listeners }}
                isDragging={isDragging}
            />
        </div>
    );
}
