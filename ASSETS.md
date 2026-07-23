# NEKO Portfolio 2.0 — 素材生成说明书

> 这份文档是写给图像生成 AI（ChatGPT 等）看的。
> 生成任何一张图之前，请先完整阅读「项目背景」和「全局规则」，再看具体某张图的要求。
> **每次生成时，请随文档附上参考图 `cat.png`（主角猫的官方设定图）。**

---

## 一、项目背景：我在做什么

我是**王家進（KASHIN OU）**，日本大学数理情報工学科的学生，正在制作一个**用于日本求职（就活）的个人作品集网站**。面试官和 HR 会通过这个网站了解我的技术能力和作品。

网站的视觉主题是「**墨と猫**」（水墨与猫）：

- 整体是**黑白水墨 × 日本漫画（manga）**风格——像用毛笔和网点纸画出来的世界；
- 网站默认是**深色主题**：近黑的背景（#0B0B0D）配米白色文字（#F0EDE4），唯一的强调色是朱红（#E24B38），朱红由网站代码控制，**素材本身不需要包含红色**；
- 有一只贯穿全站的**猫吉祥物**，它是网站的「导游」：在首屏睡觉、在章节标题旁坐着、在 404 页迷路。它让严肃的技术作品集有了记忆点——面试官可能记不住我的名字，但会记得「那个有水墨猫的网站」。

所以每张素材的使命是：**让网站看起来像一部精心绘制的漫画，而不是一个套模板的网页**。

## 二、主角设定：这只猫是谁

参考图 `cat.png` 是这只猫的官方设定（黑白漫画风格的街头猫，穿皮夹克、带铆钉项圈）。所有猫的图必须是**同一只猫**，就像漫画连载中的同一个角色：

- **体型：纤细、矫健、可爱**。绝对不能画成胖猫、圆猫；
- **它是猫，不是人**：四肢和比例保持猫的自然形态，不要拟人化、不要变成兽人或美少年；
- 线条：干净利落的漫画墨线，粗细有变化（像 G 笔/毛笔画的），可以带少量网点（screentone）阴影；
- 纯黑白灰，不上任何颜色。

## 三、全局规则（每张图都必须遵守）

1. **画面里不能出现任何文字**——不要字母、汉字、假名、数字、问号感叹号等符号、签名、水印。网站上的文字全部由代码渲染；
2. **不上色**：黑、白、灰而已。朱红强调色由网站 CSS 提供；
3. 需要透明背景的 PNG（下面会逐张标注），主体边缘要干净，方便直接叠在网页深色背景上；
4. 同一批图的**线条粗细、笔触风格保持一致**，它们会出现在同一个页面里；
5. 图会缩小显示（最小约 100px 宽），所以造型要**剪影清晰、姿态一眼可读**，不要依赖微小细节。

---

## 四、素材清单（逐张说明）

### 1. `cat-sleep.png` — 睡觉的猫

- **用在哪**：网站首屏（Hero）。左边是我的名字大标题「王家進 / KASHIN OU」，这只猫蜷在画面右下角睡觉，显示宽度约 160px；
- **为什么**：首屏是访客的第一眼。标题是锋利的大字，猫在角落安静睡着，一动一静，让页面既有气势又有温度；
- **画什么**：猫蜷成一团侧躺睡觉，尾巴环绕身体，表情放松（闭眼）。侧面或四分之三视角，整体轮廓接近一个饱满的圆；
- **规格**：透明背景 PNG，约 1024×1024，主体占画面 80% 以上。

英文提示词参考：
> Black-and-white manga ink illustration of the same slim cat from the reference image, curled up asleep in a compact ball, tail wrapped around its body, eyes closed, peaceful. Clean bold ink lines with varied line weight, light screentone shading, monochrome only. Simple readable silhouette. Transparent background, no text, no watermark.

### 2. `cat-sit.png` — 端坐的猫

- **用在哪**：「経歴 ABOUT」章节的标题旁边，显示宽度约 96px，像坐在标题上；
- **为什么**：経歴部分讲我的经历和自我 PR，猫端正地坐在旁边「陪同介绍」，姿态要乖巧、专注；
- **画什么**：猫端正坐姿（埃及猫式），尾巴收拢绕在前爪边，微微抬头，神情专注可爱。正侧面或四分之三视角；
- **规格**：透明背景 PNG，约 1024×1024。

