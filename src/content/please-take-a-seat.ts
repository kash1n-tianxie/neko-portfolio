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
  version: '1.2.0',
  itchUrl: 'https://kashin-ou.itch.io/please-take-a-seat',
  embedUrl: 'https://itch.io/embed-upload/19601605?color=333333',
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
  releaseLabel: { ja: '無料ブラウザ版 v1.2.0', en: 'Free browser game v1.2.0' },
  summary: {
    ja: '「すみません」と人を席へ押していたら、自販機も、字幕も、地球まで。誰から、どちらから押すか。譲り合うほど少しおかしくなる、10の短いゲームです。',
    en: 'Say “すみません” and nudge everyone into place—even a vending machine, subtitles, and the Earth. Ten absurd scenes where whom you push first and which side you approach change the way through.',
  },
  role: {
    ja: '企画・試遊・ルール設計・改善方針／開発支援：Codex',
    en: 'Concept, playtesting, rule design, and iteration decisions; development assistance by Codex',
  },
  tech: ['Godot 4.7', 'GDScript', 'HTML5'],
  thumbnail: pleaseSitGame.cover,
  gallery: [
    { src: '/assets/works/please-take-a-seat/vending.png', alt: { ja: '青い自販機が、入口をふさぐ二人を両側の足あとへ案内する場面', en: 'A blue vending machine makes space by nudging two customers to waiting footprints' } },
    { src: '/assets/works/please-take-a-seat/sushi.png', alt: { ja: '湯のみでお皿を止めながら、二人を隣り合う椅子へ案内する場面', en: 'Using a tea cup to stop plates while seating two neighbours on the conveyor' } },
    { src: '/assets/works/please-take-a-seat/cinema.png', alt: { ja: '背の違う観客を、後ろの人にも字幕が見えるように座らせる場面', en: 'Seating viewers of different heights while keeping the subtitles visible from behind' } },
    { src: '/assets/works/please-take-a-seat/park.png', alt: { ja: '横から押すと羽をたたむ三羽のハトと、面接用のベンチ', en: 'Three pigeons fold their wings when nudged from the side at an interview bench' } },
    { src: '/assets/works/please-take-a-seat/cosmos.png', alt: { ja: '土星の輪を回し、惑星を席へ案内してから地球も座る最後の場面', en: 'Turning Saturn’s ring and seating the planets before the Earth takes its own seat' } },
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
      ja: '試遊の意見をもとに会議室以外へ舞台を広げ、10場面にしました。その後、自分でも後半を遊び直し、物を決まった場所へ運ぶだけになっていることに気づきました。v1.1では連鎖する押し合いや動く皿など、操作中の返事を増やしました。しかし、もう一度遊ぶと「反応は増えたが、どう押すかを考える場面はまだ少ない」という課題が残りました。',
      en: 'Playtest feedback led me beyond the meeting room and into ten scenes. Replaying the later scenes myself revealed that too much of the play had become carrying an object to a destination. Version 1.1 added responses during movement, including chain reactions and moving plates. A further replay exposed a remaining problem: there were more reactions, but still too few reasons to choose how to push.',
    },
    result: {
      ja: 'v1.2では「すみませんと言いながら、相手を決まった場所へ押す」を全話の軸に据えました。自販機は入口の二人を外側へ、映画館は全員を座らせたうえで字幕が見える配置へ。回転寿司では湯のみを押して皿を止め、宇宙では土星の輪の端を押して狭い通路を通します。順番・方向・空間の使い方が結果を変える改修です。新しい企画書には各話の目標、判断、NPCの反応、笑いどころを一頁ずつ記載しました。新版の面白さは、次の人による試遊で確かめます。',
      en: 'Version 1.2 anchors every scene in saying “すみません” while pushing others into designated places. The vending machine must move two customers outward; the cinema requires both seated viewers and readable subtitles. A pushed tea cup stops sushi plates, while pushing the edge of Saturn’s ring turns it through a narrow passage. Order, direction, and space now affect the result. The proposal gives each scene its own page covering goals, decisions, NPC responses, and the joke. Whether these changes are more fun remains a question for the next human playtest.',
    },
    highlights: [
      { ja: '10場面。押す順番と向きを考える', en: 'Ten scenes. Choose the order and direction of each push.' },
      { ja: '初期版から、実際の試遊を重ねて改善', en: 'Iterated through real playtests from the first prototype' },
      { ja: '押す → 相手が反応する → 配置を直す', en: 'Nudge, watch the response, then adjust the arrangement' },
    ],
  },
  links: { itch: pleaseSitGame.itchUrl },
}
