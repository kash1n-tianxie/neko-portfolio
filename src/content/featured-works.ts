import { hyakkiLantern } from './hyakki-lantern'
import { tamagoGame } from './tamago'

export type FeaturedWork = {
  id: '2048' | 'tamago-exe'
  title: string
  index: string
  status: 'IN_PROGRESS' | 'LIVE'
  slug?: string
  cover?: string
  version?: string
  category: string
  coverAlt: { ja: string; en: string }
  releaseLabel: { ja: string; en: string }
  visualLabel: string
  summary: { ja: string; en: string }
  note: { ja: string; en: string }
}

/** Main exhibition spaces; retain each slot's stable anchor when a game releases. */
export const featuredWorks: FeaturedWork[] = [
  {
    id: '2048',
    title: '百鬼灯市',
    index: '01',
    status: 'LIVE',
    slug: hyakkiLantern.slug,
    cover: hyakkiLantern.cover,
    version: hyakkiLantern.version,
    category: 'HYAKKI LANTERN CITY / 2048 × AUTO DEFENSE',
    coverAlt: { ja: '月明かりの灯市に式神と百鬼が集う、百鬼灯市のキービジュアル', en: 'Spirits and yokai gather in a moonlit lantern market in the Hyakki Lantern City key visual' },
    releaseLabel: { ja: '無料体験版 v0.6.0', en: 'FREE DEMO v0.6.0' },
    visualLabel: 'KEY VISUAL / FREE DEMO v0.6.0',
    summary: {
      ja: 'その一手が、灯市を守る。2048で式神を育て、迫りくる百鬼を迎え撃つリアルタイム自動防衛ゲーム。',
      en: 'Every move keeps the lanterns alight. Merge a spirit army in 2048 and defend the night market from a procession of yokai.',
    },
    note: {
      ja: 'Web・Windows・macOSの無料体験版を公開。ゲーム内UIは日本語です。',
      en: 'A free demo for Web, Windows, and macOS. The game interface is in Japanese.',
    },
  },
  {
    id: 'tamago-exe',
    title: 'TAMAGO.exe',
    index: '02',
    status: 'LIVE',
    slug: tamagoGame.slug,
    cover: tamagoGame.cover,
    version: tamagoGame.version,
    category: 'SLOT BUILDING × DRAGON RAISING',
    coverAlt: { ja: 'TAMAGO.exeの実際の第7関。竜のスロット筐体と5つの食材', en: 'Actual TAMAGO.exe gameplay: the dragon cabinet and five food reels at gate seven' },
    releaseLabel: { ja: '新版 v4 · プレイ公開中', en: 'NEW v4 · PLAYABLE NOW' },
    visualLabel: 'ACTUAL GAMEPLAY / v4',
    summary: {
      ja: '残す、入れ替える、ごちそうになる。5つの食材とカプセルで連鎖を組み、9つの関門の先でたまごを竜へ育てるスロット構築ゲーム。',
      en: 'Keep, swap, and serve. Combine five foods with capsules, clear nine gates, and raise an egg into a dragon in a slot-building cooking game.',
    },
    note: {
      ja: '日本語版をブラウザでプレイ。8-bitから2D、立体へ、竜と画面全体が進化します。実際の画面と企画書を作品ページに掲載。',
      en: 'Play the Japanese-language game in your browser. The dragon and entire interface evolve through 8-bit, 2D, and dimensional art. Explore real screenshots and the design document.',
    },
  },
]