英文提示词参考：
> Black-and-white manga ink illustration of the same slim cat from the reference image, sitting upright and attentive like a well-behaved cat, tail curled neatly around its front paws, head slightly raised. Clean bold ink lines, light screentone shading, monochrome. Clear silhouette. Transparent background, no text, no watermark.

### 3. `cat-lost.png` — 迷路的猫

- **用在哪**：404 页面（访客打开了不存在的网址时）正中央，配文「迷子になりました」（迷路了）；
- **为什么**：404 是最容易被浪费的页面。用一只迷路张望的猫代替冷冰冰的报错，把失误变成加分的记忆点；
- **画什么**：猫站着，歪着头四处张望，一脸困惑，耳朵一竖一折，可以一只前爪微微抬起。**不要画问号**（属于符号），困惑感全靠姿态和表情传达；
- **规格**：透明背景 PNG，约 1024×1024。

英文提示词参考：
> Black-and-white manga ink illustration of the same slim cat from the reference image, standing and looking around confused and lost, head tilted, one ear folded, one front paw slightly lifted. Expressive but cute. Clean bold ink lines, light screentone shading, monochrome. Transparent background, no text, no symbols, no watermark.

### 4. `ink-hero.webp`（生成 PNG 再转 WebP 也可以）— 首屏水墨背景

- **用在哪**：铺满整个首屏的背景层，上面会叠加白色大标题（标题在**画面左侧**）和睡觉的猫；
- **为什么**：现在首屏背景是代码画的渐变（临时方案），换成真正的水墨笔触后，「墨」的世界观才算立起来；
- **画什么**：一幅**抽象的深色水墨画**——近黑的底（#0B0B0D 左右），上面有几笔舒展的淡墨晕染和飞白笔触。想象宣纸的黑夜版：大面积留黑，墨迹稀疏而有呼吸感；
- **关键约束**：
  - **画面左侧 40% 必须保持基本干净**（近纯黑），因为白色标题文字叠在那里，不能被抢戏；
  - 墨迹活动集中在右侧和上部，浓淡对比柔和，不要大片亮白；
  - 不要画任何具体物体（不要猫、不要山水、不要月亮），纯抽象笔触；
- **规格**：2400×1350（16:9 横版），不透明。

