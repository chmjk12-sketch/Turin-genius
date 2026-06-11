---
name: "agent-store-manager"
description: "管理 Agent Store 应用商店：上架/下架/修改应用、调整布局架构、更新分类、修改样式主题。Invoke when user mentions adding/updating/removing an agent/app/tool to the store, changing store layout/UI, modifying categories, updating agent data, deploying store changes, or any store management task."
---

# Agent Store Manager

管理 Agent Store 应用商店的统一入口。支持本地开发调试和云端自动部署两种模式。

## 触发词（广泛匹配）

以下任意关键词都会触发此 Skill：
- **上架/发布/添加/新增/注册** + (agent/app/应用/工具/商店/store)
- **下架/删除/移除/隐藏** + (agent/app/应用/工具)
- **修改/更新/调整/替换** + (布局/架构/样式/主题/分类/分类顺序/卡片/侧边栏/搜索/头部)
- **部署/发布/上线** + (商店/store/变更/修改)
- **商店管理** / **Store 管理** / **应用管理**
- **换个布局** / **调整UI** / **改主题** / **换颜色**
- **新增分类** / **删除分类** / **调整分类顺序**
- **改一下agent** / **更新应用信息** / **替换推荐位**

## 核心能力

### 1. 应用上架（新增 Agent）

```
用户：上架一个叫"代码审查助手"的应用，分类是开发工具
```

操作步骤：
1. 读取 `src/data/agents.json`
2. 在 `agents` 数组末尾添加新对象：
   ```json
   {
     "id": "code-review-assistant",
     "name": "代码审查助手",
     "description": "AI 驱动的代码审查工具，自动检测潜在 Bug、安全漏洞和性能问题。",
     "icon": "🔍",
     "iconBg": "from-blue-600 to-indigo-700",
     "category": "开发工具",
     "externalUrl": "https://example.com",
     "embedUrl": "https://example.com",
     "lastUpdated": "2025-06-11",
     "featured": false
   }
   ```
3. 推送到 GitHub 触发自动部署
4. 验证线上效果

### 2. 应用下架（删除 Agent）

```
用户：下架 Demo Embed
```

操作步骤：
1. 读取 `src/data/agents.json`
2. 从 `agents` 数组中移除对应 id 的对象
3. 推送到 GitHub 触发自动部署

### 3. 调整布局架构

```
用户：把搜索框放到侧边栏顶部
用户：卡片改成三列布局
用户：推荐区改成横向滚动
```

涉及文件：
- `src/components/layout/MainHeader.tsx` — 头部布局
- `src/components/layout/Sidebar.tsx` — 侧边栏布局
- `src/components/agents/AgentGrid.tsx` — 卡片网格布局
- `src/components/agents/AgentSection.tsx` — 推荐区布局
- `src/App.tsx` — 整体页面结构
- `src/index.css` — 全局样式

操作步骤：
1. 读取需要修改的组件文件
2. 根据用户需求调整 JSX 结构和 Tailwind 类名
3. 推送到 GitHub 触发自动部署
4. 验证线上效果

### 4. 修改分类体系

```
用户：新增一个"学习教育"分类，放到第一排
用户：把"开发工具"改成"编程开发"
用户：删除"演示"分类
```

操作步骤：
1. 读取 `src/data/agents.json`
2. 修改对应 agent 的 `category` 字段
3. 分类顺序由 `useAgents.ts` 中的 `extractCategories` 函数自动按 agents 数据动态提取
4. 推送到 GitHub 触发自动部署

### 5. 修改样式主题

```
用户：把主题改成蓝色系
用户：卡片圆角改小一点
用户：侧边栏宽度加宽
```

涉及文件：
- `src/index.css` — CSS 变量和全局样式
- `src/components/agents/AgentCard.tsx` — 卡片样式
- `src/components/layout/Sidebar.tsx` — 侧边栏样式

### 6. 更新应用信息

```
用户：把 ChatGPT 的描述改一下
用户：Cursor 的链接换成新的
用户：给 Notion AI 加个 featured 标记
```

操作步骤：
1. 读取 `src/data/agents.json`
2. 修改对应字段
3. 推送到 GitHub 触发自动部署

