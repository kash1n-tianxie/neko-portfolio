import type { Work } from './works'

export const memeClashGame = {
  slug: 'meme-clash',
  version: '0.39.0',
  itchUrl: 'https://kashin-ou.itch.io/meme-clash',
  embedUrl: 'https://itch.io/embed-upload/20068590?color=333333',
  cover: '/assets/works/meme-clash/title.webp',
  coverGif: '/assets/works/meme-clash/cover.gif',
  poster: '/assets/works/meme-clash/title.webp',
}

export const memeClashWork: Work = {
  slug: memeClashGame.slug,
  tag: 'GAME',
  title: 'ミーム大乱闘 — MEME CLASH',
  year: '2026',
  status: 'IN_PROGRESS',
  releaseLabel: { ja: '制作中・無料体験版 v0.39.0', en: 'In development · Free demo v0.39.0' },
  summary: {
    ja: '「？」「！」が飛び交い、書類とバスケットボールがぶつかる。7人のキャラクターで連携と必殺技をつなぐ、2Dミーム対戦アクション。CPU対戦、同じキーボードでの2人対戦、トレーニングを遊べます。',
    en: 'Question marks, exclamation points, paperwork, and basketballs collide. A 2D meme fighting game with seven characters, attack chains, and supers. Play against the CPU, share a keyboard for local two-player battles, or practice in training.',
  },
  role: {
    ja: '企画・キャラクター方針・試遊・改善方針／開発支援：Codex',
    en: 'Concept, character direction, playtesting, and iteration decisions; development assistance by Codex',
  },
  tech: ['Godot 4.7', 'GDScript', 'HTML5'],
  thumbnail: memeClashGame.cover,
  coverGif: memeClashGame.coverGif,
  coverCaption: { ja: '実機プレイ映像 / v0.35', en: 'GAMEPLAY RECORDING / v0.35' },
  gallery: [
    { src: '/assets/works/meme-clash/select.webp', alt: { ja: '7人から対戦キャラクターを選ぶ画面', en: 'The character selection screen with seven fighters' } },
    { src: '/assets/works/meme-clash/wojak-combo.webp', alt: { ja: 'ウォジャックが記号で繰り出す連続攻撃', en: 'Wojak attacking with a chain of punctuation effects' } },
    { src: '/assets/works/meme-clash/worker-super.webp', alt: { ja: '定時くんの大必殺技の実機画面', en: 'An in-game capture of Teiji-kun’s super attack' } },
    { src: '/assets/works/meme-clash/wojak-super.webp', alt: { ja: '巨大な記号が広がるウォジャックの大必殺技', en: 'Wojak’s super attack filling the fight with oversized punctuation' } },
  ],
  caseStudy: {
    problem: {
      ja: 'ミームの特徴を見た目だけで終わらせず、攻撃の動きや間合いにも持たせたい。書類を扱う定時くん、記号で反応するウォジャックなど、キャラクターごとの遊び方が伝わる対戦ゲームを目指しています。',
      en: 'The aim is to make each meme shape the way a fighter moves and controls space. Teiji-kun uses paperwork, while Wojak reacts through punctuation. Their identities should be visible in how they play as well as how they look.',
    },
    challenge: {
      ja: '派手な演出と、次の入力が分かる戦闘を両立すること。技をつなげられる時間、命中時の短い停止、防御と反撃、大技の後隙を個別に確認し、画面の情報が多い場面でも操作を追えるよう調整しています。',
      en: 'Spectacle needs to leave room for readable decisions. Input windows, brief pauses on impact, defence, counterattacks, and recovery after supers are checked separately so the next action stays understandable even in busy scenes.',
    },
    solution: {
      ja: '公開ソースのBleachVsNarutoを参考・移植元とし、Godotで選人・入力・戦闘・演出を統合。7人それぞれに通常攻撃、方向派生、空中技、必殺技を用意し、CPU対戦と操作練習を繰り返し確認できる構成にしています。',
      en: 'The project adapts parts of the public BleachVsNaruto source into Godot and integrates character selection, input, combat, and effects. Seven fighters have normal attacks, directional variations, air moves, and supers, with CPU battles and training for repeated practice.',
    },
    result: {
      ja: 'v0.39.0を制作中の体験版として公開。連携と大技の演出を残しながら、初回表示と描画計算の負荷を削減しました。表示速度はブラウザと端末によって変わります。今後も実際の試遊をもとに、動作のつながりと戦闘の読みやすさを調整します。',
      en: 'Version 0.39.0 is available as an in-development demo. Initial display work and repeated rendering calculations have been reduced while preserving attack chains and super effects. Performance varies by browser and device. Further playtesting will guide animation transitions and combat readability.',
    },
    highlights: [
      { ja: '7キャラクター・CPU／ローカル2人対戦', en: 'Seven fighters · CPU and local two-player battles' },
      { ja: '記号、書類、ボール。個性を技の演出へ', en: 'Punctuation, paperwork, and basketballs become attacks' },
      { ja: 'トレーニングで通常連携と方向派生を練習', en: 'Practice attack chains and directional moves in training' },
    ],
  },
  links: { itch: memeClashGame.itchUrl },
}
