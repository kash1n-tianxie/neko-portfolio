# NEKO Portfolio 3.0 — 网站审查与升级策划案

**日期：** 2026-07-16  
**目标：** 面向日本求职的个人作品集网站  
**核心定位：** 黑白水墨 × 会看人的猫 × 可验证的开发作品

---

## 一、先说结论

当前网站的 Hero 已经具备辨识度：黑白水墨背景、日文姓名、英文标题、会跟随鼠标的猫眼，都足以让人记住它。

但目前最大的短板不是“还缺少一个更炫的特效”，而是：

1. 作品区还是占位卡片，无法证明开发能力；
2. About、Skills、Contact 仍有 `TODO`、`20XX`、未填写邮箱等模板痕迹；
3. 首页 CTA 会把用户带到内容尚未完成的区域；
4. 动效已经有不少，但还没有围绕“浏览、理解、验证能力”形成一套节奏。

因此本次升级原则是：

> 先让面试官在 30 秒内知道你是谁、做过什么、如何验证；再用动效增强记忆点。

---

## 二、当前网站审查

| 优先级 | 问题 | 影响 | 建议 |
|---|---|---|---|
| P0 | Works 为空，显示“作品・準備中” | 网站核心价值无法验证 | 先录入 3 个真实项目 |
| P0 | About 有 `20XX` 与 TODO | 产生“尚未完成”的第一印象 | 换成真实经历、自我 PR、语言能力 |
| P0 | 联系邮箱为空，简历按钮不可用 | 面试官无法联系或下载资料 | 配置邮箱、日英 PDF 和明确 CTA |
| P1 | 没有项目详情页 | 卡片只能展示标题，无法体现过程 | 为每个项目增加 Case Study |
| P1 | 导航没有当前章节反馈 | 长页面中用户容易失去位置感 | 添加 Active Section Indicator |
| P1 | Hero、Works、About 的动效像独立模块 | 缺少完整叙事 | 统一为“猫、墨迹、镜头”三种动效语言 |
| P2 | 缺图时直接暴露 `src/content/...` | 更像开发中的内部页面 | 用安静的占位或真实数据替换 |
| P2 | 作品只显示一个 GitHub 总入口 | 不能快速判断每个项目的代码质量 | 每个项目提供 Demo、Repo、技术栈和角色 |

### 2.1 Hero：保留辨识度，减少噪音

Hero 是目前最成功的部分，建议保留：

- 会跟随鼠标的猫眼；
- 黑白灰与少量红色印章色；
- 日文姓名 + `KASHIN OU` 的双层排版；
- 水墨背景和明确的作品 CTA。

需要改善：

- Hero 首屏要更直接地回答“你是谁、做什么、做过什么”；
- 背景墨迹应降低对文字的干扰，特别是中小屏幕；
- 不再加入粒子脸、全屏 3D、强烈 RGB glitch 等与猫和水墨无关的效果；
- CTA 必须落到真实的作品内容，不能继续指向空列表。

Hero 的职责是建立记忆点，不是展示所有技术。

### 2.2 Works：当前最需要修复的区域

现在 Works 区的大片留白和占位卡片会直接削弱可信度。这里应优先放入 3 个真实项目，数量少也可以，但必须完整：

1. **主项目：** 最能代表个人能力的作品；
2. **Web 项目：** 能展示前端、交互或产品思考；
3. **Game / Tool 项目：** 展示系统设计、工程实现或独立完成能力。

每个项目卡片至少包含：

- 项目名称、年份、类型；
- 一句话价值说明；
- 你的角色；
- 3～5 个技术标签；
- Demo、GitHub、视频或截图入口。

项目详情页建议采用以下结构：

```text
封面 / 一句话定位
→ 问题与目标
→ 我的职责
→ 技术栈
→ 关键挑战
→ 解决方案
→ 结果与可验证证据
→ Demo / GitHub
→ 下一步改进
```

“结果”不一定要是商业数据，也可以是 Lighthouse 分数、性能优化前后、用户测试观察、关卡数量、完成的系统数量等具体证据。

### 2.3 About：从模板改成个人叙事

About 应该让面试官快速理解你的背景，而不是看到 `20XX` 和 TODO。建议内容顺序：

