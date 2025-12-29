"use client";

import { useState, useEffect, useId } from "react";

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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { Header, SearchBar, AddCategoryDialog } from "@/features/navigation";
import { DraggableCategory } from "@/features/navigation/components/draggable-category";
import { useNavigationStore, type NavigationState } from "@/stores/navigation-store";

import type { NavCategory } from "@/types/navigation";

export default function Home() {
  const categories = useNavigationStore((state: NavigationState) => state.categories);
  const addCategory = useNavigationStore((state: NavigationState) => state.addCategory);
  const reorderCategories = useNavigationStore((state: NavigationState) => state.reorderCategories);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dndContextId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      reorderCategories(active.id as string, over.id as string);
    }
  };

  const handleAddCategory = (name: string, shortName: string, icon: string) => {
    const newCategory: NavCategory = {
      id: `category-${Date.now()}`,
      name,
      shortName,
      icon,
      items: [],
    };
    addCategory(newCategory);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部 */}
      <Header />

      {/* 搜索框 */}
      <div className="py-8">
        <SearchBar />
      </div>

      {/* 主内容区 - 瀑布流布局 + 拖拽 */}
      <main className="px-8 pb-16 lg:px-16">
        {isMounted ? (
          <DndContext
            id={dndContextId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map((c) => c.id)}
              strategy={rectSortingStrategy}
            >
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                {/* 分类列表 */}
                {categories.map((category) => (
                  <DraggableCategory key={category.id} category={category} />
                ))}

                {/* 添加分类 */}
                <div className="mb-6 break-inside-avoid">
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Plus className="h-4 w-4" />
                      <h2 className="text-sm font-medium">添加分类</h2>
                    </div>
                    <button
                      onClick={() => setAddCategoryOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-sm text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      <Plus className="h-5 w-5" />
                      新建分类
                    </button>
                  </section>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          // SSR 占位，避免 hydration 不匹配
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {categories.map((category) => (
              <div key={category.id} className="mb-6 break-inside-avoid">
                <section className="space-y-3 rounded-xl bg-card/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                    <h2 className="text-sm font-medium">{category.name}</h2>
                  </div>
                  <div className="space-y-2">
                    {category.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="h-12 animate-pulse rounded-lg bg-muted/50"
                      />
                    ))}
                  </div>
                </section>
              </div>
            ))}
          </div>
        )}
      </main>

      <AddCategoryDialog
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onAdd={handleAddCategory}
      />
    </div>
  );
}
