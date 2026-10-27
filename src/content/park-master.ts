import type { Work } from './works'

export const parkMasterProject = {
  slug: 'park-master',
  proposalUrl: 'https://park.kashin.ink/',
  pdfUrl: 'https://park.kashin.ink/assets/Park-Master-Map-Proposal.pdf?v=world6',
  cover: '/assets/works/park-master/cover.webp',
} as const

export const parkMasterWork: Work = {
  slug: parkMasterProject.slug,
  tag: 'GAME',
  title: 'Park Master マップ拡張企画',
  year: '2026',
  status: 'LIVE',
  releaseLabel: { ja: 'Web企画書・プレイアブル公開中', en: 'Interactive proposal & playable prototypes' },
  summary: {
    ja: '描く操作はそのままに、氷・砂・橋でルートの判断を変える。Park Masterの非公式改善企画を、動画を見る、自分で遊ぶ、PDFで読むことができるWeb作品にしました。',
    en: 'Keep the line-drawing interaction and change the route decisions through ice, sand, and bridges. An independent Park Master improvement proposal presented as an interactive website with videos, playable prototypes, and a PDF.',
  },
  role: {
    ja: '改善企画・地形とレベルの設計・Webの体験設計・調整方針／実装・素材制作：AI支援を活用',
    en: 'Improvement concept, terrain and level design, web experience, and iteration decisions; AI-assisted implementation and asset production',
  },
  tech: ['Game Design', 'Three.js', 'JavaScript', 'HTML / CSS'],
  thumbnail: parkMasterProject.cover,
  gallery: [
    { src: '/assets/works/park-master/antarctica.webp', alt: { ja: '広い裂氷を通り、緩やかなカーブで駐車する南極マップのWeb試作', en: 'Antarctic prototype: draw a wide curve across fractured ice to park' } },
    { src: '/assets/works/park-master/desert.webp', alt: { ja: '砂による減速で、2台の交差するタイミングを変える砂漠マップのWeb試作', en: 'Desert prototype: use sand to slow cars and change their crossing times' } },
    { src: '/assets/works/park-master/harbor.webp', alt: { ja: '遠回りで開閉橋への到着時刻を調整する港マップのWeb試作', en: 'Harbor prototype: take a detour to reach the opening bridge at the right time' } },
    { src: '/assets/works/park-master/sky.webp', alt: { ja: '車の役割と橋の連動を試す空島マップの発展案', en: 'Sky-island extension prototype exploring car roles and connected bridges' } },
  ],
  caseStudy: {
    problem: {
      ja: 'ハイパーカジュアルゲームの「画面を見れば、することが分かる」という入口を保ちながら、同じ操作で遊びに変化を作れるかを考えました。面白法人カヤックのPark Masterを題材に、線を描いて駐車する操作を変えず、地形から次のルートを考え直したくなる改善案を企画しました。',
      en: 'I explored how a hypercasual game could offer variation while keeping its purpose readable at a glance. Using KAYAC’s Park Master as the subject, I kept drawing a line to park and designed terrain that encourages players to reconsider the next route.',
    },
    challenge: {
      ja: '氷や砂が小さな一部分だけにあると、そこを避ければ仕掛けが意味を持ちません。南極と砂漠では地形の面積と配置を広げ、「避ける」だけでなく「どう通るか」を考える構成に変更しました。狙うもどかしさは、失敗の理由が見えて、次の線を自分で工夫できる感覚です。',
      en: 'A tiny patch of ice or sand can simply be avoided, making the mechanic irrelevant. I expanded the terrain coverage and revised its placement so the decision becomes how to cross it. The intended frustration makes the cause of failure visible and suggests a change the player can make to the next line.',
    },
    solution: {
      ja: '南極の滑り方を主案に、砂漠の減速と港の開閉橋へ展開し、空島を発展案として分けました。企画書もWebで制作し、トップでは同じルートを通常・氷・砂で比較できます。各マップでは動画と手描きのプレイアブルを切り替え、説明の横で結果を確かめられます。スクロールで車の旅が進む背景や、クリックして開く企画メモも実装しました。',
      en: 'Antarctic sliding is the main proposal, with sand slowdown and timed harbor bridges as variations, and sky islands as an extension. The web document compares one route on normal, icy, and sandy surfaces. Map pages switch between video and hand-drawn playable routes beside the design rationale. A scroll-driven car journey and expandable design notes turn reading into interaction.',
    },
    result: {
      ja: '独立したWeb試作、実演動画、10ページのPDF企画書を公開しました。AIを実装や素材制作に活用し、主題を地形に絞る判断や、氷・砂の配置の見直しを自分で行いました。動作確認とプレイヤーによる評価は分けて記載しており、理解度や継続率の改善は未検証です。\n\n個人制作の非公式改善提案です。原作Park Masterは面白法人カヤックの作品であり、原作の開発参加や公式の共同制作を示すものではありません。',
      en: 'The published work includes independent web prototypes, demonstration videos, and a ten-page PDF proposal. I used AI to assist implementation and asset production, while deciding to focus on terrain and revising ice and sand placement. Functional checks are distinguished from player evaluation; comprehension and retention effects have not been validated.\n\nThis is an independent, unofficial improvement proposal. The original Park Master is a KAYAC game; this project does not imply involvement in the original game or an official collaboration.',
    },
    highlights: [
      { ja: '同じ線を、通常・氷・砂で見比べる', en: 'Compare one route on normal, icy, and sandy surfaces' },
      { ja: '動画と手描きのプレイアブルで確かめる', en: 'Explore videos and hand-drawn playable routes' },
      { ja: 'Webで体験し、PDFで詳しく読む', en: 'Experience the website and read the full PDF' },
    ],
  },
  links: { demo: parkMasterProject.proposalUrl },
}
