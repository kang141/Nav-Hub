# Next.js 16+ 项目 AI 理解规范文档

## 1. 技术栈规范 (TECHNOLOGY STACK)

### 1.1 核心框架

```typescript
- framework: 'Next.js 16+' // 必须使用 App Router 模式
- react: '19.x'
- language: 'TypeScript 5.x' // 必须启用 strict 严格模式
```

### 1.2 依赖库矩阵

```typescript
// UI & Styling
- styling: 'Tailwind CSS v4' // 原子化 CSS 框架
- ui_components: ['shadcn/ui', 'Konsta UI'] // 组件库组合使用
- animations: 'Framer Motion' // 所有交互必须包含动画

// State Management
- client_state: 'Zustand' // 轻量级客户端状态
- server_state: 'TanStack Query' // 服务端数据缓存

// Validation & Data
- validation: 'Zod Schema' // 运行时类型校验
- request_pattern: 'Server Actions + Client API 混合架构'
```

---

## 2. 项目结构规范 (PROJECT ARCHITECTURE)

### 2.1 目录树规则

```
src/ // 源代码根目录
├── app/ // Next.js App Router 页面路由
│   ├── (group)/ // 路由组命名：kebab-case，括号包裹
│   │   ├── layout.tsx // 必须存在布局文件
│   │   └── page.tsx // 页面入口文件
│   ├── api/ // API Routes (仅用于 Edge Functions)
│   ├── actions/ // Server Actions 集中目录
│   └── globals.css // 全局样式入口
│
├── features/ // 功能模块 (FEATURE-BASED 架构核心)
│   └── {feature-name}/ // 功能命名：kebab-case
│       ├── components/ // 该功能专用组件 (PascalCase.tsx)
│       ├── hooks/ // 功能专用 Hooks (camelCase.ts)
│       ├── lib/ // 功能工具函数 (kebab-case.ts)
│       ├── types/ // 功能类型定义 (PascalCase.ts)
│       └── actions/ // 功能 Server Actions (kebab-case.ts)
│
├── components/ // 全局通用组件 (PascalCase.tsx)
├── hooks/ // 全局通用 Hooks (camelCase.ts)
├── lib/ // 全局工具函数 (kebab-case.ts)
├── stores/ // Zustand 状态管理 (kebab-case.ts)
├── types/ // 全局 TypeScript 类型 (PascalCase.ts)
├── services/ // API 服务层
└── styles/ // 全局样式文件
```

### 2.2 目录创建规则

- **MANDATORY**: 每个 `features/{feature}` 必须包含 `components/` 和 `types/` 子目录
- **RECOMMENDED**: 当功能包含 3 个以上工具函数时，必须创建 `lib/` 子目录
- **MANDATORY**: `shared/` 功能模块用于跨功能共享代码

---

## 3. 命名规范 (NAMING CONVENTIONS)

### 3.1 命名矩阵表

| 元素类型      | 命名模式         | 示例             | 文件扩展   | 适用范围            |
| ------------- | ---------------- | ---------------- | ---------- | ------------------- |
| React 组件    | PascalCase       | `UserProfile`    | `.tsx`     | 所有组件文件        |
| 函数/变量     | camelCase        | `getUserInfo`    | `.ts/.tsx` | 函数、变量、Hooks   |
| 常量          | UPPER_SNAKE_CASE | `API_BASE_URL`   | `.ts`      | 全局常量、配置项    |
| 类型/接口     | PascalCase       | `UserResponse`   | `.ts`      | TypeScript 类型定义 |
| 工具文件      | kebab-case       | `date-utils.ts`  | `.ts`      | 工具函数文件        |
| 页面目录      | kebab-case       | `user-profile/`  | 目录       | `app` 下的目录      |
| 功能模块      | kebab-case       | `user-auth/`     | 目录       | `features` 下的目录 |
| Store 文件    | kebab-case       | `user-store.ts`  | `.ts`      | Zustand store 文件  |
| Server Action | kebab-case       | `create-user.ts` | `.ts`      | Server Actions 文件 |