英文提示词参考：
> Abstract sumi-e ink wash painting on a near-black background (#0B0B0D). A few sparse, elegant ink brush strokes and soft ink blooms concentrated on the right side and upper area, with dry-brush (kasure) texture. The left 40% of the canvas stays almost clean dark for text overlay. Subtle, atmospheric, monochrome dark grey tones only, no bright white areas, no objects, no text, no watermark. Wide 16:9 composition, 2400×1350.

### 5. `og-bg.png` — 分享卡片底图

- **用在哪**：网站被分享到 LINE / Slack / X 时显示的预览卡片背景。我的名字和头衔之后会由代码叠加在**画面中央偏左**；
- **为什么**：分享预览是网站的「名片」，很多面试官第一眼看到的其实是这张卡片；
- **画什么**：深色底（同 #0B0B0D），四周有手绘水墨笔触构成的**不规则边框**（像漫画扉页的墨框），中央大面积留空。右下角可以有一个很小的猫剪影（蜷睡姿态）作为点缀，也可以完全不画猫；
- **规格**：1200×630（横版），不透明。

英文提示词参考：
> Dark near-black (#0B0B0D) horizontal card, 1200×630. A hand-drawn irregular ink brush frame around the edges, like a manga title-page border, monochrome sumi-e style. Large empty space in the center-left for text overlay. Optionally a tiny sleeping cat silhouette in the bottom-right corner. No text, no watermark.

---

## 四·五（追加）、交互层素材 — 2026-07-15 动效策划案新增

> 交互层代码已经写好并埋了插槽，下面两张图放进指定路径即自动激活对应交互。
> 依然遵守「全局规则」：同一只猫、黑白水墨、无文字、透明背景。

### 6. `cat-awake.png` — 睁眼的猫（瞳孔留白）★ 激活「会看你的猫」

- **用在哪**：替换首屏睡猫。放入后，代码会在眼睛位置叠加两颗可移动的瞳孔，**猫的视线会跟着访客鼠标转**；
- **画什么**：同一只猫，端正坐姿、**正面朝向观众**、睁大双眼——**关键：眼睛只画大片眼白轮廓，不要画瞳孔**（瞳孔由网页代码绘制并移动）。头部略大更可爱，剪影清晰；
- **规格**：透明背景 PNG，约 1024×1024，猫居中占 80%。

英文提示词参考：
> Black-and-white manga ink illustration of the same slim cat from the reference image, sitting upright FACING THE VIEWER with large wide-open eyes. IMPORTANT: the eyes are large blank white shapes with clean dark outlines and NO pupils (pupils will be added programmatically). Cute, attentive expression, clean bold ink lines, light screentone shading, monochrome. Transparent background, no text, no watermark.

### 7. `cat-leap.png` — 跃起的墨猫完成稿 ★ 激活「墨笔画猫」滚动显影

- **用在哪**：作品区顶部。滚动时这幅画会被五道笔刷遮罩「一笔一笔画出来」，滚动条就是画笔；
- **为什么改成一张图**：原策划案要 6–8 张序列关键帧，工程上已改为「单张完成稿 + 笔刷遮罩显影」——效果相同、猫的形象 100% 一致、体积省 90%，所以**只需要这一张**；
- **画什么**：猫全力跃起/扑出的动感瞬间（横向构图，向右跃），笔触奔放、可带飞白和墨点飞溅，是全站最有力量感的一张；
- **规格**：透明背景 PNG，横版约 1600×1100，猫占画面主体。

英文提示词参考：
> Black-and-white manga ink illustration of the same slim cat from the reference image, captured mid-leap dashing to the right, full of energy — dynamic sumi-e brushwork with dry-brush texture (kasure) and small ink splatters trailing behind. Wide horizontal composition around 1600×1100. Clean readable silhouette, monochrome. Transparent background, no text, no watermark.

**放置路径**：`cat-awake.png` → `public/assets/cat/`；`cat-leap.png` → `public/assets/paint/`。
放好后跑一遍 `node scripts/process-assets.mjs`（会自动抠假透明棋盘格）再 `npm run build`。

### 8. 3D 世界主角 — 纯 Three.js 方块猫

- **用在哪**：`/world` 三维浮岛的玩家角色；
- **实现方式**：完全由 Three.js `RoundedBoxGeometry` 和少量基础几何体在代码中生成，不加载 GLB；
- **造型**：贴近地面的四足小黑猫，圆角大头、横向短身体、四只短腿、眼睛高光、三角猫耳、白袜与卷尾；
- **动作**：代码驱动 Idle / Walk / Run / Jump / Fishing / Nap；步行使用四拍小碎步，跑步使用前后腿成对伸缩；
- **代码位置**：`src/components/world/engine/cat.ts`。

## 五、可选素材（现在不急，以后要）

| 文件 | 内容 | 用途 |
|---|---|---|
| `cat-run.png` | 猫全速奔跑的侧面（水平方向） | 以后做「猫随滚动奔跑引导」的动画 |
| `ink-hero-light.webp` | 和纸底（米白 #F6F3EB）的浅色水墨背景，同样左侧留白 | 网站「昼」主题的首屏背景 |
| 作品缩略图 | 每件作品一张 1200×800（3:2） | 作品上线时再准备，通常用截图而非 AI 生成 |

## 六、文件放置方法（给我自己看）

生成的图按下表放进项目，**网页会自动把占位框换成真图，不用改任何代码**：

| 文件 | 放到 |
|---|---|
| cat-sleep.png / cat-sit.png / cat-lost.png | `neko-portfolio/public/assets/cat/` |
| ink-hero.webp | `neko-portfolio/public/assets/ink/` |
| og-bg.png | `neko-portfolio/public/assets/og/` |

透明 PNG 如果背景不干净（有白边/杂点），可以让我用命令行处理。PNG 转 WebP 我来做即可。
