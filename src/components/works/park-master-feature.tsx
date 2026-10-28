import { AnimatedWorkCover } from './animated-work-cover'
import { Link } from '@/i18n/navigation'
import { parkMasterProject, parkMasterWork } from '@/content/park-master'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './park-master-feature.css'

export function ParkMasterFeature({ locale, index = 3 }: { locale: 'ja' | 'en'; index?: number }) {
  const ja = locale === 'ja'
  return (
    <article id="featured-park-master" className="featured-work featured-work--park-master" aria-labelledby="park-master-feature-title">
      <div className="featured-work__topline">
        <span className="featured-work__index">{String(index).padStart(2, '0')}<span> / GAME DESIGN</span></span>
        <span className="featured-work__status"><span aria-hidden="true" />{ja ? '触って読める、Web企画書' : 'INTERACTIVE DESIGN PROPOSAL'}</span>
      </div>
      <div className="featured-work__copy">
        <p className="featured-work__category">PARK MASTER / MAP EXPANSION</p>
        <h3 id="park-master-feature-title" className="featured-work__title">PARK MASTER<span>{ja ? 'マップ拡張企画' : 'Map Expansion Proposal'}</span></h3>
        <p className="featured-work__summary">{ja ? '描く操作は、そのまま。氷・砂・橋で「あとちょっと」をつくる。遊びながら読める、ゲーム改善の企画書です。' : 'Keep drawing. Let ice, sand, and bridges change the route. A game-improvement proposal you can play as you read.'}</p>
        <Link href={`/works/${parkMasterProject.slug}`} className="featured-work__action">
          {ja ? '作品の考え方を見る' : 'Explore the design'}<ArrowUpRightIcon className="h-5 w-5" />
        </Link>
        <a className="park-master-feature__visit" href={parkMasterProject.proposalUrl} target="_blank" rel="noopener noreferrer">
          {ja ? 'Web企画書を体験する' : 'Open the interactive proposal'}<ArrowUpRightIcon className="h-4 w-4" />
        </a>
        <div className="featured-work__note"><span className="featured-work__note-mark" aria-hidden="true">＋</span><p>{ja ? '個人制作の非公式改善提案。企画・体験設計・調整方針を担当し、実装と素材制作にAIを活用。原作：面白法人カヤック。' : 'Independent, unofficial proposal. My work covers concept, experience design, and iteration decisions, with AI-assisted implementation and assets. Original game: KAYAC.'}</p></div>
      </div>
      <div className="featured-work__visual">
        <Link href={`/works/${parkMasterProject.slug}`} className="park-master-feature__cover" aria-label={ja ? 'Park Master マップ拡張企画の作品紹介へ' : 'View the Park Master proposal case study'}>
          <AnimatedWorkCover src={parkMasterWork.coverGif} fallback={parkMasterWork.thumbnail} alt={ja ? '氷上の線を描いて車を駐車するWeb試作の実演映像' : 'An actual web-prototype recording: draw a route across ice to park the car'} width={944} height={800} sizes="(max-width: 767px) 90vw, 55vw" />
        </Link>
        <p className="featured-work__visual-label"><span>ACTUAL WEBSITE / PLAYABLE MAP STUDIES</span><span>{ja ? '南極・砂漠・港・空島。動画、プレイアブル、PDFを公開。' : 'Ice, desert, harbor, and sky islands. Videos, prototypes, and a PDF.'}</span></p>
      </div>
    </article>
  )
}