```text
现在是谁
→ 为什么做 Web / Game
→ 具备哪些可迁移能力
→ 代表经历时间线
→ 自我 PR
→ 日语 / 英语 / 中文能力
```

猫可以继续放在标题旁边，作为“陪伴角色”，但不应遮挡履历信息。

### 2.4 Skills：从技能清单变成证据索引

不要只写“React、TypeScript、GSAP”。每个技能旁边应能看到对应项目或证据：

| 技能 | 证据形式 |
|---|---|
| React / Next.js | 作品链接、路由与组件结构 |
| TypeScript | 类型设计、数据模型、状态管理 |
| GSAP / Lenis | Hero Scroll Timeline、ScrollTrigger |
| Canvas / SVG | 墨迹遮罩、猫眼跟随、轻量实验 |
| Git / GitHub | 提交记录、README、Issue 或 Demo |

可以添加一个小型 **Tech Lab**，放 2～3 个可玩的短实验，但不要让实验取代真实项目。

### 2.5 Contact：让联系动作没有阻力

Contact 最少应提供：

- 明确的 `mailto:` 邮箱按钮；
- 日文履历书 PDF；
- 英文 Resume PDF；
- GitHub；
- LinkedIn、Wantedly 或 X（有就放，没有不要硬凑）。

表单可先不做。若以后需要表单，优先使用 Formspree、Resend 或同类轻量服务，不要为了一个联系入口提前搭建完整后端。

---

## 三、参考网站给 NEKO 的启示

### 3.1 Awwwards：用评分维度检查完整度

