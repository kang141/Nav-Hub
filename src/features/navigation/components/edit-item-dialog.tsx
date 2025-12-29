"use client";

import { useState, useEffect } from "react";

import { Check } from "lucide-react";
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
import { getFaviconUrl, getColorFromString, ICON_COLORS } from "@/lib/favicon-cache";

import type { NavItem } from "@/types/navigation";

interface EditItemDialogProps {
    item: NavItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (updates: Partial<NavItem>) => void;
}

export function EditItemDialog({
    item,
    open,
    onOpenChange,
    onSave,
}: EditItemDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [useTextIcon, setUseTextIcon] = useState(false);
    const [iconColor, setIconColor] = useState("");
    const [faviconError, setFaviconError] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const faviconUrl = item ? getFaviconUrl(item.url) : "";

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setDescription(item.description);
            setUseTextIcon(item.useTextIcon || false);
            setIconColor(item.iconColor || getColorFromString(item.title));
            setFaviconError(false);
            setShowColorPicker(false);
        }
    }, [item]);

    const handleSave = () => {
        onSave({ title, description, useTextIcon, iconColor });
        onOpenChange(false);
    };

    const iconText = title.slice(0, 2) || "站点";

    const handleIconClick = () => {
        if (useTextIcon) {
            setShowColorPicker(!showColorPicker);
        } else {
            setUseTextIcon(true);
            setShowColorPicker(true);
        }
    };

    const renderIcon = () => {
        if (useTextIcon) {
            return (
                <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl text-white font-bold text-2xl cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: iconColor }}
                    onClick={handleIconClick}
                >
                    {iconText}
                </div>
            );
        }

        return (
            <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-background shadow-sm border overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={handleIconClick}
            >
                {faviconUrl && !faviconError ? (
                    <img
                        src={faviconUrl}
                        alt={`${title} icon`}
                        className="h-12 w-12 object-contain"
                        onError={() => setFaviconError(true)}
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-white font-bold text-2xl"
                        style={{ backgroundColor: iconColor }}
                    >
                        {iconText}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">编辑站点</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* 预览区域 */}
                    <div className="flex items-center gap-6 rounded-xl bg-muted/50 p-6">
                        {renderIcon()}

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold truncate">{title || "站点名称"}</h3>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {description || "站点简介"}
                            </p>
                            {item && (
                                <p className="mt-2 text-xs text-muted-foreground/60 truncate">
                                    {item.url}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 提示文字 */}
                    <p className="text-sm text-muted-foreground">
                        点击图标可切换为文字图标模式
                    </p>

                    {/* 颜色选择器 */}
                    {showColorPicker && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3"
                        >
                            <label className="text-sm font-medium">选择背景色</label>
                            <div className="grid grid-cols-8 gap-2">
                                {ICON_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setIconColor(color)}
                                        className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-transform hover:scale-110"
                                        style={{ backgroundColor: color }}
                                    >
                                        {iconColor === color && (
                                            <Check className="h-5 w-5 text-white" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* 恢复官方图标按钮 */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setUseTextIcon(false);
                                    setShowColorPicker(false);
                                }}
                                className="mt-2"
                            >
                                恢复官方图标
                            </Button>
                        </motion.div>
                    )}

                    {/* 名称 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">名称</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="站点名称"
                            className="h-12 text-base"
                        />
                    </div>

                    {/* 简介 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">简介</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="站点简介"
                            className="h-12 text-base"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11 px-6">
                        取消
                    </Button>
                    <Button onClick={handleSave} className="h-11 px-6">
                        保存
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