### 3.2 命名冲突解决规则

- **CASE**: 当组件名与类型名冲突时，类型后加 `Type` 后缀
  - **EXAMPLE**: `UserProfile.tsx` 组件 vs `UserProfileType.ts` 类型
- **CASE**: 当 Hook 返回多个值时，使用数组解构命名
  - **EXAMPLE**: `const [user, setUser] = useUserState();`

---

## 4. 导入顺序规范 (IMPORT ORDER)

### 4.1 导入分组规则 (MUST FOLLOW)

```typescript
/*
 * 导入顺序：从上到下，按组分隔，每组内部按字母序
 * 使用空行分隔不同组
 */

// Group 1: React & Next.js 核心
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Group 2: 第三方库
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// Group 3: 内部组件 (按路径深度排序)
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/features/user/components/user-profile";

// Group 4: Hooks & Utils (按类型分组)
import { useUser } from "@/hooks/use-user";
import { formatDate } from "@/lib/date-utils";

// Group 5: 类型 (类型导入必须带 type 关键字)
import type { UserResponse } from "@/types/user";
import type { Metadata } from "next";

// Group 6: Store & 常量
import { useUserStore } from "@/stores/user-store";
import { API_BASE_URL } from "@/lib/constants";
```

### 4.2 导入语句格式

- **MUST**: 类型导入必须使用 `import type { ... }` 语法
- **MUST**: 使用路径别名 `@/` 代替相对路径 `../../`
- **AVOID**: 禁止使用 `*` 通配符导入
- **MUST**: 每个导入语句占一行

---

## 5. 组件开发规范 (COMPONENT DEVELOPMENT)

### 5.1 组件基础规则 (MANDATORY)

```typescript
// ✅ CORRECT: 函数式组件 + TypeScript Props
interface UserProfileProps {
  userId: string;
  className?: string; // 必须支持 className 扩展
}

export function UserProfile({ userId, className }: UserProfileProps) {
  // 组件逻辑
}

// ❌ WRONG: Class 组件或缺少类型
export class UserProfile extends React.Component { ... } // 禁止使用
export function UserProfile(props) { ... } // 缺少类型定义
```

### 5.2 组件文件结构

```typescript
// 每个组件文件必须包含：
1. 导入语句 (按导入顺序规范)
2. Props 接口定义
3. 主组件函数
4. 内部逻辑 & 子组件
5. 导出语句 (默认或命名)
```

### 5.3 动画实现规范 (MANDATORY)

```typescript
// 按钮点击动画
<motion.button
  whileTap={{ scale: 0.95 }} // 必须添加缩放反馈
  transition={{ duration: 0.1 }}
>
  点击我
</motion.button>

// 页面切换动画
<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    initial={{ opacity: 0, x: 20 }} // 从右侧滑入
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }} // 向左侧滑出
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>

// 列表项交错动画
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1 // 必须设置交错延迟
      }
    }
  }}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.ul>
```

---

## 6. 状态管理规范 (STATE MANAGEMENT)

### 6.1 Zustand Store 模板

```typescript
// stores/user-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      { name: "user-storage" }
    )
  )
);
```

### 6.2 TanStack Query 使用规则

```typescript
// ❌ WRONG: 在组件内直接调用 API
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);
}

// ✅ CORRECT: 使用 useQuery
function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId], // MUST: 查询键必须包含唯一标识
    queryFn: () => getUser(userId), // MUST: 纯函数调用
    staleTime: 1000 * 60 * 5, // RECOMMENDED: 5分钟缓存
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBoundary error={error} />;
}
```

---

## 7. API 服务层规范 (API SERVICE LAYER)

### 7.1 请求封装模板

