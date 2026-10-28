import type { WorldMap } from './world-types'

/** Geometry is in native 768×512 map pixels, calibrated to the generated map. */
export const TOWN_MAP: WorldMap = {
  width: 768, height: 512,
  spawn: { x: 377, y: 425 },
  bounds: { x: 28, y: 34, w: 708, h: 446 },
  obstacles: [
    { x: 30, y: 34, w: 278, h: 25 }, { x: 442, y: 34, w: 294, h: 25 },
    { x: 102, y: 50, w: 174, h: 108 }, { x: 509, y: 48, w: 170, h: 112 },
    { x: 337, y: 102, w: 62, h: 48 }, { x: 410, y: 117, w: 12, h: 21 },
    { x: 28, y: 80, w: 65, h: 159 }, { x: 48, y: 180, w: 54, h: 51 },
    { x: 105, y: 198, w: 48, h: 38 }, { x: 187, y: 214, w: 47, h: 40 },
    { x: 222, y: 251, w: 52, h: 44 }, { x: 280, y: 274, w: 32, h: 33 },
    { x: 28, y: 241, w: 111, h: 81 }, { x: 154, y: 260, w: 44, h: 32 },
    { x: 250, y: 304, w: 40, h: 20 }, { x: 253, y: 350, w: 49, h: 36 },
    { x: 28, y: 348, w: 145, h: 87 }, { x: 180, y: 351, w: 71, h: 76 },
    { x: 28, y: 447, w: 315, h: 33 }, { x: 416, y: 445, w: 320, h: 35 },
    { x: 414, y: 329, w: 26, h: 37 }, { x: 429, y: 192, w: 21, h: 17 },
    { x: 535, y: 227, w: 201, h: 218 }, { x: 480, y: 233, w: 55, h: 55 },
    { x: 454, y: 333, w: 81, h: 112 }, { x: 439, y: 370, w: 15, h: 70 },
    { x: 694, y: 59, w: 42, h: 168 }, { x: 420, y: 67, w: 28, h: 37 },
  ],
  spots: [
    {
      id: 'guide', kind: 'npc', x: 379, y: 348, radius: 28, sprite: 'cream', workSlug: 'nyanko-home',
      name: { ja: '案内ねこ・ミント', en: 'Mint · town guide' },
      title: { ja: 'ねこたちの、おかえり。', en: 'A home for every cat.' },
      lines: {
        ja: ['ようこそ、ねこのよりみちへ。道を歩いて、気になるもののそばで E を押してみて。', 'この町には、6つの作品の便りが隠れているよ。最初は「にゃんこホーム」。干物とおもちゃで仲間を育てる、ねこたちの防衛ゲームなんだ。'],
        en: ['Welcome to Neko No Yorimichi. Follow a path, then press E beside anything that catches your eye.', 'Six project stories are tucked around town. First up: Nyanko Home, a defense game where dried fish and toys help you raise a team of cats.'],
      },
    },
    {
      id: 'cook', kind: 'npc', x: 181, y: 329, radius: 29, sprite: 'ginger', workSlug: 'tamago-exe',
      name: { ja: '料理ねこ・ゆず', en: 'Yuzu · the cook' },
      title: { ja: 'たまごから始まる冒険', en: 'An adventure from an egg' },
      lines: {
        ja: ['野菜を育てるのも、料理を組み合わせるのも、ちょっとした工夫が楽しいんだ。', 'TAMAGO.exe では、5つの食べ物とカプセルを組み合わせて9つの関門へ。たまごがドラゴンへ育つ、スロット構築のお料理ゲームだよ。'],
        en: ['Growing vegetables and combining a meal both leave room for a little experiment.', 'TAMAGO.exe combines five foods and capsules across nine gates. It is a slot-building cooking game in which an egg grows into a dragon.'],
      },
    },
    {
      id: 'maker', kind: 'npc', x: 582, y: 189, radius: 29, sprite: 'calico', workSlug: 'park-master',
      name: { ja: '工房ねこ・モモ', en: 'Momo · the maker' },
      title: { ja: '線をひいて、道をつくる', en: 'Draw a line. Find a route.' },
      lines: {
        ja: ['同じ操作でも、地面が変わると考え方が変わる。そんな仕掛けを研究しているよ。', 'PARK MASTER の非公式改善企画は、氷・砂・橋でルートを変える提案。読むだけでなく、Web上で触って確かめられるんだ。'],
        en: ['The same input can ask a different question when the ground changes.', 'The unofficial PARK MASTER improvement proposal explores ice, sand, and bridges. You can test the ideas in an interactive web design document.'],
      },
    },
    {
      id: 'arcade', kind: 'board', x: 368, y: 165, radius: 28, workSlug: 'meme-clash',
      name: { ja: '町の掲示板', en: 'Town notice board' }, title: { ja: 'ひと勝負、どう？', en: 'Ready for a match?' },
      lines: { ja: ['掲示板に、にぎやかな対戦会のチラシが貼られている。', 'ミーム大乱闘は、連携と必殺技をつなぐ2D対戦アクション。CPU対戦、同じキーボードでの2人対戦、トレーニングがある。'], en: ['A lively tournament flyer is pinned to the board.', 'MEME CLASH is a 2D fighting game built around combinations and special moves, with CPU battles, shared-keyboard matches and training.'] },
    },
    {
      id: 'library', kind: 'board', x: 214, y: 174, radius: 28, workSlug: 'please-take-a-seat',
      name: { ja: '図書室の案内板', en: 'Library reading corner' }, title: { ja: 'どうぞ、おかけください。', en: 'Please, take a seat.' },
      lines: { ja: ['玄関のそばに、小さな遊びの本が置いてある。', '「すみません」と押して進む10の短いシーン。相手と近づく方向を変えると、通り抜け方も変わっていく。'], en: ['A little book of playful experiments rests beside the doorstep.', 'Ten short scenes ask you to say “excuse me” and nudge your way through. Whom you push and the direction you approach change the way forward.'] },
    },
    {
      id: 'pond', kind: 'pond', x: 494, y: 312, radius: 28, workSlug: 'hyakki-lantern',
      name: { ja: 'ひらめきの池', en: 'Pond of ideas' }, title: { ja: '池から届いた、灯りの便り', en: 'A lantern-lit message' },
      lines: { ja: ['魚といっしょに、小さな便りが釣れた！', '百鬼灯市は、2048で式神の軍団を育てて夜の市を守るゲーム。一手の判断が、その先の防衛につながっている。'], en: ['A fish brought a little message to the surface!', 'Hyakki Lantern City grows an army of spirits through 2048 and defends a night market. Each move shapes the defense that follows.'] },
    },
    {
      id: 'post', kind: 'mailbox', x: 420, y: 150, radius: 24,
      name: { ja: '赤い郵便受け', en: 'The red postbox' }, title: { ja: '町の外へ、お手紙を', en: 'Send a letter beyond town' },
      lines: { ja: ['ここは、つくり手へ便りを届ける郵便受け。', '気になった作品や、お仕事の話など。メールやGitHubから、気軽につながってください。'], en: ['This postbox connects the town to its maker.', 'Have a question about a project, or an opportunity to discuss? Reach out by email or find the code on GitHub.'] },
    },
  ],
}

// Materialize resident footprints into the same geometry used by both input and
// routing. Tapping a cat now walks beside it instead of stacking both sprites.
TOWN_MAP.obstacles.push(...TOWN_MAP.spots.filter(spot => spot.kind === 'npc').map(spot => ({
  x: spot.x - 8, y: spot.y - 8, w: 16, h: 16,
})))
