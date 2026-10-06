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
    ja: '企画・試遊・ルール設計・改善方針／開発支援：Codex',
    en: 'Concept, playtesting, rule design, and iteration decisions; development assistance by Codex',
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
      ja: '最初の試作は、人と椅子を置いたシンプルなものでした。実際に人に遊んでもらうと、座らせるだけでは退屈だという課題が見えました。操作に目的や状況が必要だと考え、会議室を舞台にして、誰をどこへ案内するのかが伝わる場面へ変えました。',
      en: 'The first prototype was a simple arrangement of people and chairs. Real players found that seating people alone was dull. I saw a need to give the action a purpose and a context, so I introduced a meeting room that showed whom to guide and where.',
    },
    challenge: {
      ja: '会議室にした後の試遊でも、まだ味気ないという課題が残りました。そこで、人にぶつかると「すみません」「通ります」が繰り返される反応を追加しました。丁寧な言葉が重なるほどおかしくなる、少ししつこい間を狙っています。移動の手軽さを保ちながら、触ったときの反応を作る変更です。',
      en: 'Further playtesting of the meeting-room version still exposed a dry experience. I added repeated “すみません” and “通ります” when the player bumps into people. The intention is for polite phrases to become absurd through repetition, giving simple movement a more expressive response.',
    },
    solution: {
      ja: 'その後も試遊の意見をもとに、会議室以外へ舞台を広げました。「座る」は共通にして、操作するものを人からベンチ、犬、字幕、地球へ変えています。自販機の揺れや、小さな椅子を載せた回転寿司の皿が、説明を読ませずに状況を伝えます。WASD・矢印キー、またはドラッグで動かし、ときには止まるだけで反応が変わります。',
      en: 'Later playtest feedback led me beyond the meeting room. Sitting remains the theme, while the player controls people, a bench, a dog, subtitles, or the Earth. A wobbling vending machine and tiny chairs on conveyor-belt plates establish each situation without a forced story sequence. Move with WASD, arrow keys, or dragging; sometimes stopping changes the response.',
    },
    result: {
      ja: '実際の試遊で課題を見つけ、変更を重ねて、会議3場面とそれ以外の7場面を収めたブラウザ版を公開しました。企画書では、受けた意見、自分の判断、実装した変更を分けて記載しています。今後も、場面の手がかりがどう伝わるか、音声の反復が楽しい反応から煩わしさに変わるのはどこかを観察していきたいです。',
      en: 'The published browser game brings together three meeting-room scenes and seven other settings, developed through repeated changes informed by real playtests. The proposal separates player feedback, my design decisions, and the changes implemented. Further testing can examine how players read scene clues and when repeated speech shifts from amusing to intrusive.',
    },
    highlights: [
      { ja: '10場面。操作は、動く・止まる', en: 'Ten scenes. Move, then stop.' },
      { ja: '初期版から、実際の試遊を重ねて改善', en: 'Iterated through real playtests from the first prototype' },
      { ja: '人、ベンチ、犬、字幕、地球を操作', en: 'Control people, a bench, a dog, words, and Earth' },
    ],
  },
  links: { itch: pleaseSitGame.itchUrl },
}
