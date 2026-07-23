import type { L10n } from './works'

/**
 * 人物データはこのファイル、UI の文言は messages/*.json。
 * 住所・電話番号など非公開情報は掲載しない。
 */

/** 公開用メールアドレス */
export const email = '2414790931a@gmail.com'

export type SkillCategory = {
  category: L10n
  /** 自己評価の習熟度 0–100（Skills の墨バー表示用・任意で調整可） */
  level: number
  items: { name: string; note: L10n }[]
}

export const skills: SkillCategory[] = [
  {
    category: { ja: '言語', en: 'Languages' },
    level: 85,
    items: [
      {
        name: 'TypeScript / JavaScript',
        note: {
          ja: '本サイトと rerpg 観察 UI の実装に使用',
          en: 'Used for this site and the rerpg observation UI',
        },
      },
      {
        name: 'Python',
        note: {
          ja: '卒業研究の強化学習・評価基盤に使用',
          en: 'RL training and evaluation for graduation research',
        },
      },
      {
        name: 'GDScript',
        note: {
          ja: 'Godot 製ゲーム3作品の実装に使用',
          en: 'Implementation of three Godot games',
        },
      },
    ],
  },
  {
    category: { ja: 'フロントエンド', en: 'Frontend' },
    level: 80,
    items: [
      {
        name: 'React / Next.js',
        note: {
          ja: '本サイトを Next.js 15 で構築',
          en: 'Built this site with Next.js 15',
        },
      },
      {
        name: 'Three.js / WebGL',
        note: {
          ja: 'ハンドトラッキング・パーティクルシステムの実装',
          en: 'Hand-tracking particle system',
        },
      },
      {
        name: 'MediaPipe Hands',
        note: {
          ja: '両手ジェスチャーのリアルタイム認識',
          en: 'Real-time two-hand gesture recognition',
        },
      },
    ],
  },
  {
    category: { ja: 'ゲーム開発', en: 'Game Dev' },
    level: 78,
    items: [
      {
        name: 'Godot 4',
        note: {
          ja: 'たまご.exe／三国志 文字防衛／Orbit Defense',
          en: 'tamago.exe, Sangokushi Moji Bouei, Orbit Defense',
        },
      },
      {
        name: 'HTML5 / PWA',
        note: {
          ja: 'ブラウザ向けリリースと自動テスト',
          en: 'Browser releases and automated testing',
        },
      },
    ],
  },
  {
    category: { ja: 'AI・研究', en: 'AI & Research' },
    level: 72,
    items: [
      {
        name: 'Gymnasium / PPO',
        note: {
          ja: '戦闘環境の構築と方策学習',
          en: 'Battle environment and policy training',
        },
      },
      {
        name: 'Stable-Baselines3',
        note: {
          ja: '報酬設計の比較実験',
          en: 'Reward-design comparison experiments',
        },
      },
      {
        name: 'LLM Evaluation',
        note: {
          ja: 'LLM 自動プレイと行動分析',
          en: 'LLM autoplay and behavior analysis',
        },
      },
    ],
  },
]

export type TimelineItem = {
  year: string
  title: L10n
  body: L10n
}

export const timeline: TimelineItem[] = [
  {
    year: '2022',
    title: {
      ja: '日本大学 数理情報工学科 入学',
      en: 'Entered Nihon University, Mathematical Information Engineering',
    },
    body: {
      ja: '授業と並行して、Web とゲームの個人開発を開始。',
      en: 'Started building web and game projects alongside coursework.',
    },
  },
  {
    year: '2024',
    title: {
      ja: '研究室配属・ゼミ長',
      en: 'Lab placement · Seminar leader',
    },
    body: {
      ja: 'メンバーの開発を技術面から支援。',
      en: 'Supports lab members on the technical side of their projects.',
    },
  },
  {
    year: '2026',
    title: {
      ja: '卒業研究・個人開発を継続中',
      en: 'Graduation research & personal projects',
    },
    body: {
      ja: '2027年 卒業見込。',
      en: 'Expected to graduate in 2027.',
    },
  },
]

/** 自己PR */
export const pr: L10n = {
  ja: '強みは、未知の課題でも自分から学び、試しながら形にできることです。分からない技術が必要になったときは、問題を小さく分け、資料を調べ、まず動く形を作ってから改善してきました。ゼミではメンバーのプログラムの問題も一緒に整理し、解決を支援しています。',
  en: 'My strength is taking on unfamiliar problems, learning what I need on my own, and iterating until something real works. When I hit an unknown technology, I break the problem down, research it, get a minimal version running, and then improve it. In my seminar I also help members untangle problems in their own code.',
}

/** 卒業研究の概要 */
export const research = {
  lab: {
    ja: '日本大学 生産工学部 計算電磁気学研究室',
    en: 'Computational Electromagnetics Lab, Nihon University',
  },
  theme: {
    ja: '極限状態における各種 AI エージェントと人間の意思決定の差異の評価',
    en: 'Evaluating how AI agents and humans differ in decision-making under extreme conditions',
  },
  summary: {
    ja: '3対1の RPG 対戦環境を独自に構築し、人間・LLM・強化学習の行動選択を比較。強化学習は生存確率の最大化に特化し、LLM はルールのハルシネーションを起こしやすく、人間は直感的なリスクテイクを行うという特性の違いを定量的に示した。',
    en: 'Built a 3-vs-1 RPG battle environment and compared the decisions of humans, LLMs, and reinforcement learning, quantifying their distinct behaviors: RL optimizes survival, LLMs hallucinate rules, and humans take intuitive risks.',
  },
} satisfies Record<string, L10n>

/** 語学 */
export const languages: { name: L10n; level: L10n }[] = [
  { name: { ja: '中国語', en: 'Chinese' }, level: { ja: '母語', en: 'Native' } },
  { name: { ja: '日本語', en: 'Japanese' }, level: { ja: '日本語能力試験 N1', en: 'JLPT N1' } },
]