## 部署流程（统一）

不管是本地修改还是云端修改，部署流程一致：

```
修改源码 → GitHub Contents API 推送 → Actions 自动构建 → ACR 推送镜像 → ECS 部署 → Caddy 生效
```

### 推送文件清单

| 修改类型 | 需要推送的文件 |
|---------|--------------|
| 上架/下架/修改 Agent | `src/data/agents.json` |
| 调整布局 | 对应组件 `.tsx` 文件 |
| 修改样式 | `src/index.css` + 对应组件 |
| 修改分类 | `src/data/agents.json` |
| 修改主题 | `src/index.css` |

### GitHub 配置

- **仓库**: `chmjk12-sketch/Turin-genius`
- **Token**: 由用户提供，首次操作时通过浏览器存储
- **部署域名**: `https://turin-genius.chmjk67.top`

### 推送代码模板

```python
import base64, requests

TOKEN = "用户提供"  # 从上下文获取
H = {"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github.v3+json"}
OWNER = "chmjk12-sketch"
REPO = "Turin-genius"

def push_file(path, content_bytes, message):
    r = requests.get(f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}", headers=H)
    sha = r.json().get("sha") if r.status_code == 200 else None
    payload = {"message": message, "content": base64.b64encode(content_bytes).decode()}
    if sha:
        payload["sha"] = sha
    r = requests.put(f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}", headers=H, json=payload)
    return r.status_code in (200, 201)
```

### 验证部署

```python
import requests, time

# 轮询 Actions 状态
for i in range(30):
    r = requests.get(f'https://api.github.com/repos/chmjk12-sketch/Turin-genius/actions/runs?per_page=1', 
                     headers=H)
    run = r.json().get('workflow_runs', [{}])[0]
    if run.get('status') == 'completed':
        print(f"部署{'成功' if run.get('conclusion') == 'success' else '失败'}")
        break
    time.sleep(10)
```

## 文件结构速查

```
src/
├── data/
│   └── agents.json          # Agent 数据源（上架/下架/修改信息）
├── components/
│   ├── agents/
│   │   ├── AgentCard.tsx    # 卡片组件（改卡片样式）
│   │   ├── AgentGrid.tsx    # 网格布局（改列数/间距）
│   │   └── AgentSection.tsx # 推荐区（改推荐区布局）
│   ├── layout/
│   │   ├── MainHeader.tsx   # 头部（改搜索框位置/样式）
│   │   └── Sidebar.tsx      # 侧边栏（改分类展示/宽度）
│   └── ui/
│       └── SearchBar.tsx    # 搜索框组件
├── hooks/
│   └── useAgents.ts         # 分类提取逻辑（分类自动从数据生成）
├── App.tsx                  # 整体布局（改页面结构）
└── index.css                # 全局样式（改主题色/变量）
```

## Agent 数据格式

```typescript
interface Agent {
  id: string              // 唯一标识（kebab-case）
  name: string            // 显示名称
  description: string     // 描述文本（建议 50-80 字）
  icon: string            // Emoji 图标或 URL
  iconBg: string          // Tailwind 渐变类，如 "from-violet-600 to-indigo-700"
  category: string        // 分类名称
  externalUrl: string     // 外链地址
  embedUrl: string        // 内嵌 iframe 地址
  lastUpdated: string     // 日期格式 "YYYY-MM-DD"
  featured?: boolean      // 是否推荐（true 会出现在推荐区）
}
```

## 注意事项

1. **分类自动提取**：分类顺序由 `useAgents.ts` 动态计算，按 agents 数据中 category 字段出现顺序排列，"推荐"始终置顶
2. **featured 应用**：`featured: true` 的 Agent 会出现在"推荐 Agent"区域，最多显示前 4 个
3. **图标渐变**：`iconBg` 使用 Tailwind 的 `from-* to-*` 渐变类，可选值参考 Tailwind 颜色文档
4. **部署耗时**：端到端约 2-3 分钟（GitHub Actions 构建 + Docker 镜像推送 + ECS 部署）
5. **iframe 限制**：部分外部站点（如 ChatGPT、Claude）设置了 X-Frame-Options，内嵌会失败，但外链始终可用
