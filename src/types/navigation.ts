export interface NavItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string; // lucide 图标名称（备用）
  favicon?: string; // 缓存的 favicon URL
  useTextIcon?: boolean; // 是否使用文字图标
  iconColor?: string; // 文字图标的背景色
}

export interface NavCategory {
  id: string;
  name: string;
  shortName: string;
  icon?: string;
  items: NavItem[];
}
