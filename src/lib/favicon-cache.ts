// Favicon 缓存管理

const CACHE_KEY = "favicon-cache";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 天

interface FaviconCache {
    [domain: string]: {
        url: string;
        timestamp: number;
    };
}

// 获取缓存
function getCache(): FaviconCache {
    if (typeof window === "undefined") return {};
    try {
        const cache = localStorage.getItem(CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch {
        return {};
    }
}

// 保存缓存
function setCache(cache: FaviconCache): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // 忽略存储错误
    }
}

// 从 URL 获取域名
export function getDomain(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return "";
    }
}

// 获取 favicon URL（带缓存）
export function getFaviconUrl(url: string): string {
    const domain = getDomain(url);
    if (!domain) return "";

    const cache = getCache();
    const cached = cache[domain];

    // 检查缓存是否有效
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.url;
    }

    // 生成新的 favicon URL
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    // 更新缓存
    cache[domain] = {
        url: faviconUrl,
        timestamp: Date.now(),
    };
    setCache(cache);

    return faviconUrl;
}

// 预设的图标背景色
export const ICON_COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#eab308", // yellow
    "#84cc16", // lime
    "#22c55e", // green
    "#14b8a6", // teal
    "#06b6d4", // cyan
    "#0ea5e9", // sky
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#a855f7", // purple
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#f43f5e", // rose
];

// 根据字符串生成一致的颜色
export function getColorFromString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return ICON_COLORS[Math.abs(hash) % ICON_COLORS.length];
}
