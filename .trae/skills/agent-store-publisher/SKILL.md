---
name: "agent-store-publisher"
description: "Standardized workflow to publish new apps to Agent Store. Invoke when user asks to add/publish/onboard a new app/agent/tool to the store."
---

# Agent Store Publisher -- 上架新应用

将一个新应用（Agent）上架到 Agent Store 的标准化操作流程。

---

## 一、触发条件

用户说出以下任意意图时触发：
- "上架/发布/添加/注册一个应用到商店"
- "把这个xxx上架到 agent store"
- "做个 agent/应用并上架"
- "对 agent 的创建有什么要求"
- "上架xxx需要哪些字段"

## 二、Agent 数据规范

### 2.1 字段定义

```json
{
  "id": "kebab-case-identifier",
  "name": "显示名称",
  "description": "一句话描述（20-50 字）",
  "icon": "一个 emoji 图标",
  "iconBg": "Tailwind 渐变色",
  "category": "分类名称",
  "externalUrl": "外链地址",
  "embedUrl": "iframe 内嵌地址",
  "lastUpdated": "YYYY-MM-DD",
  "featured": false
}
```

### 2.2 字段要求

| 字段 | 必填 | 规范 |
|------|------|------|
| `id` | Y | kebab-case，全小写英文+连字符 |
| `name` | Y | 2-15 个字符，实际品牌名 |
| `description` | Y | 20-50 字，产品定位+核心能力 |
| `icon` | Y | 单个 emoji |
| `iconBg` | Y | `from-X-X to-Y-Y` 格式 |
| `category` | Y | 从现有分类中选择或新增 |
| `externalUrl` | Y | 完整 URL |
| `embedUrl` | Y | iframe 内嵌用地址 |
| `lastUpdated` | Y | 当天日期 |
| `featured` | Y | 默认 false |

### 2.3 iconBg 色系对照

- 科技/专业: from-blue-600 to-indigo-700
- 对话/AI: from-violet-600 to-purple-700
- 创意/设计: from-pink-500 to-rose-600
- 生产/效率: from-amber-500 to-orange-600
- 金融/数据: from-green-600 to-emerald-700
- 系统/管理: from-slate-600 to-gray-700
- 教育/学习: from-teal-500 to-cyan-600
- 创新/工具: from-purple-600 to-indigo-700
- 默认: from-gray-600 to-slate-700

### 2.4 现有分类

1. 对话助手
2. 搜索研究
3. 开发工具
4. 生产力
5. 创意设计
6. 金融投资
7. 演示
8. 系统管理
9. 创新工具
10. 学习教育
11. 简历

## 三、上架前置检查

### 步骤 A: 检查 X-Frame-Options

```bash
curl -s -I "https://example.com" | grep -i "x-frame-options\\|content-security-policy"
```

- 返回空 -> 支持 iframe 内嵌
- 返回 DENY/SAMEORIGIN -> 不支持内嵌，但外链仍可用

### 步骤 B: 检查 id 唯一性

确保 id 在 agents.json 中不存在，避免重复。

## 四、推送部署流程

### 4.1 推送两个文件

| 文件 | 用途 |
|------|------|
| `src/data/agents.json` | 前端构建数据源 |
| `public/agents.json` | 运行时静态数据 |

### 4.2 GitHub API 推送

```python
import json, base64, requests

TOKEN = "YOUR_GITHUB_TOKEN"
H = {"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github.v3+json"}
OWNER = "chmjk12-sketch"
REPO = "Turin-genius"

# Read
r = requests.get(f"https://api.github.com/repos/{OWNER}/{REPO}/contents/src/data/agents.json", headers=H)
src_info = r.json()
data = json.loads(base64.b64decode(src_info['content']).decode('utf-8'))
data['agents'].append(new_agent)

# Push src/data/agents.json
b64 = base64.b64encode(json.dumps(data, ensure_ascii=False, indent=2).encode()).decode()
requests.put(f"https://api.github.com/repos/{OWNER}/{REPO}/contents/src/data/agents.json", headers=H, json={
    "message": "feat: add agent-name",
    "content": b64,
    "sha": src_info['sha']
})

# Read + push public/agents.json
r2 = requests.get(f"https://api.github.com/repos/{OWNER}/{REPO}/contents/public/agents.json", headers=H)
pub_info = r2.json()
pub_data = json.loads(base64.b64decode(pub_info['content']).decode('utf-8'))
pub_data['agents'].append(new_agent)
requests.put(f"https://api.github.com/repos/{OWNER}/{REPO}/contents/public/agents.json", headers=H, json={
    "message": "feat: sync public agents.json",
    "content": base64.b64encode(json.dumps(pub_data, ensure_ascii=False, indent=2).encode()).decode(),
    "sha": pub_info['sha']
})
```

### 4.3 验证部署

```bash
# 等待约 2-3 分钟，然后检查
curl -s "http://39.105.86.184:3006/agents.json" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f'Total: {len(d[\"agents\"])}')"
```

## 五、快速上架模板

```json
{
  "id": "my-app-name",
  "name": "应用名称",
  "description": "一句话描述，包含产品定位和核心能力。",
  "icon": "\U0001f680",
  "iconBg": "from-blue-600 to-indigo-700",
  "category": "选择合适的分类",
  "externalUrl": "https://example.com",
  "embedUrl": "https://example.com",
  "lastUpdated": "YYYY-MM-DD",
  "featured": false
}
```

### 示例：简历 Agent

```json
{
  "id": "resume-agent",
  "name": "简历 Agent",
  "description": "智能简历分析与优化工具，支持简历解析、匹配评估、优化建议、面试问题生成。",
  "icon": "\U0001f4c4",
  "iconBg": "from-teal-500 to-cyan-600",
  "category": "简历",
  "externalUrl": "http://39.105.86.184:3010/",
  "embedUrl": "http://39.105.86.184:3010/",
  "lastUpdated": "2025-06-16",
  "featured": false
}
```

## 六、常见问题

Q: 不支持 iframe 内嵌怎么办？
A: 添加 embedSupported: false 字段，前端会显示为"仅外链"。

Q: 部署失败怎么办？
A: 1) 检查 Actions 日志  2) SSH 超时则用阿里云 RunCommand API  3) 检查容器日志

Q: 如何设为推荐？
A: featured 设为 true，或管理后台点"设为推荐"。

Q: 可以新增分类吗？
A: 可以，分类名不重复即可自动创建。
