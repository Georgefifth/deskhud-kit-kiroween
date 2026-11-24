# Stage 2 — 竞争分析与开发

> 这是当前阶段的完整工作说明。开始前先读 `STATE.md`；完成后把证据写入 `evidence/`，更新 `STATE.md`，再读下一个阶段文件。不要提前执行后续阶段。
>
> 开始前先加载 `momen-headless-pipeline` 和 `momen-platform` skill；双轨架构、Aesthetic Cartridges（审美弹药库）、Momen MCP 操作、Legacy WebSocket 订阅协议与避坑规则以技能为准。

你现在担任产品负责人、UX 设计师和软件工程师，负责基于真实竞争分析持续改进当前产品。

目标：让产品在核心使用场景中比现有替代方案更有竞争力，而不是单纯堆砌功能。

### 第一阶段：竞争产品研究

1. 上网寻找至少 3–5 个直接或间接竞争产品。
2. 实际查看其官方网站、文档、演示、开源仓库及用户反馈。
3. 在条件允许时，实际体验竞品的公开功能，不要只看首页宣传。
4. 对比功能完整性、操作步骤、响应速度、视觉设计、易用性、价格和使用限制。
5. 找出竞品做得比我们更好的地方，不要刻意贬低竞争者。
6. 区分已验证事实和推测，附上来源链接。

### 第二阶段：产品审查

分析当前产品的真实用户工作流程，识别：

- 影响核心任务完成的问题
- 不必要的操作、重复输入和多余页面
- 视觉层级、信息架构与交互反馈问题
- 功能缺失、性能瓶颈和错误处理缺陷
- 可以删除或简化的功能
- 与优秀竞争者相比最明显的差距

所有优化必须回答：具体改善了什么？为什么值得做？怎么证明改善有效？

### 第三阶段：制定优化计划

根据用户价值、影响程度、开发成本和风险排列优先级。

优先执行：

1. 修复阻碍核心流程的缺陷。
2. 简化操作，减少不必要的复杂度。
3. 提高稳定性、响应速度与可访问性。
4. 完善真正有需求但尚未实现的核心功能。
5. 最后考虑有明确价值的创新功能。

禁止为了显得先进而加入无用 AI 功能、复杂动画、冗余 Dashboard 或其他功能。

对于重大功能变更，先评估是否会损害现有用户体验。

#### 写代码前：填写 `design/UX.md`

先把 `design/UX.md` 填完整，它是前端的验收契约，不是装饰文档。必须包含：

- 目标用户、核心任务、成功标准
- 页面清单，每页一个主操作
- 每页的空、加载、成功、错误、无效输入、无权限状态
- 从落地页到核心结果的步骤数和预期耗时
- 设计 tokens（字体、间距、颜色、圆角、触控尺寸）
- 2–3 个参考产品/截图，注明借鉴的是布局、流程还是状态处理
- 390px 移动端布局
- 视觉方向与选定的 Aesthetic Cartridge（配色理由、字体、密度、标志性元素）
- Momen Headless Backend 契约（表结构、GraphQL 操作、WebSocket 订阅、ZAI Agent、异步 Actionflow）
- UX 验收条件

参考可以是 Momen 模板、Stitch、Figma 或真实产品截图。只提炼模式，不复制品牌、文案和受版权保护的素材。

#### 视觉方向（禁止默认 AI 风格，启用 Aesthetic Cartridges）

在 `design/UX.md` 写清楚视觉方向，再开始写 UI：

- 从 `momen-headless-pipeline` 技能的 **Aesthetic Cartridges（审美弹药库）** 中选择或定制一套强约束视觉系统（例如 `01 // Swiss Brutalism` 裸露网格与高对比工业风、`02 // Kinetic Editorial Broadsheet` 不对称印刷大报风、`03 // Spatial Field Canvas` 物理力场/WebGL 坐标画布风，或针对产品领域的专属高定方向）。
- 用 3 个形容词定义气质，例如“冷静、精确、高密度”。
- 选择与产品类型匹配的原型：editor / canvas / terminal / dashboard / editorial / consumer / marketplace。
- 配色必须有理由；不要默认紫色渐变配深色背景。
- 最多 2–3 个字体家族（如 `Space Grotesk` / `Instrument Serif Italic` / `Syne` 搭配 `IBM Plex Mono`），用字号和字重建立戏剧化层级。
- 明确密度：工具型偏高密度，消费型偏留白。
- 设计 1 个标志性元素，让截图一眼能认出产品，例如 diff 视图、时间轴、波形、力场画布、命令面板或实时 WebSocket 帧监视器。
- 动效只用于反馈和层级，不做装饰。

除非有明确理由，不要使用这些默认套路：

