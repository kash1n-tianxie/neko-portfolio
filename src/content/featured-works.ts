import { hyakkiLantern } from './hyakki-lantern'

export type FeaturedWork = {
  id: '2048' | 'tamago-exe'
  title: string
  index: string
  status: 'IN_PROGRESS' | 'LIVE'
  slug?: string
  cover?: string
  version?: string
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
    title: 'tamago.exe',
    index: '02',
    status: 'IN_PROGRESS',
    summary: {
      ja: '現在制作中のtamago.exe。新しい作品紹介と制作の過程を、ここにまとめていきます。',
      en: 'tamago.exe is currently in development. A new project presentation and development story are on the way.',
    },
    note: {
      ja: 'ゲーム画面・詳しい紹介は、準備が整い次第公開します。',
      en: 'Gameplay visuals and the full project story will follow when ready.',
    },
  },
]
