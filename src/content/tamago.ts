import type { Work } from './works'

export const tamagoGame = {
  slug: 'tamago-exe',
  version: '4.0',
  itchUrl: 'https://kashin-ou.itch.io/exe',
  // The verified v4 export is served directly; itch.io still contains the earlier game.
  embedUrl: '/games/tamago-v4/index.html',
  cover: '/assets/works/tamago-exe/depth.webp',
  designPdf: '/assets/works/tamago-exe/tamago-game-design-ja.pdf',
} as const

export const tamagoWork: Work = {
  slug: tamagoGame.slug,
  tag: 'GAME',
  title: 'TAMAGO.exe',
  year: '2026',
  status: 'LIVE',
  releaseLabel: { ja: '新版 v4 · ブラウザでプレイ', en: 'New v4 · Play in your browser' },
  summary: {
    ja: '何を残し、どこに置く？ 5つの食材でごちそうを組み立て、9つの関門を越えるスロット構築ゲーム。たまごが竜になるにつれ、世界も8-bitから2D、立体へと進化します。',
    en: 'What will you keep, and where will you put it? Build meals from five slot results and clear nine gates in a cooking roguelike. As your egg becomes a dragon, the whole world evolves from 8-bit to 2D and dimensional art.',
  },
  role: {
    ja: '企画・ゲームデザイン・ディレクション／AI支援による実装・ビジュアル制作',
    en: 'Concept, game design, and direction; AI-assisted implementation and visual production',
  },
  tech: ['Godot 4.7', 'GDScript', 'HTML5', 'Deterministic Simulation'],
  thumbnail: tamagoGame.cover,
  gallery: [
    { src: '/assets/works/tamago-exe/pixel.webp', alt: { ja: '8-bitの最初の皿。食べるボタンと、栄養×倍率の確定予測', en: 'The first 8-bit plate, with an Eat button and a nutrition-times-multiplier preview' } },
    { src: '/assets/works/tamago-exe/flat.webp', alt: { ja: '第3関の進化後、カラー2Dになった竜とスロット筐体', en: 'The dragon and cabinet in color 2D after the first evolution' } },
    { src: tamagoGame.cover, alt: { ja: '立体表現の第7関。4つのカプセルと食材の連鎖を組み合わせる盤面', en: 'The dimensional seventh gate, combining four capsules with food triggers' } },
    { src: '/assets/works/tamago-exe/shop.webp', alt: { ja: 'ランダム商店。食材袋の入れ替えと4枠のカプセル構築を選ぶ', en: 'The random shop, where food replacements and four capsule slots compete for coins' } },
    { src: '/assets/works/tamago-exe/chain.webp', alt: { ja: '食材・再発動・倍率が得点につながる過程を確認する連鎖詳細', en: 'An optional trigger breakdown showing how food, replays, and multipliers produce the score' } },
  ],
  caseStudy: {
    problem: {
      ja: '試遊で受けた「文字が多い」「何をすればよいか分かりづらい」という指摘が出発点です。説明を減らすだけでなく、繰り返しボタンを押せば終わる育成から、自分で料理を工夫するゲームへ作り直しました。',
      en: 'Playtest feedback that the game was text-heavy and hard to understand became the starting point. The redesign goes beyond removing copy: it replaces repetitive feeding with meals that players actively shape.',
    },
    challenge: {
      ja: '操作を増やしすぎず、ランダムな5つの食材に「残す理由」と「並べ替える理由」を作ること。さらに、見た目が3回変わっても操作位置を保ち、初めて遊ぶ人が次の一手を見失わない構成を目指しました。',
      en: 'The challenge was giving players a reason to keep or reposition each of five random ingredients without piling on controls. Three visual eras also needed a consistent layout so that evolution would not hide the next action.',
    },
    solution: {
      ja: '各関4皿、共有の引き直し2回、1皿1回の配置交換に判断を絞りました。6種の食材には栄養の成長、隣接再発動、倍率、収入など異なる役割を設定。10個の食材袋と4枠のカプセルをランダム商店で組み替え、確定前に「栄養×倍率」を確認できます。第3・6関の進化では、その後の構築を変える能力を選びます。',
      en: 'Decisions center on four plates per gate, two shared rerolls, and one positional swap per plate. Six foods grow nutrition, replay neighbors, add multipliers, or earn coins. A random shop reshapes a ten-item bag and four capsule slots, with a nutrition-times-multiplier preview before every meal. Evolutions after gates three and six add a new build choice.',
    },
    result: {
      ja: '9関・3幕、6種の食材、12種のカプセル、2回の進化選択を備えた日本語版を実装しました。4皿で届かなければそのランは終了し、図鑑だけを持ち越して別の構築を試せます。自動テストとシミュレーションで得点・乱数復元・商店・進行を検証しています。「5秒で理解できるか」と面白さは、初見プレイヤーの実測で引き続き確認する項目です。',
      en: 'The Japanese-language game now spans nine gates and three acts, with six foods, twelve capsules, and two evolution choices. Failing a gate ends the run; only discoveries carry over, inviting a different build. Automated checks and simulations cover scoring, random-state restoration, shops, and progression. Five-second comprehension and enjoyment remain questions for first-time players, not claims established by simulation.',
    },
    highlights: [
      { ja: '4皿・2回の引き直し・1回の配置交換', en: 'Four plates · two rerolls · one swap per plate' },
      { ja: '6種の食材 × 12種のカプセル', en: 'Six foods × twelve capsules' },
      { ja: '8-bit → 2D → 立体へ進化する9関', en: 'Nine gates from 8-bit to 2D to dimensional art' },
    ],
  },
  links: { itch: tamagoGame.itchUrl },
}