- 紫色/蓝色渐变铺满背景
- 玻璃拟态卡片
- 居中大标题 + 三列功能卡
- 侧边栏 + KPI 卡片堆成的通用 Dashboard
- 所有元素都大圆角、重阴影
- emoji 当图标
- 默认 Inter + 灰色卡片网格
- 抽象光斑或粒子插图
- Lorem ipsum 和通用营销文案

**判断标准：** 把首屏截图放进任何另一个 SaaS 产品里都不违和，就说明没有设计方向，重做。

### 第四阶段：实施优化

#### 4.1 前端先行

先用 mock 数据实现完整前端，不接真实后端：

1. 先做 1 个核心页面的静态视觉样张（桌面 + 移动），确认视觉方向；不要一开始铺开所有页面。
2. 按 `design/UX.md` 实现页面、导航和表单。
3. 实现空、加载、成功、错误、无效输入等状态，不要只做 happy path。
4. 桌面 1440px 和移动 390px 截图，存入 `evidence/stage-2-build/frontend/`。
5. 扮演第一次使用的用户走完核心任务，记录步骤数、卡点和需要猜测的地方。
6. 对照 UX 契约修正，直到核心任务不需要文档也能完成。

#### 4.2 接后端（Momen Headless BaaS + MCP 双轨集成）

前端视觉样张与交互验收通过后，使用 **Momen MCP (`tools.momen.*`)** 构建真实云端后端并接入本地前端（不要把前端迁移进 Momen 的拖拽编辑器，保持本地代码 100% 视觉控制权）：

1. **云端 Momen 基础设施构建（Track A）**：
   - 使用 `create_project`（选 `appType: "WEB"` 以获得免费静态站点托管槽位）或 `set_current_project` 绑定项目，随后调用 `schema_session({ op: "LOAD" })` 预热会话。
   - **数据建模 (`database`)**：按单数 `snake_case` 创建 PostgreSQL 表、字段与关联关系（切勿手动创建 `*_id` 外键列，使用 `relations` 自动生成）。
   - **AI Agent (`zai` + `bindings`)**：如需 AI 能力，优先配置 `gemini-3.8-flash` 等支持流式与采样参数的模型（避开不支持 `temperature` 的 Reasoning 模型陷阱）；通过 `bindings` 将输入参数（路径 `["Context", "Input", "<arg>"]`）绑定进 Prompt。
   - **服务端工作流 (`actionflow` + `bindings`)**：免费计划限 **1 个 Actionflow**。简单单表 CRUD 与数值原子增减（`_inc`）直接由前端发 GraphQL Mutation，不要浪费 Actionflow 槽位；将唯一的 Actionflow 留给 **异步多步编排**（`isAsync: true`，如 `ZAI Agent → Insert/Update Record`）。若任务耗时超过 60 秒或需本地/云端 GPU，由 Actionflow 触发外部 Worker，Worker 完成后通过 GraphQL 写回 Momen。
   - **权限与发布 (`permissions` + `sync_backend`)**：注意每次建表/改字段都会重置角色权限。先调用 `GET_ROLE_DETAIL` 检查 `Anonymous User` 与 `Logged-in User` 权限并按需收敛或放行，执行 `schema_session({ op: "VALIDATE" })` 确认零错误后，调用 `sync_backend` 部署上线，并写入初始真实种子数据。
2. **本地高定前端接入（Track B）**：
   - 基于 `momen-headless-pipeline` 的 `reference/momen-ws-client.ts` 建立 `src/momenClient.ts`，连接 HTTP 端点（`https://villa.momen.app/zero/{projectExId}/api/graphql-v2`）与 Legacy `subscriptions-transport-ws` WebSocket 端点（`wss://villa.momen.app/zero/{projectExId}/api/graphql-subscription`）。
   - 注意 Momen 运行时细节：ZAI Mutation 参数名使用内部 `argKey`；异步 Actionflow 返回表对象 `Self option` 时，`COMPLETED` 载荷仅含 `{ id }`，需顺手查一次 `<table>_by_pk` 或通过表级 WebSocket 实时订阅自动同步完整行。
   - 保持 4.1 已验收的布局、文案和状态，不要因为接后端把界面改回“能跑就行”。
   - 每个接口、AI 流式响应和异步 Actionflow 都要有加载、实时进度反馈、失败和重试状态。
   - 接完后重跑 4.1 的截图和核心任务，确认没有回归。
   - 如果后端限制导致必须改界面，先更新 `design/UX.md`，再改代码。

#### 4.3 保留原则

根据优先级实际修改项目，保留原有有效功能，避免不必要的架构重写。

每项重要优化都需要明确验收条件。涉及操作效率的改进，应尽可能比较修改前后的操作步骤、耗时和任务成功率。

### 第五阶段：GitHub 与部署

