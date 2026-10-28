import type { Work } from './works'

export const portfolioSite = {
  slug: 'kashin-ink',
  repoUrl: 'https://github.com/kash1n-tianxie/neko-portfolio',
  liveUrl: 'https://kashin.ink/',
  worldPath: '/world',
} as const

export const portfolioSiteSectionLabels = {
  ja: ['作品一覧を、体験の入口に', 'ゲームのメニューのように、目を引いて導く', '黒ネコとスクロール、その先に小さな街', '足すだけでなく、伝わるまで引き算する'],
  en: ['From a project list to an experience', 'A game-menu language that draws the eye and guides', 'A black cat, a scroll, and a small town beyond', 'Iterating by subtraction, not only addition'],
} as const

export const portfolioSiteWork: Work = {
  slug: portfolioSite.slug,
  tag: 'WEB',
  title: 'KASHIN.INK',
  year: '2026',
  summary: {
    ja: '作品を並べるだけでなく、つくり手の「遊び」を入口から感じられるポートフォリオ。二つの配色、視線を返す黒ネコ、スクロール演出と、寄り道できるピクセルの街をつなぎました。',
    en: 'A portfolio that brings a sense of play to the entrance, not just the project list. Two palettes, a black cat that returns your gaze, scroll-driven scenes, and an optional pixel town connect the work into one experience.',
  },
  role: {
    ja: '企画・UI/UX・インタラクション設計・AI支援による実装／アート制作',
    en: 'Concept, UI/UX, interaction design, and AI-assisted implementation / art production',
  },
  tech: ['Next.js', 'React', 'TypeScript', 'next-intl', 'GSAP', 'Canvas 2D'],
  status: 'LIVE',
  thumbnail: '/assets/works/kashin-ink/cover.webp',
  coverGif: '/assets/works/kashin-ink/cover.gif',
  coverCaption: {
    ja: '実際のサイト画面 / UI・配色・PIXEL WORLD',
    en: 'ACTUAL SITE VIEWS / UI · PALETTES · PIXEL WORLD',
  },
  gallery: [
    {
      src: '/assets/works/kashin-ink/blue-yellow.webp',
      alt: { ja: '青と黄色の配色で表示した、黒ネコとゲームメニュー風のトップ画面', en: 'Blue and yellow homepage with a black-cat guide and game-menu typography' },
    },
    {
      src: '/assets/works/kashin-ink/red-black.webp',
      alt: { ja: '赤と黒の配色に切り替えた、同じ構成のトップ画面', en: 'The same homepage composition switched to the red and black palette' },
    },
    {
      src: '/assets/works/kashin-ink/pixel-world.webp',
      alt: { ja: '茶トラ猫で歩き、NPCや池に触れられる2Dピクセルの街', en: 'A 2D pixel town where an orange tabby cat can walk, meet NPCs, and interact with the pond' },
    },
  ],
  caseStudy: {
    problem: {
      ja: 'このサイト自体も、作品の一つです。目指したのは、経歴とサムネイルを読むだけの場所ではなく、最初の操作から「遊びをつくる人」の考え方に触れられる入口でした。\n\n一方で、演出を楽しむことを作品閲覧の条件にはしたくありません。トップから作品一覧と連絡先へ進む道を残し、各作品の紹介・公開先へ直接たどり着ける構成にしました。日本語を軸に英語でも読めるようにし、眺める、読む、遊ぶという異なる訪れ方を一つのサイトに置いています。',
      en: 'This site is also one of the projects. The intention was to make an entrance that communicates a playful approach to making things from the first interaction, rather than a place to read a résumé and scan thumbnails.\n\nEnjoying the effects should not be a requirement for finding the work. The homepage keeps clear routes to projects and contact information, with direct access to each case study and public release. Japanese-first content is mirrored in English, bringing browsing, reading, and playing together without requiring the same journey from everyone.',
    },
    challenge: {
      ja: '大きな文字と強いコントラストで、ゲームのタイトル画面のように「次に何を選ぶか」を見せたいと考えました。斜めの構図やスプレーの質感は遊びの勢いを担い、見出し・番号・リンクは読めるHTMLとして分けています。装飾が情報の階層を覆わないことを意識した設計です。\n\n青／黄と赤／黒の二つの配色は、同じ構成を違う気分で楽しむための選択肢です。見た目を切り替えても作品の順序や操作の意味は変えず、画面幅に合わせてポスターのようなカードとメニューを組み直しています。',
      en: 'Large type and strong contrast aim to make the next choice feel as immediate as a game title screen. Diagonal compositions and spray textures carry the energy, while headings, numbers, and links remain readable HTML. The design intent is for decoration to support the information hierarchy rather than cover it.\n\nBlue / yellow and red / black offer two moods for the same structure. Switching the palette does not change project order or the meaning of the controls. Poster-like cards and menus reflow with the screen width so that the visual language can continue beyond a desktop composition.',
    },
    solution: {
      ja: '入口の黒ネコはポインターに視線を返し、スクロールに合わせて場面がつながります。下へ進むだけの一方向の映像ではなく、戻れば演出も戻る、読み手の操作に結び付いた変化を目指しました。動きを抑えたい場合は、サイト内のMotion OFFと端末の動きの軽減設定を尊重し、作品カバーも静止画で見られます。\n\nもう少し寄り道したい人には、任意で入れる2Dピクセルの街を用意しました。茶トラ猫で歩き、NPCと話し、池に触れる小さな遊びを、通常の作品閲覧とは別の入口につないでいます。街を歩き切らなくても、ポートフォリオの情報にアクセスできます。',
      en: 'The black cat at the entrance follows the pointer with its gaze, and scenes connect as the visitor scrolls. The aim is a reversible response tied to the reader’s input, not a film that only moves forward: scroll back and the scene moves back too. The in-site Motion OFF control and system reduced-motion setting are respected, including static alternatives to animated project covers.\n\nFor visitors who want a detour, an optional 2D pixel town lets an orange tabby cat walk, talk to NPCs, and interact with a pond. This small playable space has its own entrance alongside normal browsing. Walking through the town is never required to access the portfolio information.',
    },
    result: {
      ja: '制作では、表現を増やすことと、入口をわかりやすくすることを行き来しました。3Dのアプローチから、作品への導線と相性のよい2Dピクセルの街へ移り、入口のアートも要素を整理。残したい個性は、黒ネコ、文字、配色、触れたときの反応に絞って磨いています。\n\n実装とアート制作にはAIを活用しています。手作業だけで制作したと装うのではなく、目指す体験を決め、出力を選び、画面と操作を確かめながら調整する制作過程も含めて紹介するサイトです。完成した見た目だけでなく、意図と取捨選択を作品の説明として残しました。',
      en: 'Development moved between adding expression and clarifying the entrance. The earlier 3D approach gave way to a 2D pixel town that better fits the route into the projects, while the entrance artwork was simplified. The identity is concentrated in the black cat, typography, palettes, and responses to input.\n\nImplementation and art production use AI assistance. This is not presented as entirely handmade work: defining the intended experience, selecting outputs, and adjusting the interface through visual and interaction checks are part of the process. The case study records those intentions and choices, not only the finished appearance.',
    },
    highlights: [
      { ja: '日英対応・二つの配色', en: 'Japanese / English · two palettes' },
      { ja: '視線とスクロールの反応', en: 'Gaze and scroll-driven responses' },
      { ja: '任意で遊べる2Dピクセルの街', en: 'An optional playable 2D pixel town' },
    ],
  },
  links: { demo: portfolioSite.liveUrl, repo: portfolioSite.repoUrl },
}
