import type { Work } from './works'

export const pleaseSitGame: {
  slug: string
  version: string
  itchUrl: string
  embedUrl: string
  cover: string
  poster: string
  designPdf: string
} = {
  slug: 'please-take-a-seat',
  version: '1.0.0',
  itchUrl: 'https://kashin-ou.itch.io/please-take-a-seat',
  embedUrl: 'https://itch.io/embed-upload/19584066?color=333333',
  cover: '/assets/works/please-take-a-seat/cover.png',
  poster: '/assets/works/please-take-a-seat/title.png',
  designPdf: '/assets/works/please-take-a-seat/proposal.pdf',
}

export const pleaseSitWork: Work = {
  slug: pleaseSitGame.slug,
  tag: 'GAME',
  title: 'どうぞ、おかけください。',
  year: '2026',
  status: 'LIVE',
  releaseLabel: { ja: '無料ブラウザ版 v1.0.0', en: 'Free browser game v1.0.0' },
  summary: {
    ja: '人を席へ案内していたら、自販機も、字幕も、地球まで。動く・止まるだけで、日常が少しおかしくなる10の短いゲームです。',
    en: 'First, help someone find a seat. Then a vending machine, some subtitles, and the Earth itself. Ten short, absurd scenes played by moving—and knowing when to stop.',
  },
  role: {
    ja: '企画・ルール設計・演出・制作／開発支援：Codex',
    en: 'Concept, rules, staging, and production; development assistance by Codex',
  },
  tech: ['Godot 4.7', 'GDScript', 'HTML5'],
  thumbnail: pleaseSitGame.cover,
  gallery: [
    { src: '/assets/works/please-take-a-seat/vending.png', alt: { ja: 'ふらつく自販機の足もとへ、青いベンチを運ぶ場面', en: 'Moving a blue bench beneath a tired, wobbling vending machine' } },
    { src: '/assets/works/please-take-a-seat/sushi.png', alt: { ja: '回転寿司のお皿に置かれた小さな椅子へ、人間のお客さまを案内する場面', en: 'Guiding human customers to tiny chairs on a sushi conveyor belt' } },
    { src: '/assets/works/please-take-a-seat/cinema.png', alt: { ja: '映画を隠している青い字幕を、下の空席へ移動する場面', en: 'Moving blue subtitles away from the screen and into a row of seats' } },
    { src: '/assets/works/please-take-a-seat/park.png', alt: { ja: '公園のベンチと、こちらを見ている三羽のハト', en: 'A park bench and three pigeons watching the player' } },
    { src: '/assets/works/please-take-a-seat/cosmos.png', alt: { ja: '宇宙の大きな椅子へ青い地球を運ぶ最後の場面', en: 'The final scene: moving the blue Earth toward a large chair in space' } },
  ],
  caseStudy: {
    problem: {
      ja: '「座ってもらう」という小さな気づかいから、どこまで遊びを広げられるか。最初は会議室で人を席へ案内するゲームでした。そこから、場所や動かすものを変え、同じ操作が違う意味になる10場面を考えました。',
      en: 'How far can a small courtesy—helping someone sit down—carry a game? It began in a meeting room. Changing the setting and the thing you control became a way to give the same movement a different meaning across ten scenes.',
    },
    challenge: {
      ja: '短い場面でも、何が起きていて、何に触ればよいかは伝えたい。一方で、長い説明や、操作を止める会話は入れたくありませんでした。意外な答えに納得できるよう、反転の前に手がかりを置くことを大事にしています。',
      en: 'A short scene still needs to communicate what is happening and what the player can affect. Long explanations and interrupting dialogue would work against that. Each surprise needs a visible clue before its punchline.',
    },
    solution: {
      ja: '自販機の揺れ、こちらをまねる人、空いた椅子など、登場人物と道具の動きから状況を伝えます。操作はWASD・矢印キー、またはドラッグ。青い操作対象を動かし、ときには手を止めると反応が変わります。結果の演出は、見終わるのを待たずに次へ進めます。',
      en: 'A wobbling vending machine, people copying your movement, or an empty chair establishes the situation. Use WASD, arrow keys, or dragging to move the blue object. Sometimes releasing the controls changes the response. Players can continue without waiting for the ending animation.',
    },
    result: {
      ja: '会議の3場面と、自販機・コンビニ・回転寿司・犬の体操・映画館・公園・宇宙の7場面を実装しました。やり直し、1手戻す、場面選択、回想を備えています。初めて遊ぶ人に手がかりが伝わるか、どの反応をもう一度見たくなるかは、今後の試遊で確かめたい点です。',
      en: 'The game contains three meeting-room scenes and seven more in a street, shop, sushi restaurant, exercise park, cinema, pigeon park, and space. Restart, undo, scene selection, and a memory album support trying things again. Future first-time playtests will focus on readable clues and reactions worth revisiting.',
    },
    highlights: [
      { ja: '10場面。操作は、動く・止まる', en: 'Ten scenes. Move, then stop.' },
      { ja: '人物や道具の動きで状況を伝える', en: 'Characters and objects tell the story' },
      { ja: '人、ベンチ、犬、字幕、地球を操作', en: 'Control people, a bench, a dog, words, and Earth' },
    ],
  },
  links: { itch: pleaseSitGame.itchUrl },
}
