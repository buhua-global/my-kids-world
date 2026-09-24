# Design — 女儿的世界

> to know is to see —— 先看见，才理解。

本文件是全站唯一设计事实源（由 Hallmark redesign 于 2026-09 锁定）。所有页面改造先读本文件；
系统需要生长时「修订本文件」，不做页面级私改。
与 `doc/女儿的世界/03-视觉设计规范.md` 冲突时，以本文件为准。

## Genre

**playful · 手工艺术书向**（温暖手作、贴纸手账、像一本被精心做出来的书，不吵、不弹跳）。

## 设计叙事

- 页面 = 一本摊开的手账：卡片是贴上去的纸片，标签是纸胶带，提示是便利贴，家长信带蜡封印。
- 区块标题 = 手写的字 + 一笔手绘波浪线；**标题不放 emoji**。emoji 只允许出现在「内容贴纸」上
  （模块卡图标、头像兜底），不作为界面 chrome。
- 每套主题有独立的「纸」：手账是奶油波点纸、梦幻是星空、复古是牛皮纸、简约是留白。
- 装饰密度随主题分档：手账/梦幻/复古 中等，简约几乎为零。

## Macrostructure family

同一系统、三种页面家族，家族内只换组件原型：

- **Journal Front Page（首页）**：居中 hero（大字问候 + 手绘小窗 SVG + 便利贴贴士）→ 档案横卡 →
  模块贴纸网格 → 波浪分隔 → 信纸家书。
- **Workbench / List（档案、词典）**：返回链接 + 档案头/搜索头 → 工具区（chips、分段、tabs）→ 卡片网格。
- **Long Document / Guide（模块详情、对话指南）**：页头 + 学段分段 → 三层贴纸分区（是什么/为什么/怎么聊）→
  词汇 chips；指南页为四节卡片文档。

## Theme（4 套 token，`data-theme` 切换）

Token 名不变（`--bg/--bg-soft/--card/--primary/--primary-soft/--accent/--accent-2/--text/--text-soft/--line/--danger/--font-title/--font-body/--radius-card`），
规范化值维护在 `css/themes/*.css`（**token 唯一事实源**）。新增跨主题 token（main.css `:root` 默认、主题可覆写）：

- `--shadow-card` / `--shadow-lift`：纸片 offset 阴影（简约主题覆写为极轻）
- `--seal`：蜡封印颜色（默认 `var(--primary)`，复古覆写为砖红）
- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`、`--dur: 220ms`

| 主题 | 纸面质感 | 装饰密度 |
|------|---------|---------|
| journal 温暖手账 | 奶油底 + 波点格 + 星花/爱心涂鸦 | 中 |
| dream 梦幻星空 | 淡紫 + 双柔光星云 + 星点砖 + 月牙 | 中 |
| minimal 简约现代 | 暖白 + 极淡方格，无贴纸/胶带 | 零 |
| vintage 复古日记 | 牛皮纸噪点纤维 + 极淡方格 | 中 |

模块品牌色（`--mcolor`，8 色）不随主题变，贴在模块卡纸胶带上（简约主题用顶部细条代替）。

## Typography

- Display：`--font-title`（LXGW WenKai / 楷体系），700，标题一律正体（禁斜体）
- Body：`--font-body`（苹方/雅黑系），400，行高 1.8
- Hero 问候语：`clamp(30px, 5vw, 44px)`；区块标题 22px + 手绘波浪下划线（accent 色 mask SVG）
- 词典词条、表单 label 用 `--font-title`（字典与手写感）
- 中文正文禁用斜体（伪斜体是 AI 痕迹），强调用颜色与字重

## Spacing

4pt 派生：4 / 8 / 12 / 16 / 18 / 22 / 30 / 44（组件内边距与区块呼吸沿用现值，写在 main.css）。

## Motion

- 原语 ≤ 3：滚动轻浮现（fade + translateY(10px)，500ms `--ease-out`，一次性，IntersectionObserver；
  网格子项 40ms 级差）、hover 微浮（卡片 -4px / 按钮 -1px + 按压回落 1px）、主题按钮小旋转
- 禁弹跳/overshoot；`prefers-reduced-motion: reduce` 下全部降级（浮现不隐藏内容：初始态写在
  `no-preference` 媒介查询内，JS 缺席时不影响可见性）

## Microinteractions stance

- 安静成功，无庆祝 toast；确认类操作沿用现有 confirm
- 气泡/贴纸是「读的话术」，不做复制交互
- hover 即时反馈，无 tooltip

## CTA voice

- 主按钮：胶囊、`--primary` 填充、粗体、底部 offset 阴影，按压下沉 1px
- 次按钮：胶囊描边、透明底，hover 描边转 primary
- 文案保持现有语气（邀请式、不评判）

## Per-page allowances

- 首页可用 Tier-B 内嵌 SVG（手绘小窗）；其余页面 typography + 组件装饰即可
- 全站禁外部资源（字体/CDN/图片库），一切装饰 = 内嵌 SVG data-URI + CSS
- 简约主题必须保持零贴纸/零胶带，靠排版与发丝线

## What pages MUST share

顶部导航与 SVG logo、主题切换器、accent ≤ 5% 视口占比的用色纪律、字体栈、按钮声音、
区块标题 + 波浪线节奏、页脚（星行分隔 + 版本行）、`overflow-x: clip` 防护。

## What pages MAY differ on

家族内的区块顺序与网格列数；档案/词典/模块的工具区形态；首页独占手绘小窗与便利贴。

## Exports

Token 唯一事实源即 `css/themes/*.css`（4 套）+ `css/main.css :root`（跨主题 token）。
需要 Tailwind v4 `@theme` / DTCG `tokens.json` 时从上述文件镜像，勿另立新值。
