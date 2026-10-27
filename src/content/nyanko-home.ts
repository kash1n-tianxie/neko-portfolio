import type { Work } from './works'

export const nyankoHomeGame = {
  slug: 'nyanko-home',
  version: '0.4.0',
  itchUrl: 'https://kashin-ou.itch.io/cats-and-dried-fish',
  cover: '/assets/works/nyanko-home/title.webp',
}

export const nyankoHomeWork: Work = {
  slug: nyankoHomeGame.slug,
  tag: 'GAME',
  title: 'にゃんこホーム',
  year: '2026',
  status: 'LIVE',
  releaseLabel: { ja: 'v0.4.0 · プレイ公開中', en: 'v0.4.0 · PLAYABLE NOW' },
  summary: {
    ja: '月を盗んだのは、洗濯機。6匹のネコから仲間を選び、干物とおもちゃでチームを育てる2D防衛ゲーム。準備のひと工夫と、とっておきの必殺技で、へんてこな家財たちを迎え撃とう。',
    en: 'A washing machine has stolen the moon. Choose from six cats, build a team with dried fish and toys, and defend home in a 2D strategy game. Thoughtful preparation and a well-timed ultimate turn the tide against unruly household objects.',
  },
  tech: ['Godot', '2D', 'HTML5'],
  thumbnail: nyankoHomeGame.cover,
  gallery: [
    { src: '/assets/works/nyanko-home/camp.webp', alt: { ja: '5つの品ぞろえから干物を買い、ネコの装備を整える日本語版のキャンプ画面', en: 'The Japanese camp screen, with five fish offers and equipment slots for the selected cat' } },
    { src: '/assets/works/nyanko-home/battle.webp', alt: { ja: '固定位置のネコが迫る敵を迎え撃つ防衛戦。光ったネコをクリックすると必殺技を使える', en: 'A cat defends from a fixed position; clicking the glowing cat activates its charged ultimate' } },
    { src: '/assets/works/nyanko-home/ultimate.webp', alt: { ja: '必殺技を使ったときに画面いっぱいに広がるネコの演出', en: 'A full-screen cat animation accompanies an ultimate ability' } },
    { src: '/assets/works/nyanko-home/first-fish.webp', alt: { ja: '冒険のはじめに干物を選び、最初のネコを育てる画面', en: 'Choosing the first dried fish to begin building a cat’s abilities' } },
  ],
  caseStudy: {
    problem: {
      ja: '洗濯機に月を盗まれ、身近な家財が変異した世界。最初に6匹から1匹を選び、仲間を迎えて最大5匹のチームへ。5章・20の戦いを進み、行く手をふさぐ巨大なボスに挑みます。',
      en: 'After a washing machine steals the moon, ordinary household objects begin to mutate. Start with one of six cats, recruit a party of up to five, and take on giant bosses across five chapters and twenty encounters.',
    },
    challenge: {
      ja: '戦いの合間は、キャンプで作戦会議。5つ並ぶ干物を買い、品ぞろえを更新・固定しながら装備を整えます。拠点の強化と仲間の勧誘にもお金が必要。今の一品を取るか、次の仲間を待つかが悩みどころです。',
      en: 'Between battles, make your plans at camp. Buy from five fish offers, refresh or lock the stock, and equip your cats. Base upgrades and new recruits need coins too: take a useful fish now, or save for the next teammate?',
    },
    solution: {
      ja: '干物は1匹に3つまで。同じ干物を合成すると、Lv.3で新しい仕組みが生まれ、Lv.5でさらに強化されます。22種類のおもちゃとの組み合わせで、同じネコでも違う戦い方に育ちます。',
      en: 'Each cat can equip three dried fish. Merge matching fish to unlock new mechanics at level three and a further boost at level five. Combine them with twenty-two synergistic toys to give the same cat a different way to fight.',
    },
    result: {
      ja: 'ネコは持ち場で戦い、移動操作は不要。力がたまったネコをクリックすると、各戦闘に1回の必殺技が画面いっぱいに発動します。チームで1回使える「緊急ごはん」で干物を入れ替え、苦しい場面を切り抜けよう。v0.4.0は日本語を初期設定に、短い操作ガイドとやわらかなUI音を備えています。簡体字中国語にも切り替えられます。',
      en: 'Cats fight from fixed positions, so there is no movement to control. Click a charged cat to unleash its once-per-battle ultimate with a full-screen animation. The team also gets one emergency meal per battle to swap fish. Version 0.4.0 starts in Japanese and includes brief controls guidance and soft UI sounds, with Simplified Chinese available in settings.',
    },
    highlights: [
      { ja: '6匹から選び、最大5匹のチームへ', en: 'Six cats to choose from. A party of up to five.' },
      { ja: '3つの干物 × 22種類のおもちゃ', en: 'Three fish slots per cat × twenty-two toys' },
      { ja: '5章・20の戦いと、大きなボスたち', en: 'Five chapters, twenty encounters, and giant bosses' },
    ],
  },
  links: { itch: nyankoHomeGame.itchUrl },
}