```typescript
// services/api-client.ts
import { z } from "zod";
import { API_BASE_URL } from "@/lib/constants";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // MANDATORY: 统一错误处理
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // MUST: 非 2xx 响应抛出错误
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message || "Request failed");
    }

    // MUST: Zod 运行时验证
    const data = await response.json();
    return this.validate(data, this.responseSchema);
  }

  // MANDATORY: 使用 Zod 验证响应
  private validate<T>(data: unknown, schema: z.ZodSchema<T>): T {
    return schema.parse(data);
  }
}

export const api = new ApiClient();
```

### 7.2 服务组织规则

```typescript
// services/user-service.ts
import { api } from "./api-client";
import { UserResponseSchema } from "@/features/user/types/user-types";

// MUST: 每个 API 函数独立导出
export async function getUser(userId: string) {
  return api.request(`/users/${userId}`, {
    method: "GET",
    schema: UserResponseSchema, // Zod schema 验证
  });
}

export async function createUser(data: CreateUserInput) {
  return api.request("/users", {
    method: "POST",
    body: JSON.stringify(data),
    schema: UserCreatedSchema,
  });
}
```

---

## 8. 类型定义规范 (TYPE DEFINITIONS)

### 8.1 类型文件组织

```typescript
// types/user.ts (全局类型)
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// features/user/types/user-dto.ts (功能特有类型)
import { z } from "zod";

// MUST: Zod schema 必须同步导出
export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

// MUST: 推导 TypeScript 类型
export type UserResponse = z.infer<typeof UserResponseSchema>;
```

### 8.2 通用响应类型

```typescript
// types/api-response.ts
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

// MUST: 使用联合类型
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

---

## 9. 代码质量规范 (CODE QUALITY)

### 9.1 TypeScript 严格模式 (MANDATORY)

```typescript
// tsconfig.json 必须配置
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 9.2 性能优化规则

```typescript
// ✅ CORRECT: 使用性能优化 Hooks
const UserList = React.memo(function UserList({ users }: { users: User[] }) {
  const filteredUsers = useMemo(() => users.filter((u) => u.isActive), [users]);

  const handleClick = useCallback((id: string) => {
    console.log("User clicked:", id);
  }, []);

  return <div>...</div>;
});

// ❌ WRONG: 不必要的重新渲染
function UserList({ users }) {
  return users.map((user) => <UserCard user={user} />); // UserCard 未 memo
}
```

### 9.3 错误处理规范

```typescript
// MUST: 所有 API 调用使用 try-catch
async function handleSubmit() {
  try {
    setLoading(true);
    await createUser(formData);
    toast.success("创建成功");
  } catch (error) {
    // MUST: 错误类型检查
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error("未知错误");
      console.error("Unexpected error:", error);
    }
  } finally {
    setLoading(false);
  }
}
```

---

## 10. Git 提交规范 (GIT COMMITS)

### 10.1 提交消息格式

```bash
# 格式：<type>: <description> (全小写)
# 示例：
feat: 添加用户认证功能
fix: 修复登录页面跳转错误
docs: 更新 API 文档
style: 格式化代码缩进
refactor: 提取公共组件逻辑
perf: 优化图片加载性能
test: 添加用户创建测试用例
chore: 升级 Next.js 到 16.1
```

### 10.2 提交范围规则

- **MUST**: 每个提交只包含单一类型变更
- **MUST**: 描述不超过 50 字符
- **RECOMMENDED**: 重大变更在描述后加 `!` 标记
  - 示例: `feat!: 移除废弃的用户 API`

---

## 11. 环境变量管理 (ENVIRONMENT VARIABLES)

### 11.1 变量前缀规则

```bash
# 客户端可访问 (MUST 前缀)
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_MAX_UPLOAD_SIZE=10485760

# 服务端专用 (禁止 NEXT_PUBLIC_ 前缀)
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET=your-secret-key
API_KEY_PRIVATE=sk-xxxxxxxx

# 敏感变量
ENCRYPTION_KEY=your-256-bit-key
```

### 11.2 环境文件规则

```bash
# .env.local (本地开发，不提交)
# .env.production (生产环境，可提交加密版本)
# .env.test (测试环境)

# MUST: .gitignore 配置
.env.local
.env.*.local
.env.development
.env.test
```