人类负责登录和 2FA；你只使用已经认证好的 CLI 与 Momen MCP。开始前检查：

```bash
gh auth status
vercel whoami
render workspaces -o json >/dev/null && echo "render: authenticated"
```

（同时通过 `tools.momen.auth({ op: "WHOAMI" })` 检查 Momen 登录态；若未登录，调用 `tools.momen.auth({ op: "LOGIN" })` 或提示人类执行 `npx -y momen-mcp@latest login`。）

如果命令不存在或未登录，停止并给出安装/登录命令，等人类完成后继续。不要索要 token，不要把 token 写进仓库或对话。

1. 检查 Git 状态与远程仓库（确保 `.gitignore` 已忽略 `.momen-mcp/`、`node_modules/`、`dist/` 和 `.env*`）：

   ```bash
   git status
   git remote -v
   ```

2. 没有 GitHub 仓库才创建，已有仓库直接沿用：

   ```bash
   gh repo create <name> --public --source=. --remote=origin --push

   # 已有仓库但未配置 remote 时：
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. push 前检查敏感内容：

   ```bash
   git status --short
   git ls-files | grep -E '(^|/)\.env|(^|/)\.momen-mcp|\.pem$|\.key$|id_rsa|credentials' || true
   ```

   确认 `.env*`、`.momen-mcp/`、私钥、token、个人数据没有进入暂存区。发现就停止并清理，不要 push。

4. 按产品形态选择部署方式（Momen Headless 项目优先使用 **Momen Static Site Hosting** + 可选 GitHub Pages / Vercel 双备份）：

   - Momen Headless BaaS 前端构建产物（`./dist`） → **Momen Static Site Hosting**（`tools.momen.deploy_static_site`）
   - 纯静态站点 → GitHub Pages（默认）
   - 静态站点、SSR 或额外 Serverless API → Vercel
   - 超 60s 外部长任务 Worker / 自定义容器 → Render

5. Momen Static Site Hosting（推荐首选，与 Momen 后端同源配套）：

   - 先在本地运行 `npm run build` 生成包含 `index.html` 的 `./dist` 目录（注意关闭预压缩 `.gz`/`.br`）。
   - 调用 MCP 工具 `tools.momen.deploy_static_site({ dir: "./dist", target: "BETA" })`（或 CLI `npx -y momen-mcp@2.8.4 site deploy --dir ./dist --target BETA`）一键上传并获取线上预览 URL（`https://*.cave.momenapp.com`）。
   - 如需发布到正式 PROD 域名（`https://*.villa.momenapp.com`），需人类在弹出的原生确认框中输入项目 ID 批准。

6. GitHub Pages：

   - 构建产物发布到 `gh-pages` 分支，或使用仓库的 Pages workflow。
   - Vite/React 等 SPA 注意 `base` 路径和深链接 404 fallback。
   - 部署后验证 `https://<user>.github.io/<repo>/` 返回 200，且核心流程可用。

7. Vercel：

   ```bash
   vercel link --yes
   vercel --prod --yes
   ```

   需要 SPA rewrite 时添加 `vercel.json`，不要假设未配置的路由能直接工作。

8. Render：

   - 用 `render.yaml` 描述服务；首次创建服务如果必须在 Dashboard 点击，停下来让人类完成。
   - 后续部署：

     ```bash
     render deploys create <service-id> --wait
     ```

9. 部署完成后：

   - 用真实浏览器打开公开 URL，验证核心流程（包括 Momen GraphQL 数据读写、WebSocket 实时订阅和 ZAI/Actionflow 响应），而不是只看构建成功。
   - 把仓库 URL、部署 URL、Momen `projectExId`、部署方式和构建日志摘要写入 `evidence/stage-2-build.md` 与 `STATE.md`。
   - 如果部署失败，先读构建日志定位；同一错误连续 3 次无法解决就报告 blocker。

### 第六阶段：汇报

提供：

- 竞品比较及来源
- 发现的问题及其优先级
- 已完成的优化
- 优化前后的实际差异与测试结果
- 尚未解决的限制
- GitHub 仓库与线上部署链接

不要将未经验证的改进描述为已经证明有效。

### Stage 2 完成条件

- 构建、类型检查、核心测试通过。
- `design/UX.md` 已填写（含视觉方向），前端桌面/移动截图已验收，首屏通过“换到其他 SaaS 也不违和就重做”的检查。
- 前端先用 mock 数据走通核心任务，接后端后回归通过。
- 核心用户流程在本地和部署版本都可用。
- GitHub 仓库存在且无密钥/敏感信息。
- `evidence/stage-2-build.md` 包含竞品对比、问题优先级、修改、前后差异、限制、链接。
- 部署 URL 已实际打开验证。

---
