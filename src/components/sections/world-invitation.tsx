import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowUpRightIcon } from '../ui/icons'
import { Reveal } from '../reveal'
import './home-editorial.css'

/** A light, code-native invitation. The actual Three.js island only loads on /world. */
export async function WorldInvitation() {
  const ja = (await getLocale()) === 'ja'
  return (
    <section id="explore" className="world-invitation" aria-labelledby="world-invitation-title">
      <Reveal>
        <div className="world-invitation__frame">
          <div className="world-invitation__copy">
            <div className="world-invitation__kicker"><span className="editorial-dot" aria-hidden="true" /> ANOTHER WAY TO EXPLORE</div>
            <h2 id="world-invitation-title">{ja ? <>少し、<br />寄り道しませんか。</> : <>A small detour.<br />A different view.</>}</h2>
            <p>{ja ? 'この作品集には、歩いて入れる場所があります。小さな黒猫になって、雲の上の島へ。制作中のゲームや、これまでの実験を見つけてください。' : 'There is a place inside this portfolio you can walk into. Become a little black cat, visit an island above the clouds, and discover games and experiments along the way.'}</p>
            <Link href="/world" className="cta" data-canvas-transition>{ja ? '雲の上の島へ' : 'Enter the island'}<ArrowUpRightIcon className="h-4 w-4" /></Link>
            <div className="world-invitation__meta"><span>3D / INTERACTIVE</span><span>{ja ? 'キーボード・タッチ対応' : 'KEYBOARD & TOUCH'}</span></div>
          </div>
          <div className="world-invitation__art" aria-hidden="true">
            <div className="world-invitation__art-label"><span>NEKO WORLD</span><span>FIELD NOTES / 03</span></div>
            <svg viewBox="0 0 640 460" fill="none">
              <ellipse cx="326" cy="351" rx="184" ry="28" fill="currentColor" opacity=".035" />
              <ellipse cx="323" cy="260" rx="237" ry="139" stroke="currentColor" opacity=".12" />
              <ellipse cx="323" cy="260" rx="213" ry="119" stroke="currentColor" opacity=".08" strokeDasharray="2 8" />
              <path d="M165 262L185 308 266 348 360 352 454 305 478 254 408 215 297 218Z" fill="var(--bg)" stroke="var(--line)" />
              <path d="M166 260L232 220 230 156 263 175 285 139 306 176 367 163 391 202 446 218 478 251 447 283 365 304 282 298 207 284Z" fill="var(--surface)" stroke="currentColor" strokeOpacity=".35" />
              <path d="M435 270C516 306 542 250 487 232" stroke="var(--line)" strokeWidth="19" strokeLinecap="round" />
              <path d="M435 270C516 306 542 250 487 232" stroke="var(--surface)" strokeWidth="17" strokeLinecap="round" />
              <path d="M193 269L245 287 284 337M362 302L360 352M447 283L424 320" stroke="var(--line)" />
              <ellipse cx="248" cy="252" rx="36" ry="15" fill="currentColor" opacity=".08" />
              <ellipse cx="246" cy="250" rx="23" ry="8" stroke="currentColor" opacity=".22" />
              <path className="world-invitation__path" d="M331 289Q293 248 329 222Q363 222 371 194" stroke="currentColor" opacity=".35" />
              <g stroke="currentColor" strokeOpacity=".6" fill="var(--surface)">
                <path d="M371 240v-35l18-9 18 9v35l-18 9Z" /><path d="M371 205l18 10 18-10M389 215v34" />
                <path d="M275 215v-25l18-10 18 10v25l-18 10Z" /><path d="M275 190l18 10 18-10M293 200v25" />
              </g>
              <g fill="var(--accent)"><circle cx="293" cy="175" r="4" /><circle cx="389" cy="191" r="4" /></g>
              <path d="M293 166V115H212M389 183V146H465" stroke="var(--accent)" strokeOpacity=".55" />
              <g fill="currentColor" fontFamily="monospace" fontSize="11" letterSpacing="1"><text x="163" y="119">2048</text><text x="475" y="150">tamago.exe</text></g>
              <g stroke="var(--muted)" fill="var(--surface)" strokeWidth="1"><path d="M418 224v-30M399 204l19-38 19 38Z" /><path d="M217 241v-23M203 226l14-29 14 29Z" /><path d="M349 181v-22M336 167l13-28 13 28Z" /></g>
              <g transform="translate(329 267)"><path d="M-10 2L-11-15-4-9 5-9 12-16 11 2 6 8 7 17-8 17-7 8Z" fill="currentColor" /><path d="M7 14Q25 20 21 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><circle cx="-4" cy="-1" r="1.5" fill="var(--bg)" /><circle cx="5" cy="-1" r="1.5" fill="var(--bg)" /></g>
              <g stroke="currentColor" opacity=".2"><path d="M105 230h18m-9-9v18M491 334h18m-9-9v18" /></g>
            </svg>
            <span className="world-invitation__art-note">A SMALL ISLAND. A LITTLE CURIOSITY.</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