---

## 12. SEO 优化规范 (SEO OPTIMIZATION)

### 12.1 Metadata 配置

```typescript
// app/layout.tsx (静态 Metadata)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "My App - 默认标题",
    template: "%s | My App", // 页面标题模板
  },
  description: "应用描述，155-160字符，包含关键词",
  keywords: ["Next.js", "React", "TypeScript"],
  authors: [{ name: "Team" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://example.com",
    title: "OpenGraph 标题",
    description: "OpenGraph 描述",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter 标题",
    description: "Twitter 描述",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// app/user/[id]/page.tsx (动态 Metadata)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(params.id);
  return {
    title: `${user.name} - 用户详情`,
    description: `查看 ${user.name} 的详细信息和活动`,
    openGraph: {
      images: [user.avatar],
    },
  };
}
```

### 12.2 SEO 最佳实践检查清单

```typescript
// ✅ MUST 实现
- URL 长度 < 100 字符，使用短横线分隔: `/user-profile/123`
- 标题长度 < 60 字符，包含主关键词
- 描述长度 155-160 字符，包含行动号召
- 所有图片必须有 alt 属性: `<img alt="用户头像 - 张三">`
- 使用 `<Image>` 组件并配置 priority 属性
- 实现结构化数据: `application/ld+json`
- 移动端 viewport 配置: `<meta name="viewport" content="width=device-width, initial-scale=1">`
```

---

## 13. 性能优化规范 (PERFORMANCE)

### 13.1 图片优化规则

```typescript
// ✅ CORRECT: 优先加载关键图片
<Image
  src="/hero-image.png"
  alt="首页主图"
  priority // 首屏图片必须添加
  width={1200}
  height={600}
  quality={85} // 默认质量
/>

// ✅ CORRECT: 懒加载非关键图片
<Image
  src="/gallery/image-1.png"
  alt="画廊图片 1"
  loading="lazy" // 非首屏使用懒加载
  placeholder="blur"
  blurDataURL="/gallery/image-1-blur.png"
/>
```

### 13.2 代码分割规则

```typescript
// ✅ CORRECT: 动态导入大型组件
import dynamic from "next/dynamic";

const HeavyChart = dynamic(
  () => import("@/components/heavy-chart").then((mod) => mod.HeavyChart),
  {
    ssr: false, // 根据是否需要 SEO 配置
    loading: () => <Skeleton />,
  }
);

// ✅ CORRECT: 动态导入库
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
```

### 13.3 动画性能规则

```typescript
// ✅ MUST: 使用 GPU 加速属性
<motion.div
  animate={{
    transform: 'translateX(100px)', // ✅ 使用 transform
    opacity: 1, // ✅ 使用 opacity
  }}
/>

// ❌ AVOID: 触发重排的属性
<motion.div
  animate={{
    width: '200px', // ❌ 触发重排
    height: '200px', // ❌ 触发重排
    top: '50px', // ❌ 触发重排
    left: '50px', // ❌ 触发重排
  }}
/>
```

---

## 14. 安全策略 (SECURITY)

### 14.1 敏感信息规则

```typescript
// ❌ CRITICAL: 禁止硬编码
const API_KEY = "sk-1234567890"; // 严重违规
const PASSWORD = "admin123"; // 严重违规

// ✅ CORRECT: 使用环境变量
const API_KEY = process.env.API_KEY_PRIVATE;
const PASSWORD = process.env.ADMIN_PASSWORD;

// ✅ CORRECT: 客户端代码检查
if (typeof window !== "undefined") {
  // 客户端逻辑，可使用 NEXT_PUBLIC_ 变量
}
```

### 14.2 操作安全规则

```typescript
// MUST: 重要操作必须包含
1. 自动备份机制: 操作前创建快照
2. 影响范围检测: 计算变更影响的资源数量
3. 确认对话框: 显示影响范围并要求二次确认
4. 操作日志: 记录操作人、时间、变更内容
5. 回滚机制: 提供一键回滚功能
```

