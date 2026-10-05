import type { Work } from './works'

export const hyakkiLantern = {
  slug: 'hyakki-lantern',
  version: '0.6.0',
  itchUrl: 'https://kashin-ou.itch.io/hyakki-lantern-city',
  // Official itch.io embed for the published build; loaded only after a user click.
  embedUrl: 'https://itch.io/embed-upload/19580850?color=171c2d',
  cover: '/assets/works/hyakki-lantern/cover.webp',
  video: '/assets/works/hyakki-lantern/gameplay.mp4',
  videoPoster: '/assets/works/hyakki-lantern/video-poster.jpg',
} as const

export const hyakkiLanternWork: Work = {
  slug: hyakkiLantern.slug,
  tag: 'GAME',
  title: '百鬼灯市',
  year: '2026',
  status: 'LIVE',
  releaseLabel: { ja: '無料体験版 v0.6.0 公開中', en: 'Free demo v0.6.0 — available now' },
  summary: {
    ja: 'その一手が、灯市を守る。いつもの4×4の2048で式神を育て、迫りくる百鬼を迎え撃つリアルタイム自動防衛ゲーム。考える手は止めずに、戦場は動き続けます。',
    en: 'Every move keeps the lanterns alight. Hyakki Lantern City pairs familiar 4×4 2048 with real-time auto defense: merge tiles into stronger spirits while a procession of yokai closes in.',
  },
  role: {
    ja: '企画・ゲームデザイン・ディレクション／AI支援による実装・ビジュアル制作',
    en: 'Concept, game design, and direction; AI-assisted implementation and visual production',
  },
  tech: ['Godot 4.7', 'GDScript', 'HTML5', 'Windows', 'macOS'],
  thumbnail: '/assets/works/hyakki-lantern/gameplay-growth.webp',
  gallery: [
    {
      src: '/assets/works/hyakki-lantern/gameplay-early.webp',
      alt: { ja: '実際の序盤プレイ。4×4の式盤の周囲を妖怪が進み、式神が自動で攻撃する', en: 'Actual early gameplay: yokai approach around the 4×4 spirit board while units attack automatically' },
    },
    {
      src: '/assets/works/hyakki-lantern/gameplay-growth.webp',
      alt: { ja: '実際の成長途中の盤面。合成した高位の式神と、迫ってくる敵の行列', en: 'Actual mid-run gameplay with merged higher-tier spirits and approaching enemy groups' },
    },
    {
      src: '/assets/works/hyakki-lantern/gameplay-final-boss.webp',
      alt: { ja: '実際の最終決戦。大天狗を迎え撃つ式神たちとボスの体力ゲージ', en: 'Actual final encounter against the Great Tengu, with the spirit army and boss health bar' },
    },
  ],
  caseStudy: {
    problem: {
      ja: '2048の「次の一手を考える楽しさ」に、軍隊が育つ手応えと、敵が近づく緊張感を重ねたい。ターン待ちや移動回数の消費で手を止めることなく、合成した数字がそのまま戦力になるゲームを目指しました。',
      en: 'The starting point was the satisfaction of planning a 2048 move, paired with the visible growth of an army and the pressure of approaching enemies. The game needed to reward merging without turn waits or a consumable move allowance.',
    },
    challenge: {
      ja: '速く滑らせるだけで敵を置き去りにできず、じっくり考えても開幕から理不尽に負けない進行を探りました。同時に、戦闘演出は入力を止めず、盤面中央の式神も戦闘に参加できること、敵の行列と数字の両方が読めることを重視しました。',
      en: 'The central challenge was pacing: fast swipes should not leave the enemy progression behind, while slower decisions should not cause an immediate defeat. Combat effects must never block input, and every tile must contribute regardless of its board position.',
    },
    solution: {
      ja: '有効な一手で2か4が生まれる基本ルールを保ち、侵攻は有効手数と緩やかな実時間進行の両方から決定。敵の移動と攻撃はリアルタイムで処理します。12段階の式神には近接・遠距離・範囲攻撃の違いを設けつつ、合成による戦力増加を優先しました。盤面が詰まっても戦闘は続き、整理の爆竹・売却・転位で立て直せます。',
      en: 'The classic rules remain: each valid move spawns a 2 or 4. Invasion stages advance through valid moves and a slower real-time progression, while enemies move and attack continuously. Twelve spirit tiers vary in melee, ranged, and area attacks, with merging always improving strength. A blocked board keeps fighting and can be rescued with a bomb, a sale, or a reposition.',
    },
    result: {
      ja: '無料体験版 v0.6.0をitch.ioで公開。Web・Windows・macOSに対応し、日本語のゲーム内UI、ボス戦、補助道具、音量調整を実装しました。固定シードのモデルシミュレーションと自動テストで進行・合成・戦闘を確認しています。プレイヤーの大規模実測データではなく、公開後の手応えを見ながら調整を続ける段階です。',
      en: 'Free demo v0.6.0 is published on itch.io for Web, Windows, and macOS, with Japanese in-game UI, boss encounters, support items, and audio settings. Fixed-seed model simulations and automated tests check progression, merging, and combat. These are simulated checks, not large-scale player telemetry; balancing will continue with play feedback.',
    },
    highlights: [
      { ja: '4×4の2048 × リアルタイム防衛', en: 'Classic 4×4 2048 × real-time defense' },
      { ja: '12段階の式神と最終ボス', en: '12 spirit tiers and a final boss' },
      { ja: 'Web・Windows・macOSで無料体験', en: 'Free demo on Web, Windows, and macOS' },
    ],
  },
  links: { itch: hyakkiLantern.itchUrl },
}