Awwwards 的作品评审通常同时看设计、可用性、创意和内容；例如其作品页面会把评分拆成 Design 40%、Usability 30%、Creativity 20%、Content 10%。[评分维度示例](https://www.awwwards.com/sites/hollow)

NEKO 目前的视觉辨识度已经接近“有创意的作品集”，但 Content 和 Usability 仍然不足。后续应优先关注：

- 作品内容是否真实、完整、可验证；
- 导航是否让用户知道自己在什么位置；
- 动效是否帮助理解，而不是阻碍阅读；
- 每个视觉效果是否服务于同一个故事。

Awwwards 的目录可以作为灵感入口，但不应直接复制热门 WebGL 模板。[Awwwards 作品目录](https://www.awwwards.com/websites/art/)

### 3.2 Godly：学习“一个视口一个重点”

Godly 是以精选和质量为导向的设计灵感库。[Godly 介绍](https://godly.website/info)

适合 NEKO 的经验是：

- 每个视口只安排一个视觉焦点；
- 标题、猫、墨迹不要同时抢最高对比度；
- 作品区先让用户读懂，再让用户看到动效；
- 不要为了像灵感网站而加入渐变、玻璃、3D 和粒子大杂烩。

### 3.3 21st：借鉴组件组织，不整站搬运

21st 提供了 Heroes、Buttons、Galleries、Cursors、Timelines、Shaders 等可复用分类。[21st 组件目录](https://docs.21st.dev/)

NEKO 适合使用的结构组件：

- Hero CTA 与磁吸按钮；
- Project Filter；
- Timeline；
- Active Section Nav；
- Tag / Tech Stack Chips；
- Contact Action Group。

不要一次引入整套主题，避免网站失去自己的水墨识别度。

### 3.4 React Bits：只选少量文字和光标组件

React Bits 是开源的 React 动效组件集合，采用可复制、可定制的组件方式。[React Bits GitHub](https://github.com/DavidHDev/react-bits)

适合 NEKO 的组件：

- Staggered Text：用于章节标题首次进入；
- Blur Text：用于 Hero 副标题或状态标签；
- Text Scatter：只在 Projects 标题或 Contact 结束使用一次；
- Custom Cursor / Spotlight：保留现有轻量墨迹光标，避免重复叠加。

不建议加入：粒子脸、全屏粒子黑洞、强烈 Falling Rays、持续闪烁的 Glitch。React Bits 的组件目录可以用来筛选灵感，但最终应保持黑白水墨的节制。[React Bits 组件目录](https://pro.reactbits.dev/docs/components)

### 3.5 Spline：作为可选的小型空间印章

Spline 适合制作可交互的实时 2D/3D 场景、事件和时间线。[Spline 官方](https://spline.design/)

NEKO 不适合把 Spline 放进 Hero 主画面，因为会让加载、移动端性能和视觉重心变复杂。若要使用，建议只做一个：

- About 区的 3D“進”印章；或
- Skills 区的可旋转墨石；或
- Contact 区的轻量猫铃铛。

必须提供静态 poster、懒加载和 `prefers-reduced-motion` 退化方案。

### 3.6 Unicorn Studio：只作为后期墨迹实验

Unicorn Studio 是面向 WebGL 动效的无代码工具，支持出现、滚动、悬停和鼠标移动事件，并强调轻量与优化。[Unicorn Studio 官方](https://www.unicorn.studio/)

它适合做一层非常轻的 ink shader 背景，但不要同时叠加 Spline、Canvas 粒子和多个 WebGL 场景。NEKO 的后期原则是：**全站最多一个重型 WebGL 层**。

---

## 四、推荐信息架构

```text
Hero
 ├─ 身份、定位、主 CTA
 └─ 猫眼交互

Works
 ├─ 项目筛选：ALL / WEB / GAME / TOOL
 ├─ 项目卡片
 └─ Case Study 详情页

About
 ├─ 经历时间线
 ├─ 自我 PR
 └─ 语言与求职方向

Skills
 ├─ 技术栈
 ├─ 对应项目证据
 └─ Tech Lab

Contact
 ├─ 邮箱
 ├─ 简历
 ├─ GitHub
 └─ 其他职业链接
```

导航建议固定为 `WORKS / ABOUT / SKILLS / CONTACT`，并在滚动时显示当前章节。Skills 当前应补充稳定的 section id，否则无法做准确的 Active Section Indicator。

---

## 五、建议加入的组件

### P0：内容和可信度

- `ProjectCard`：统一展示年份、类型、标签、状态、Demo、GitHub；
- `CaseStudyPage`：项目详情模板；
- `ProjectFilter`：ALL / WEB / GAME / TOOL；
- `ActiveSectionNav`：显示当前阅读位置；
- `TechStackChips`：技术标签可点击回到项目证据；
- `ResumeDownload`：真实 PDF 检查、下载状态和文件大小；
- `ContactActionGroup`：邮箱、GitHub、履历的统一行动区。

### P1：提升浏览体验

- `CaseStudyProgress`：详情页阅读进度；
- `ImageLightbox`：查看项目截图；
- `ProjectNextPreview`：详情页结尾跳转下一个项目；
- `404 Lost Cat`：沿用现有迷路猫，作为完整细节收尾；
- `SkipToContent`、键盘焦点样式和移动端菜单。

### P2：实验性组件

- `InkSeal3D`：只在一个章节使用的 Spline 印章；
- `InkShaderLayer`：只保留一层背景 WebGL；
- `TechLab`：小型 Canvas / SVG / GSAP 交互实验。

---

## 六、动效系统建议

不要继续增加互相竞争的动画，统一成三种语言：

### A. Watching Cat

- Hero 中猫眼跟随鼠标；
- 桌面端保留轻微视线延迟；
- 移动端改为视线缓慢呼吸，不追踪触摸；
- 这是网站最独特的交互，应成为主角。

### B. Ink Draw

- 用 SVG mask / `clip-path` 让项目封面和标题像被画出来；
- 现有 `PaintReveal` 可以保留，但必须绑定真实项目；
- 每个章节只使用一次主要 reveal，避免连续重复。

### C. Paper Camera

- ScrollTrigger 控制很轻的背景位移、标题缩放和猫的章节状态；
- 让页面像一张连续水墨长卷，但不要锁死滚动；
- 上滚时动画应可逆，用户要能感觉自己在控制进度。

建议时长：

| 类型 | 建议时长 |
|---|---:|
| 按钮与 hover | 150–300ms |
| 标题进入 | 400–700ms |
| 章节转场 | 700–1200ms |
| 背景呼吸 | 10–15s 循环 |

每个视口最多安排 1～2 个主动运动元素。关闭动效后，信息仍必须完整可读。

---

## 七、推荐前端技术方案

### 保留现有技术

- Next.js App Router；
- React + TypeScript；
- Tailwind CSS；
- next-intl；
- GSAP + ScrollTrigger；
- Lenis；
- SVG / Canvas 轻量交互。

### 建议新增

- `next/image`：真实项目图使用 AVIF / WebP 和响应式尺寸；
- Playwright：检查主要页面、导航、CTA、移动端；
- Lighthouse CI：发布前检查性能、可访问性和 SEO；
- JSON-LD：补充个人、项目和作品集结构化信息；
- Vercel Analytics 或 Plausible：只在需要了解访问行为时加入。

### 现在不建议新增

- 为一个 Hero 引入完整 R3F / Drei；
- 同时加入 Spline、Unicorn、Canvas 粒子和 Three.js；
- 建立 CMS 或自建后端；
- 每个页面使用不同的光标、粒子和转场；
- 调用 GitHub API 在每次访问时实时拉取项目数据。

项目数据建议先以 `src/content/works.ts` 的静态类型数据维护，稳定后再考虑 CMS。

---

## 八、GitHub 展示方案

每个项目仓库的 README 建议包含：

```text
项目一句话
→ 在线 Demo
→ 截图 / GIF
→ 技术栈
→ 我的职责
→ 关键功能
→ 技术难点与解决方案
→ 本地运行方式
→ License / 素材来源
```

网站项目卡片展示：

- GitHub Repo；
- Live Demo；
- 主语言；
- 最近更新时间；
- 是否正在维护。

不要把 GitHub 链接作为唯一证明。面试官应该能先理解项目价值，再决定是否进入代码。

---

## 九、性能与可访问性目标

发布前目标：

| 指标 | 目标 |
|---|---:|
| Lighthouse Performance | 90+ |
| Accessibility | 95+ |
| SEO | 95+ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

必须检查：

- 375 / 768 / 1280 / 1440 四种宽度；
- 所有真实图片有合适的 alt；
- 键盘可访问导航、按钮和项目卡片；
- 焦点样式清晰；
- `prefers-reduced-motion` 下关闭复杂滚动和 3D；
- 移动端禁用自定义光标与 3D tilt；
- 触控目标至少 44px；
- 粒子、WebGL、Spline 都必须懒加载并有静态退化。

---

## 十、执行顺序

### Phase 0：内容解锁（1～2 天）

- 填入 3 个真实项目；
- 删除 TODO、20XX、空邮箱；
- 准备日文履历和英文 Resume；
- 为作品补 Demo、Repo、截图和说明。

### Phase 1：可信度升级（2～4 天）

- 完成 ProjectCard 和 Case Study 页面；
- 重写 About 与 Skills；
- 配置 ContactActionGroup；
- 为作品加入可验证指标。

### Phase 2：浏览系统（2～3 天）

- Active Section Nav；
- Project Filter；
- Project Next Preview；
- 移动端菜单、键盘焦点和 404 页面。

### Phase 3：统一动效（2～4 天）

- 保留猫眼跟随；
- 统一 SVG Ink Draw；
- 调整 Hero Scroll Timeline；
- 加入轻微 Paper Camera；
- 删除不够明显或会分散注意力的 Hero Canvas。

### Phase 4：一个实验性亮点（3～5 天）

从以下三者只选一个：

1. About 的 Spline 墨印；
2. Skills 的 Unicorn ink shader；
3. Projects 的 Canvas 墨点标题。

### Phase 5：发布检查（1 天）

- Playwright 烟雾测试；
- Lighthouse；
- 移动端真机浏览；
- 检查 PDF、邮箱、GitHub 和 Demo；
- 检查素材版权、字体和第三方署名。

---

## 十一、最终体验目标

用户打开网站：

```text
第一眼：记住会看人的水墨猫
30 秒：知道你是谁、擅长什么、做过哪些项目
3 分钟：打开一个 Case Study，看到真实过程和结果
离开前：能找到 GitHub、履历和联系方式
```

最终定位不是“特效最多的作品集”，而是：

> **一卷有生命感的水墨作品集：猫负责记忆点，作品负责证明能力，动效负责引导理解。**

### 一句话决策

**现在最值得做的不是再加一个粒子或 3D 组件，而是先把 3 个真实项目、About、简历和联系方式补齐；内容完整后，只增加猫眼、墨迹显影和一个轻量实验，就足够达到高级作品集的质感。**