---

## 15. 开发流程规范 (DEVELOPMENT WORKFLOW)

### 15.1 任务拆解规则

```typescript
// MUST: 复杂需求按以下步骤拆解
/*
1. 分析需求 -> 输出: 功能清单 (Feature List)
2. 拆解功能 -> 输出: 任务卡片 (Task Cards)
3. 评估依赖 -> 输出: 依赖关系图 (Dependency Graph)
4. 优先级排序 -> 输出: 执行顺序 (Execution Order)
5. 分步实现 -> 每个任务必须:
   - 编码实现
   - 单元测试
   - 代码自检
   - 提交代码
*/

// ✅ EXAMPLE: 用户认证功能拆解
- [Task 1] 创建用户类型定义 (依赖: 无)
- [Task 2] 实现注册 API 服务 (依赖: Task 1)
- [Task 3] 创建注册表单组件 (依赖: Task 1, 2)
- [Task 4] 实现注册页面 (依赖: Task 3)
```

### 15.2 代码自检清单

```typescript
// MUST: 提交代码前检查
- [ ] 所有 TypeScript 错误已修复
- [ ] 所有 console.log 已删除
- [ ] 所有 API 调用有错误处理
- [ ] 所有组件有动画效果
- [ ] 所有图片有 alt 属性
- [ ] 环境变量未硬编码
- [ ] 代码符合命名规范
- [ ] 导入顺序正确
- [ ] 性能优化已应用 (memo, useMemo, useCallback)
- [ ] 移动端样式已测试
```

### 15.3 决策规则

```typescript
// MUST: 当遇到以下情况时必须询问
1. 需求不明确或存在歧义
2. 技术选型影响项目架构
3. 性能与安全权衡
4. 涉及第三方服务集成
5. 影响现有功能的行为变更

// ✅ 决策流程
遇到问题 -> 整理选项 -> 记录优缺点 -> 发起讨论 -> 等待确认
```

---

## 16. AI 理解辅助元数据 (AI METADATA)

### 16.1 代码生成规则

```typescript
// 当生成代码时，AI 必须:
1. 遵循所有上述规范
2. 在注释中标注规范编号
3. 为复杂逻辑添加解释性注释
4. 提供使用示例
5. 指出潜在的性能/安全风险

// ✅ EXAMPLE:
/**
 * [Rule 9.3] 获取用户信息
 * @param userId - 用户 ID (UUID 格式)
 * @returns 验证后的用户数据
 * @throws {ApiError} 当请求失败时
 * @security 包含敏感数据，需服务端调用
 */
export async function getUser(userId: string): Promise<User> {
  // Zod 验证确保运行时类型安全 [Rule 8.1]
  const validatedId = z.string().uuid().parse(userId);
  // ...
}
```

### 16.2 规范优先级

```typescript
// 冲突解决顺序 (从高到低)
1. 安全策略 (Security) - 最高优先级
2. TypeScript 严格模式
3. 命名规范
4. 组件规范
5. 性能优化
6. SEO 优化
7. 其他规范
```

---

## 17. 快速参考表 (QUICK REFERENCE)

| 场景     | 必须使用的工具/模式                 | 禁止使用的模式        |
| -------- | ----------------------------------- | --------------------- |
| API 请求 | TanStack Query + Zod 验证           | 直接 fetch + 无类型   |
| 组件状态 | Zustand (客户端)                    | Redux (除非特殊理由)  |
| 表单验证 | Zod Schema                          | 手动验证              |
| 动画     | Framer Motion CSS transform/opacity | width/height/top/left |
| 图片加载 | Next/Image + priority/blurDataURL   | 原生 img 标签         |
| 错误处理 | try-catch + ApiError 类             | 静默失败              |
| 代码分割 | dynamic() + ssr 选项                | 同步导入大组件        |

---

**文档版本**: 1.0  
**最后更新**: 2025-12-26  
**适用范围**: 所有 Next.js 16+ 项目代码生成与审查
