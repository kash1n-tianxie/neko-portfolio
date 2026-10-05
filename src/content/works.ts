import { hyakkiLanternWork } from './hyakki-lantern'
import { tamagoWork } from './tamago'

export type L10n = { ja: string; en: string }

export type WorkGalleryItem = {
  src: string
  alt: L10n
}

export type WorkCaseStudy = {
  problem: L10n
  challenge: L10n
  solution: L10n
  result: L10n
  highlights?: L10n[]
}

export type Work = {
  slug: string
  tag: 'GAME' | 'WEB' | 'TOOL'
  title: string
  year: string
  summary: L10n
  role?: L10n
  tech?: string[]
  status?: 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED'
  releaseLabel?: L10n
  /** 3:2 thumbnail, put the file at /public/assets/works/<slug>.webp */
  thumbnail: string
  /** Animated 3:2 cover used by the project card; thumbnail remains the reduced-motion fallback. */
  coverGif?: string
  gallery?: WorkGalleryItem[]
  caseStudy?: WorkCaseStudy
  links?: { demo?: string; itch?: string; repo?: string; video?: string }
}

/**
 * 作品データの公開元。
 * カード、フィルター、詳細ページ、ギャラリーはこの配列から自動生成される。
 */
export const works: Work[] = [
  hyakkiLanternWork,
  tamagoWork,
  {
    slug: 'rerpg',
    tag: 'TOOL',
    title: 'rerpg — Abyssal Tactics',
    year: '2026',
    summary: {
      ja: '即死級攻撃と厳しいAP制約を持つJRPG戦闘を実験環境として構築し、LLM・強化学習・人間の意思決定を比較する卒業研究プロジェクトです。',
      en: 'A graduation research platform that compares LLM, reinforcement-learning, and human decisions inside a JRPG battle with lethal attacks and strict action-point constraints.',
    },
    role: {
      ja: '研究設計・戦闘環境・Web UI・RL/LLM評価・可視化',
      en: 'Research design, battle environment, web UI, RL/LLM evaluation, and visualization',
    },
    tech: ['Python', 'Gymnasium', 'PPO', 'Stable-Baselines3', 'React', 'TypeScript', 'TensorBoard'],
    status: 'IN_PROGRESS',
    thumbnail: '/assets/works/rerpg.webp',
    coverGif: '/assets/works/rerpg-cover.gif',
    gallery: [
      {
        src: '/assets/works/rerpg-battle.webp',
        alt: {
          ja: '手動・AI・進化モードを切り替えられるJRPG戦闘画面',
          en: 'JRPG battle interface with manual, AI, and evolution modes',
        },
      },
      {
        src: '/assets/works/rerpg-agent.webp',
        alt: {
          ja: 'PPOエージェントの学習と評価を実行している画面',
          en: 'PPO agent training and evaluation output',
        },
      },
      {
        src: '/assets/works/rerpg-training.webp',
        alt: {
          ja: '報酬設計ごとの学習推移を比較するTensorBoardグラフ',
          en: 'TensorBoard comparison of training curves across reward designs',
        },
      },
    ],
    caseStudy: {
      problem: {
        ja: 'LLM、強化学習、人間は、限られた行動資源と即死リスクの下でどのように異なる判断をするのか。この問いを定量的に比較するため、同じルール・同じ状態・同じ評価指標を共有できる実験基盤が必要でした。',
        en: 'The research asks how LLMs, reinforcement learning, and humans make different decisions under limited actions and lethal risk, requiring a shared environment and evaluation protocol.',
      },
      challenge: {
        ja: '戦闘がゲームとして成立するだけでなく、学術実験として再現可能であることが課題でした。報酬設計による行動の歪み、LLMの数値計算ミス、最終レポートと実測値の不一致を検出できる評価経路も必要でした。',
        en: 'The battle had to work as a game and as a reproducible experiment, including detection of reward hacking, arithmetic errors from LLM agents, and mismatches between measured data and reports.',
      },
      solution: {
        ja: 'Gymnasium準拠の戦闘環境、PPO学習、LLM自動プレイ、動的計画法による理論上限、React製の観察UIを一つのプロジェクトに統合しました。Baseline・詳細報酬・Potential-based Shapingを同じ指標で比較し、テストとTensorBoardログから結果を生成する構成にしました。',
        en: 'The project integrates a Gymnasium environment, PPO training, LLM autoplay, a dynamic-programming oracle, and a React observation UI. Multiple reward designs share tests, metrics, and TensorBoard-based reporting.',
      },
      result: {
        ja: '戦闘ロジック、学習、可視化、学術文書を往復できる再現可能な研究基盤を構築しました。単純な勝敗だけでなく、ダメージ効率、生存、回復依存、行動ミスを追跡し、「なぜその方策が強いか」を説明できる証拠の形に整理しています。',
        en: 'The result is a reproducible research pipeline linking battle logic, training, visualization, and academic documentation, with metrics that explain why a policy succeeds rather than reporting wins alone.',
      },
      highlights: [
        { ja: 'RL・LLM・人間を同一環境で比較', en: 'RL, LLM, and human comparison' },
        { ja: 'DPオラクルと学術指標を実装', en: 'DP oracle and academic metrics' },
        { ja: '日・英・中の研究文書', en: 'Japanese, English, and Chinese docs' },
      ],
    },
    links: {
      repo: 'https://github.com/kash1n-tianxie/rerpg',
    },
  },
  {
    slug: 'hand-particle-system',
    tag: 'WEB',
    title: 'ハンドトラッキング・パーティクルシステム',
    year: '2026',
    summary: {
      ja: 'カメラで両手の骨格を追跡し、開閉・傾き・左右の役割によって3Dパーティクルの分解、再構築、回転、モデル切替を操作するWebGLインタラクションです。',
      en: 'A WebGL interaction that tracks both hands and maps gestures to particle explosion, reconstruction, orbital rotation, and model switching.',
    },
    role: {
      ja: 'インタラクション設計・WebGL実装・ハンドトラッキング・最適化',
      en: 'Interaction design, WebGL implementation, hand tracking, and optimization',
    },
    tech: ['Three.js', 'MediaPipe Hands', 'WebGL', 'GLTF', '1-Euro Filter', 'JavaScript'],
    status: 'LIVE',
    thumbnail: '/assets/works/hand-particles.webp',
    coverGif: '/assets/works/hand-particles-cover.gif',
    gallery: [
      {
        src: '/assets/works/hand-particles-demo.webp',
        alt: {
          ja: '左右の手の骨格と発光する3Dパーティクルモデルを表示する操作画面',
          en: 'Interface showing tracked hand skeletons and a glowing 3D particle model',
        },
      },
    ],
    caseStudy: {
      problem: {
        ja: 'マウスやタッチではなく、身体の動きをそのまま3D表現へ接続する操作体験を試作しました。ジェスチャーは直感的である一方、カメラ入力の揺れや誤認識がそのまま画面酔いと操作ミスにつながります。',
        en: 'This experiment connects body movement directly to 3D visuals. Although gestures are intuitive, camera noise and recognition errors can immediately create unstable motion and false input.',
      },
      challenge: {
        ja: '左右の手に別々の役割を持たせながら、開閉状態と手首の傾きを低遅延で判定することが課題でした。さらに、多数のパーティクル、GLBモデル、Bloom後処理を同時に動かしつつ、入力のちらつきを抑える必要がありました。',
        en: 'The challenge was assigning distinct roles to both hands, detecting open/closed states and wrist tilt with low latency, and stabilizing input while rendering particles, GLB models, and bloom post-processing.',
      },
      solution: {
        ja: 'MediaPipe Handsのランドマークから左右・開閉・傾きを判定し、1-Euro Filterで速度に応じて平滑化の強さを調整しました。左手は分解と再構築、右手は回転とモデル切替に限定し、操作の衝突を避けています。映像そのものは表示せず、骨格だけを描画するプライバシー配慮も行いました。',
        en: 'MediaPipe landmarks determine handedness, openness, and tilt, while a 1-Euro Filter adapts smoothing to movement speed. Left and right hands have separate responsibilities, and only the skeleton—not raw video—is shown.',
      },
      result: {
        ja: '手を開く・握る・傾けるという少数のジェスチャーで、粒子の爆発、再構築、軌道回転、モデル変更を操作できるデモを完成させました。ビルド工程を必要としないVanilla構成で、GitHub Pages上からカメラを許可して体験できます。',
        en: 'The finished demo controls particle explosion, reconstruction, orbit, and model changes through a small gesture vocabulary. It runs as a no-build vanilla project on GitHub Pages.',
      },
      highlights: [
        { ja: '左右の手をリアルタイム認識', en: 'Real-time two-hand tracking' },
        { ja: '低遅延の1-Euro Filter', en: 'Low-latency 1-Euro Filter' },
        { ja: 'カメラ映像を保存・表示しない設計', en: 'Privacy-preserving sensor view' },
      ],
    },
    links: {
      demo: 'https://kash1n-tianxie.github.io/portfolio/',
      repo: 'https://github.com/kash1n-tianxie/portfolio',
    },
  },
  {
    slug: 'sangokushi-td',
    tag: 'GAME',
    title: '三国志 文字防衛',
    year: '2026',
    summary: {
      ja: '「趙」＋「雲」で趙雲を出陣させる文字合成を中核に、タワーディフェンスと無限ローグライクを組み合わせたブラウザゲーム。漢字そのものがユニット・敵・演出として戦場を動きます。',
      en: 'A browser game combining kanji fusion, tower defense, and an endless roguelike. Joining characters such as 趙 and 雲 summons Zhao Yun, making written language itself the battlefield.',
    },
    role: {
      ja: '企画・ゲーム設計・実装・UI/UX・演出・Webリリース',
      en: 'Concept, game design, implementation, UI/UX, effects, and web release',
    },
    tech: ['Godot 4.6', 'GDScript', 'HTML5', 'Data-driven Design', 'Procedural Audio'],
    status: 'LIVE',
    thumbnail: '/assets/works/sangokushi-td.webp',
    coverGif: '/assets/works/sangokushi-td-cover.gif',
    gallery: [
      {
        src: '/assets/works/sangokushi-fusion.webp',
        alt: {
          ja: '武将字を隣接させ、張飛を覚醒させた文字合成の盤面',
          en: 'Kanji-fusion board where adjacent characters awaken Zhang Fei',
        },
      },
      {
        src: '/assets/works/sangokushi-commanders.webp',
        alt: {
          ja: '12名の武将と複数の羈絆が同時に発動する戦闘画面',
          en: 'Battle screen with multiple heroes and bond effects active',
        },
      },
      {
        src: '/assets/works/sangokushi-defense.webp',
        alt: {
          ja: '水墨地図の三つの進軍路で阿斗を守るタワーディフェンス画面',
          en: 'Tower-defense battle protecting A Dou across an ink-painted map',
        },
      },
    ],
    caseStudy: {
      problem: {
        ja: '三国志を題材にするだけではなく、日本語の漢字そのものをゲームの判断に変えることを目標にしました。プレイヤーが字を集め、並べ、意味のある武将名を完成させる行為を、戦力構築と防衛の両方へ直結させる必要がありました。',
        en: 'The goal was to turn Japanese kanji into decisions rather than use the Three Kingdoms only as a theme. Collecting and arranging characters needed to connect directly to army building and defense.',
      },
      challenge: {
        ja: '文字ユニット、複数ルート、合成、武将の攻撃範囲、敵状態、資源と羈絆を一画面で読めるようにすることが最大の課題でした。さらに、短い序盤から六幕・60波後の無限輪廻まで、基本兵と武将の両方が意味を失わない成長曲線が必要でした。',
        en: 'The main challenge was making glyph units, multiple routes, fusion, attack shapes, enemy states, resources, and bonds readable on one screen while preserving useful growth across six acts and endless play.',
      },
      solution: {
        ja: '同じ兵のマージと、隣接する武将字の組成を一つの盤面操作へ統合しました。武将ごとに異なる攻撃形状を実際の当たり判定として可視化し、羈絆の進捗、特殊マス、敵の状態字標を常時表示。武将・羈絆・武器をデータ駆動化し、経路テンプレートとローグライク報酬でランごとの判断を変えています。',
        en: 'Unit merging and adjacent-name composition share one board interaction. Real attack shapes, bond progress, special tiles, and enemy state glyphs stay visible, while data-driven heroes, weapons, route templates, and rewards vary each run.',
      },
      result: {
        ja: '12名の武将、7種の羈絆、固有の通常攻撃と大招、六つの歴史幕から無限輪廻へ続く1ランを実装しました。主将選択、戦功による解放、セーブ、チュートリアル、倍速操作まで含め、マウスまたはタップだけで遊べるHTML5版として公開しています。',
        en: 'The released HTML5 version includes 12 heroes, seven bonds, signature attacks and ultimates, six historical acts leading into endless cycles, commander progression, saves, tutorials, and touch-friendly controls.',
      },
      highlights: [
        { ja: '12武将・全員固有の攻撃形状', en: '12 heroes with unique attack shapes' },
        { ja: '六幕60波から無限輪廻へ', en: 'Six acts and 60 waves into endless play' },
        { ja: 'Godot製ブラウザ版を公開', en: 'Godot browser build released' },
      ],
    },
    links: {
      itch: 'https://kashin-ou.itch.io/sangokushi-moji-boei',
      repo: 'https://github.com/kash1n-tianxie/SangokushiTD',
    },
  },
  {
    slug: 'orbit-defense',
    tag: 'GAME',
    title: 'Orbit Defense',
    year: '2026',
    summary: {
      ja: '三つの軌道を公転するタワーと操作可能なドローンで、中央惑星を守る幾何学タワーディフェンス・ローグライク。配置角度と軌道の回転そのものが、射界と連携を変える戦略になります。',
      en: 'A geometric tower-defense roguelike where orbiting turrets and a controllable drone protect a central planet. Placement angles and rotating firing arcs continuously reshape the strategy.',
    },
    role: {
      ja: '企画・ゲーム設計・Godot実装・UI/UX・演出・サウンド・映像制作',
      en: 'Concept, game design, Godot implementation, UI/UX, effects, sound, and promo production',
    },
    tech: ['Godot 4.6+', 'GDScript', 'Procedural Graphics', 'Procedural Audio', 'Godot Movie Maker'],
    status: 'IN_PROGRESS',
    thumbnail: '/assets/works/orbit-defense.webp',
    coverGif: '/assets/works/orbit-defense-cover.gif',
    gallery: [
      {
        src: '/assets/works/orbit-defense-line.webp',
        alt: {
          ja: '三つの軌道に異なるタワーを配置した高密度の防衛戦',
          en: 'A dense defense line built from varied turrets across three orbital rings',
        },
      },
      {
        src: '/assets/works/orbit-defense-black-hole.webp',
        alt: {
          ja: 'ドローンの位置へ発動したブラックホールが敵群を引き寄せる場面',
          en: 'A black hole cast at the drone position pulls in an incoming enemy formation',
        },
      },
      {
        src: '/assets/works/orbit-defense-final-assault.webp',
        alt: {
          ja: '最終決戦の警告とともに巨大ボスが軌道防衛線へ迫る場面',
          en: 'The final-assault warning as a giant boss closes in on the orbital defense',
        },
      },
    ],
    caseStudy: {
      problem: {
        ja: '一般的なタワーディフェンスでは、設置後の射程と役割が固定されがちです。本作では「置いたタワーが公転し続ける」ルールを中核にし、時間によって射線と連携が変わる防衛を目指しました。さらに、待つだけにならないよう、プレイヤー自身がドローンを操作して戦場へ介入できる必要がありました。',
        en: 'Traditional tower defense often leaves range and role fixed after placement. Orbit Defense makes continuous orbital motion the central rule, so firing lines and synergies change over time, while a controllable drone keeps the player actively involved.',
      },
      challenge: {
        ja: '三つの回転軌道、複数種の索敵、弾丸・レーザー・連鎖電撃、敵の状態、ドローン操作、スキル演出を同時に動かしながら、中心の攻防を一目で読める状態に保つことが課題でした。終盤の高密度戦でも、タワーの色と形、敵の危険度、UIの情報階層を崩さない性能設計も必要でした。',
        en: 'The challenge was running three rotating rings, multiple targeting behaviors, projectiles, beams, chain lightning, enemy states, drone input, and skills while keeping the central battle readable and performant under late-game density.',
      },
      solution: {
        ja: '軌道の位相を一つの主制御で管理し、全タワーをスロット番号から再配置する構成にしました。攻撃・支援・資源を含む8系統をデータ駆動化し、ドローンの多重射撃、メテオ、時間停止、ブラックホール、衝撃波を同じ戦場状態へ接続。描画と効果音はプロシージャルに構築し、少ない素材でも統一したネオン幾何学表現を作っています。',
        en: 'A central phase controller positions every turret from its ring and slot. Eight data-driven tower families connect with multi-shot drone fire, meteor, time stop, black hole, and shockwave abilities, while procedural rendering and audio create a cohesive neon-geometric style.',
      },
      result: {
        ja: '9日×3波の戦役、第27波の最終ボス、その先の無限モードまでを実装しました。今回さらに、実ゲームを固定60fpsで自動進行させ、15秒MP4、3:2ループGIF、5枚のキーショットを同じテイクから再現可能に生成するプロモーション管線を整備しています。',
        en: 'The game now spans a nine-day, three-wave campaign, a final boss on wave 27, and an endless mode. A reproducible promo pipeline also drives the real game at a fixed 60 fps and derives a 15-second MP4, 3:2 looping GIF, and five key shots from one take.',
      },
      highlights: [
        { ja: '三つの公転軌道・8系統のタワー', en: 'Three orbital rings and eight tower families' },
        { ja: 'ドローン＋3種のスキル＋衝撃波', en: 'Drone, three skills, and shockwave' },
        { ja: '第27波の最終決戦から無限モードへ', en: 'Wave-27 finale into endless mode' },
      ],
    },
    links: {
      itch: 'https://kashin-ou.itch.io/orbit-defense',
      repo: 'https://github.com/kash1n-tianxie/Orbit-Defense',
      video: '/assets/works/orbit-defense-promo-15s.mp4',
    },
  },
]

export const githubUrl = 'https://github.com/kash1n-tianxie'
