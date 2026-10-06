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
  version: '1.1.0',
  itchUrl: 'https://kashin-ou.itch.io/please-take-a-seat',
  embedUrl: 'https://itch.io/embed-upload/19600690?color=333333',
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
  releaseLabel: { ja: '無料ブラウザ版 v1.1.0', en: 'Free browser game v1.1.0' },
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
    { src: '/assets/works/please-take-a-seat/vending.png', alt: { ja: '休みたい青い自販機を、飲み物を買いたいお客さんが追いかける場面', en: 'Customers follow a blue vending machine that wants to take a break' } },
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
      ja: '試遊の意見をもとに会議室以外へ舞台を広げ、10場面にしました。その後、自分でも後半を遊び直し、物を決まった場所へ運ぶだけになっていることに気づきました。結末は変わっても、途中で人を押したときの反応が薄い。場面を増やす中で、最初にあった「触ると相手が動き、もう一度試したくなる」という面白さを弱めてしまったと考えました。',
      en: 'Playtest feedback led me beyond the meeting room and into ten scenes. Replaying the later scenes myself revealed another problem: too much of the play had become carrying an object to a destination. The endings differed, but the responses along the way were thin. Expanding the settings had weakened the original appeal of nudging someone, seeing them react, and trying again.',
    },
    result: {
      ja: 'v1.1では後半7場面を作り直し、相手の反応が次の操作を変えるようにしました。自販機を動かすと買い物客が追いかけ、回転寿司では人が座った皿を押したり止めたりでき、字幕に押された観客は隣へ場所を譲ります。クリア後も動かせます。次の試遊では、プレイヤーが反応を見て動きを変えるか、自分から同じやり取りを繰り返すかを確かめたいです。',
      en: 'Version 1.1 reworks the last seven scenes so that another character’s response changes the next move. Customers pursue the vending machine; occupied sushi plates can be pushed or held; spectators move aside for subtitles. Controls remain active after completion. Further playtesting will examine whether these responses change players’ decisions and whether they choose to repeat an interaction.',
    },
    highlights: [
      { ja: '10場面。操作は、動く・止まる', en: 'Ten scenes. Move, then stop.' },
      { ja: '初期版から、実際の試遊を重ねて改善', en: 'Iterated through real playtests from the first prototype' },
      { ja: '相手が動くから、次の動きも変わる', en: 'Their response changes your next move' },
    ],
  },
  links: { itch: pleaseSitGame.itchUrl },
}
