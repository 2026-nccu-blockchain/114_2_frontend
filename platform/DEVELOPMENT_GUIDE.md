# 项目开发指南

## 快速开始

### 本地开发环境设置

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
# http://localhost:5173
```

### 环境变量配置

复制 `.env.example` 到 `.env` 并根据需要修改:

```bash
cp .env.example .env
```

配置项:
- `VITE_API_URL`: API基础URL (默认: https://example.com)
- `VITE_APP_NAME`: 应用名称
- `VITE_LOG_LEVEL`: 日志级别 (debug/info/warn/error)
- `VITE_ENABLE_MONITORING`: 是否启用监控

---

## 项目结构和最佳实践

### 1. 创建新页面

**步骤1**: 创建页面组件 `src/pages/MyPage.tsx`

```typescript
import { useState } from 'react'

export const MyPage = () => {
  const [data, setData] = useState(null)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Page</h1>
      {/* Page content */}
    </div>
  )
}
```

**步骤2**: 在 `src/App.tsx` 添加路由

```typescript
import { MyPage } from '@/pages/MyPage'

<Route path="/my-page" element={<MyPage />} />
```

### 2. 创建API服务

**步骤1**: 定义类型 `src/types/myService.ts`

```typescript
export interface MyData {
  id: string
  name: string
  description: string
}
```

**步骤2**: 创建API服务 `src/services/myService.api.ts`

```typescript
import { apiClient } from './api'
import type { ApiResponse } from '@/types'
import type { MyData } from '@/types/myService'

export const myServiceApi = {
  // GET /api/my-service
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<MyData[]>>('/my-service')
    return response.data
  },

  // GET /api/my-service/:id
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<MyData>>(`/my-service/${id}`)
    return response.data
  },

  // POST /api/my-service
  create: async (data: Omit<MyData, 'id'>) => {
    const response = await apiClient.post<ApiResponse<MyData>>('/my-service', data)
    return response.data
  },

  // PUT /api/my-service/:id
  update: async (id: string, data: Partial<MyData>) => {
    const response = await apiClient.put<ApiResponse<MyData>>(`/my-service/${id}`, data)
    return response.data
  },

  // DELETE /api/my-service/:id
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/my-service/${id}`)
    return response.data
  },
}
```

**步骤3**: 在 `src/services/index.ts` 导出

```typescript
export { myServiceApi } from './myService.api'
```

### 3. 使用Hook调用API

**创建Hook** `src/hooks/useMyService.ts`

```typescript
import { useCallback, useState } from 'react'
import { myServiceApi } from '@/services'
import { handleAsyncError, getErrorMessage } from '@/utils'
import type { MyData } from '@/types/myService'

export const useMyService = () => {
  const [data, setData] = useState<MyData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await handleAsyncError(
      () => myServiceApi.getAll(),
      (err) => {
        const message = getErrorMessage(err)
        setError(message)
      }
    )

    setLoading(false)
    if (result) {
      setData(result.data)
    }
  }, [])

  return { data, loading, error, fetchAll }
}
```

**在组件中使用**:

```typescript
import { useMyService } from '@/hooks'

export const MyComponent = () => {
  const { data, loading, error, fetchAll } = useMyService()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### 4. 状态管理

使用Zustand创建新store:

```typescript
// src/store/myStore.ts
import { create } from 'zustand'

interface MyState {
  myValue: string
  setMyValue: (value: string) => void
}

export const useMyStore = create<MyState>((set) => ({
  myValue: '',
  setMyValue: (value) => set({ myValue: value }),
}))
```

使用:

```typescript
import { useMyStore } from '@/store'

function Component() {
  const { myValue, setMyValue } = useMyStore()
  return <input value={myValue} onChange={(e) => setMyValue(e.target.value)} />
}
```

### 5. 创建通用组件

**创建组件** `src/components/common/Button.tsx`

```typescript
import type { ButtonHTMLAttributes } from 'react'
import { classNames } from '@/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  const baseClass = 'font-semibold rounded transition-colors'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={classNames(baseClass, variantClasses[variant], sizeClasses[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### 6. 错误处理

```typescript
import { handleError, handleAsyncError, getErrorMessage } from '@/utils'

// 同步错误处理
try {
  // Some operation
} catch (error) {
  const apiError = handleError(error)
  console.error(apiError)
}

// 异步错误处理
const result = await handleAsyncError(
  async () => {
    // API call
  },
  (error) => {
    const message = getErrorMessage(error)
    // Show user message
  }
)
```

---

## 代码规范

### TypeScript

- 始终定义函数的返回类型
- 尽量避免使用 `any`，使用 `unknown` + 类型守卫
- 使用 `type` 定义接口类型，使用 `interface` 定义对象/类结构

### React

- 使用函数组件，不使用类组件
- 使用 Hook 管理状态和副作用
- 解构 props 时添加类型
- 使用 JSDoc 注释重要组件

```typescript
/**
 * 用户信息卡片
 * @param user - 用户对象
 * @param onEdit - 编辑回调
 */
export const UserCard = ({ user, onEdit }: UserCardProps) => {
  return <div>...</div>
}
```

### 导入路径

**✅ 推荐**:
```typescript
import { useAuth } from '@/hooks'
import { userApi } from '@/services'
import type { IUser } from '@/types'
import { Button } from '@/components/common'
```

**❌ 避免**:
```typescript
import { useAuth } from '../../../../hooks'
import { userApi } from '../../services'
```

---

## 日常开发工作流

### 开发流程

```bash
# 1. 拉取最新代码
git pull origin develop

# 2. 创建功能分支
git checkout -b feature/your-feature-name

# 3. 启动开发服务器
npm run dev

# 4. 编写代码，定期提交
git add .
git commit -m "feat: add new feature"

# 5. 运行代码检查
npm run lint
npm run lint:fix

# 6. 类型检查
npm run type-check

# 7. 推送到远程
git push origin feature/your-feature-name

# 8. 创建 Pull Request
```

### 代码审查清单

提交PR之前，请确保:

- [ ] 代码遵循项目规范
- [ ] 已运行 `npm run lint:fix`
- [ ] 已运行 `npm run type-check` 无错误
- [ ] 代码有适当的注释
- [ ] 没有console.log调试代码
- [ ] 没有硬编码的API地址或密钥

---

## 常见问题

### Q: 如何修改API地址?
A: 修改 `.env` 文件中的 `VITE_API_URL`:
```
VITE_API_URL=https://your-api.com
```

### Q: 如何添加新的全局类型?
A: 在 `src/types/` 目录创建新文件，然后在 `src/types/index.ts` 导出:
```typescript
export type { MyType } from './myType'
```

### Q: 如何调试API请求?
A: 在浏览器开发者工具的Network标签查看，或检查浏览器console日志。

### Q: 如何处理认证token?
A: 已集成在 `authStore` 和 API拦截器中，token自动添加到请求头。

---

## 性能建议

1. **代码分割**: 使用 React.lazy 和 Suspense
2. **图片优化**: 使用合适的图片格式和大小
3. **Bundle分析**: 定期检查包大小
4. **缓存策略**: 合理使用浏览器缓存和HTTP缓存
5. **监控**: 添加性能监控和错误追踪

---

## 资源链接

- [React文档](https://react.dev)
- [TypeScript文档](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand文档](https://github.com/pmndrs/zustand)
- [Axios文档](https://axios-http.com)

---

**有问题？** 请联系技术负责人或在项目内提交Issue。
