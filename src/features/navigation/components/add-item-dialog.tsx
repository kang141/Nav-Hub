"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getFaviconUrl, getColorFromString } from "@/lib/favicon-cache";

interface AddItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (url: string, title: string, description: string) => void;
}

export function AddItemDialog({
    open,
    onOpenChange,
    onAdd,
}: AddItemDialogProps) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [faviconError, setFaviconError] = useState(false);

    const faviconUrl = url ? getFaviconUrl(url) : "";
    const iconColor = getColorFromString(title || url);
    const iconText = (title || "站点").slice(0, 2);

    // 当 URL 改变时，尝试自动填充标题
    useEffect(() => {
        if (url && !title) {
            try {
                const hostname = new URL(url).hostname.replace("www.", "");
                setTitle(hostname.split(".")[0]);
            } catch {
                // 忽略无效 URL
            }
        }
        setFaviconError(false);
    }, [url]);

    const handleAdd = () => {
        if (url.trim() && title.trim()) {
            onAdd(url.trim(), title.trim(), description.trim());
            setUrl("");
            setTitle("");
            setDescription("");
            onOpenChange(false);
        }
    };

    const isValidUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">添加链接</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* 预览 */}
                    <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background border overflow-hidden">
                            {faviconUrl && !faviconError && isValidUrl(url) ? (
                                <img
                                    src={faviconUrl}
                                    alt="favicon"
                                    className="h-7 w-7 object-contain"
                                    onError={() => setFaviconError(true)}
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
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{title || "站点名称"}</p>
                            <p className="text-sm text-muted-foreground truncate">
                                {description || "站点描述"}
                            </p>
                        </div>
                    </div>

                    {/* 网址 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">网址</label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="h-12 text-base"
                        />
                    </div>

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

                    {/* 描述 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">描述（可选）</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="简短描述"
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
                        disabled={!url.trim() || !title.trim() || !isValidUrl(url)}
                        className="h-11 px-6"
                    >
                        添加
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
