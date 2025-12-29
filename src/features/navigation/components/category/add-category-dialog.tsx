"use client";

import { useState } from "react";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS = [
    "Folder", "Star", "Heart", "Bookmark", "Tag", "Hash",
    "Code", "Code2", "Terminal", "Database", "Server", "Cloud",
    "Globe", "Link", "ExternalLink", "Share2", "Rss",
    "MessageSquare", "Mail", "Bell", "Search", "Settings",
    "Zap", "Flame", "Sparkles", "Lightbulb", "Target",
    "Bot", "Brain", "Cpu", "Smartphone", "Monitor",
    "Image", "Camera", "Video", "Music", "Headphones",
    "BookOpen", "GraduationCap", "Award", "Trophy",
    "ShoppingCart", "CreditCard", "Wallet", "DollarSign",
    "Calendar", "Clock", "CheckSquare", "ListTodo",
    "Palette", "Paintbrush", "Pen", "Pencil",
    "Play", "Download", "Upload", "FileText",
];

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (name: string, shortName: string, icon: string) => void;
}

export function AddCategoryDialog({
    open,
    onOpenChange,
    onAdd,
}: AddCategoryDialogProps) {
    const [name, setName] = useState("");
    const [shortName, setShortName] = useState("");
    const [icon, setIcon] = useState("Folder");
    const [showIconPicker, setShowIconPicker] = useState(false);

    const getIcon = (iconName: string): LucideIcon => {
        return (Icons as unknown as Record<string, LucideIcon>)[iconName] || Icons.Folder;
    };

    const SelectedIcon = getIcon(icon);

    const handleAdd = () => {
        if (name.trim() && shortName.trim()) {
            onAdd(name.trim(), shortName.trim(), icon);
            setName("");
            setShortName("");
            setIcon("Folder");
            onOpenChange(false);
        }
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (value.length >= 2 && !shortName) {
            setShortName(value.slice(0, 2));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">添加分类</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* 图标选择 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">图标</label>
                        <div className="relative">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-4 h-12"
                                onClick={() => setShowIconPicker(!showIconPicker)}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    <SelectedIcon className="h-5 w-5" />
                                </div>
                                <span>{icon}</span>
                            </Button>

                            {showIconPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute left-0 top-full z-50 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border bg-popover p-3 shadow-lg"
                                >
                                    <div className="grid grid-cols-8 gap-2">
                                        {CATEGORY_ICONS.map((iconName) => {
                                            const IconComponent = getIcon(iconName);
                                            return (
                                                <button
                                                    key={iconName}
                                                    onClick={() => {
                                                        setIcon(iconName);
                                                        setShowIconPicker(false);
                                                    }}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent ${icon === iconName ? "bg-primary text-primary-foreground" : ""
                                                        }`}
                                                >
                                                    <IconComponent className="h-4 w-4" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* 分类名称 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">分类名称</label>
                        <Input
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="例如：常用工具"
                            className="h-12 text-base"
                        />
                    </div>

                    {/* 简称 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">简称（两个字）</label>
                        <Input
                            value={shortName}
                            onChange={(e) => setShortName(e.target.value.slice(0, 2))}
                            placeholder="例如：常用"
                            maxLength={2}
                            className="h-12 text-base"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11 px-6">
                        取消
                    </Button>
                    <Button
                        onClick={handleAdd}
                        disabled={!name.trim() || !shortName.trim()}
                        className="h-11 px-6"
                    >
                        添加
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
