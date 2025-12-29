import { create } from "zustand";
import { persist } from "zustand/middleware";

import { navigationData as defaultData } from "@/data/navigation-data";

import type { NavCategory, NavItem } from "@/types/navigation";

export interface NavigationState {
    categories: NavCategory[];
    updateItem: (categoryId: string, itemId: string, updates: Partial<NavItem>) => void;
    addItem: (categoryId: string, item: NavItem) => void;
    deleteItem: (categoryId: string, itemId: string) => void;
    addCategory: (category: NavCategory) => void;
    deleteCategory: (categoryId: string) => void;
    reorderCategories: (activeId: string, overId: string) => void;
    reorderItems: (categoryId: string, activeId: string, overId: string) => void;
    resetToDefault: () => void;
}

export const useNavigationStore = create<NavigationState>()(
    persist(
        (set) => ({
            categories: defaultData,

            updateItem: (categoryId, itemId, updates) =>
                set((state) => ({
                    categories: state.categories.map((category) =>
                        category.id === categoryId
                            ? {
                                ...category,
                                items: category.items.map((item) =>
                                    item.id === itemId ? { ...item, ...updates } : item
                                ),
                            }
                            : category
                    ),
                })),

            addItem: (categoryId, item) =>
                set((state) => ({
                    categories: state.categories.map((category) =>
                        category.id === categoryId
                            ? { ...category, items: [...category.items, item] }
                            : category
                    ),
                })),

            deleteItem: (categoryId, itemId) =>
                set((state) => ({
                    categories: state.categories.map((category) =>
                        category.id === categoryId
                            ? { ...category, items: category.items.filter((item) => item.id !== itemId) }
                            : category
                    ),
                })),

            addCategory: (category) =>
                set((state) => ({
                    categories: [...state.categories, category],
                })),

            deleteCategory: (categoryId) =>
                set((state) => ({
                    categories: state.categories.filter((cat) => cat.id !== categoryId),
                })),

            reorderCategories: (activeId, overId) =>
                set((state) => {
                    const oldIndex = state.categories.findIndex((cat) => cat.id === activeId);
                    const newIndex = state.categories.findIndex((cat) => cat.id === overId);
                    if (oldIndex === -1 || newIndex === -1) return state;

                    const newCategories = [...state.categories];
                    const [removed] = newCategories.splice(oldIndex, 1);
                    newCategories.splice(newIndex, 0, removed);
                    return { categories: newCategories };
                }),

            reorderItems: (categoryId, activeId, overId) =>
                set((state) => ({
                    categories: state.categories.map((category) => {
                        if (category.id !== categoryId) return category;

                        const oldIndex = category.items.findIndex((item) => item.id === activeId);
                        const newIndex = category.items.findIndex((item) => item.id === overId);
                        if (oldIndex === -1 || newIndex === -1) return category;

                        const newItems = [...category.items];
                        const [removed] = newItems.splice(oldIndex, 1);
                        newItems.splice(newIndex, 0, removed);
                        return { ...category, items: newItems };
                    }),
                })),

            resetToDefault: () => set({ categories: defaultData }),
        }),
        { name: "navigation-storage" }
    )
);
