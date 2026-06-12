import express from 'express';
import { Octokit } from '@octokit/rest';

const app = express();
app.use(express.json());

const PORT = process.env.API_PORT || 3001;
const GITHUB_TOKEN = process.env.GH_PAT_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'chmjk12-sketch';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Turin-genius';
const LLM_API_URL = process.env.LLM_API_URL || '';
const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_MODEL = process.env.LLM_MODEL || 'deepseek-chat';

// ====== LLM: 自然语言 → 结构化 Agent 数据 ======
async function parseNaturalLanguage(input) {
  const systemPrompt = `你是一个 Agent Store 管理助手。用户会用自然语言描述一个 AI Agent 应用，你需要提取结构化信息。

返回 JSON 格式（不要 markdown 代码块）：
{
  "name": "应用名称",
  "description": "一句话描述（中文，20-50字）",
  "category": "分类（如：对话助手、搜索研究、开发工具、生产力、创意设计、金融投资、演示）",
  "icon": "一个 emoji 图标",
  "iconBg": "Tailwind 渐变色（如 from-blue-600 to-indigo-700）",
  "externalUrl": "应用的官网 URL",
  "embedUrl": "同 externalUrl",
  "embedSupported": true 或 false（外部大厂站点一般 false）,
  "featured": false
}

规则：
- iconBg 根据应用风格选择合适的渐变色
- 如果用户没提供 URL，设 externalUrl 为空字符串
- 如果不确定分类，选最接近的
- embedSupported: 如果是 chatgpt.com、claude.ai、notion.so 等大厂站点设为 false，其他设为 true
- 只返回 JSON，不要其他文字`;

  const res = await fetch(LLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM API 错误 (${res.status}): ${errText}`);
  }

  const data = await res.json();
  let text = data.choices?.[0]?.message?.content || '';

  // 清理 markdown 代码块
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const parsed = JSON.parse(text);

  // 校验必填字段
  if (!parsed.name || !parsed.description) {
    throw new Error('LLM 返回的数据缺少必填字段 (name/description)');
  }

  // 生成 id
  parsed.id = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');

  parsed.lastUpdated = new Date().toISOString().split('T')[0];

  return parsed;
}

// ====== GitHub API: 读取 agents.json ======
async function getAgentsFile(path, octokit) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { sha: data.sha, content };
  } catch (e) {
    throw new Error(`获取 ${path} 失败: ${e.message}`);
  }
}

// ====== GitHub API: 推送 agents.json ======
async function pushAgentsFile(path, content, sha, octokit) {
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message: `feat: add agent via natural language [skip ci]`,
    content: Buffer.from(content).toString('base64'),
    sha,
  });
  return data;
}

// ====== API: 智能添加 Agent ======
app.post('/api/agents/add', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== 'string' || input.trim().length < 2) {
      return res.status(400).json({ error: '请输入 Agent 描述（至少2个字符）' });
    }

    // Step 1: LLM 解析
    const agentData = await parseNaturalLanguage(input.trim());

    // Step 2: 读取当前 agents.json
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    const srcFile = await getAgentsFile('src/data/agents.json', octokit);
    const srcData = JSON.parse(srcFile.content);

    // 检查是否已存在同名 agent
    const exists = srcData.agents.some(a => a.id === agentData.id || a.name === agentData.name);
    if (exists) {
      return res.status(409).json({
        error: `Agent "${agentData.name}" 已存在`,
        agent: agentData,
      });
    }

    // Step 3: 添加到数组末尾
    srcData.agents.push(agentData);
    const newContent = JSON.stringify(srcData, null, 2);

    // Step 4: 推送两个文件
    await pushAgentsFile('src/data/agents.json', newContent, srcFile.sha, octokit);

    const pubFile = await getAgentsFile('public/agents.json', octokit);
    const pubData = JSON.parse(pubFile.content);
    pubData.agents.push(agentData);
    await pushAgentsFile('public/agents.json', JSON.stringify(pubData, null, 2), pubFile.sha, octokit);

    res.json({
      success: true,
      message: `已添加 "${agentData.name}" 到 Agent Store`,
      agent: agentData,
    });

  } catch (e) {
    console.error('添加 Agent 失败:', e);
    res.status(500).json({ error: e.message || '服务器内部错误' });
  }
});

// ====== API: 健康检查 ======
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    github_configured: !!GITHUB_TOKEN,
    llm_configured: !!LLM_API_URL && !!LLM_API_KEY,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Admin API 服务运行在 http://0.0.0.0:${PORT}`);
  console.log(`GitHub: ${GITHUB_TOKEN ? '已配置' : '未配置'}`);
  console.log(`LLM: ${LLM_API_URL ? '已配置' : '未配置'}`);
});
