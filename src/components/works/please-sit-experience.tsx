'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { pleaseSitGame } from '@/content/please-take-a-seat'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './please-sit-experience.css'

export function PleaseSitExperience({ locale }: { locale: 'ja' | 'en' }) {
  const ja = locale === 'ja'
  const [active, setActive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const [fullscreenError, setFullscreenError] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!active || loaded) return
    const timer = window.setTimeout(() => setSlow(true), 20000)
    return () => window.clearTimeout(timer)
  }, [active, loaded])

  const launch = () => {
    if (!pleaseSitGame.embedUrl) return
    setLoaded(false)
    setSlow(false)
    setFullscreenError(false)
    setActive(true)
  }
  const close = () => {
    setActive(false)
    setLoaded(false)
    setSlow(false)
    window.requestAnimationFrame(() => launchRef.current?.focus())
  }
  const fullscreen = async () => {
    setFullscreenError(false)
    try {
      if (!frameRef.current?.requestFullscreen) throw new Error('Fullscreen unavailable')
      await frameRef.current.requestFullscreen()
    } catch {
      setFullscreenError(true)
    }
  }
  const beats = ja ? [
    ['まず、見る。', '入口をふさぐ二人、羽を広げるハト、後ろが見えない映画館。相手と席のあいだに、小さな困りごとがあります。'],
    ['どちらから、押す？', '青いものを動かして、相手を足あとや席へ。正面からでは詰まるなら、先に一人を横へ。操作は同じでも、順番と向きで結果が変わります。'],
    ['ひと押し、直す。', 'お礼のおじぎが隣の人に当たったら、配置を直す。Zで戻せます。後半7場面はクリア後も動かせるので、反応をもう一度試せます。'],
  ] : [
    ['Look first.', 'Two customers block an entrance, pigeons spread their wings, and a viewer cannot see the screen. Each scene has a small problem between its guests and their seats.'],
    ['Which side first?', 'Move the blue object and push others onto footprints or seats. If a direct push jams the entrance, make room at the side first. The controls stay simple; order and direction change the result.'],
    ['Adjust one more time.', 'A polite bow can bump a neighbour out of place. Fix the arrangement, or press Z to undo. The last seven scenes remain playable after completion so you can revisit their reactions.'],
  ]

  return (
    <div className="please-sit-experience">
      <section id="play" className="please-sit-section" aria-labelledby="please-sit-play-title">
        <p className="please-sit-kicker">PLAY / v{pleaseSitGame.version}</p>
        <h2 id="please-sit-play-title">{ja ? 'お席は、こちらです。' : 'There’s a seat for everyone.'}</h2>
        <p className="please-sit-intro">{ja ? '日本語版・全10場面。長い会話を読む前に、まず動かしてみてください。WASD・矢印キー、またはドラッグで操作できます。' : 'Ten scenes, with Japanese in-game text. No long dialogue to read before trying something. Move with WASD, arrow keys, or dragging.'}</p>
        <div className="please-sit-player">
          {active ? (
            <iframe
              ref={frameRef}
              src={pleaseSitGame.embedUrl}
              title={ja ? 'どうぞ、おかけください。日本語版 — itch.io' : 'Please, Take a Seat. Japanese game — itch.io'}
              tabIndex={0}
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              onLoad={(event) => { setLoaded(true); setSlow(false); event.currentTarget.focus({ preventScroll: true }) }}
              onError={() => setSlow(true)}
            />
          ) : (
            <>
              <Image src={pleaseSitGame.poster} alt="" width={1152} height={720} sizes="(max-width: 1023px) 90vw, 1050px" className="please-sit-player__poster" />
              <div className="please-sit-player__launch">
                {pleaseSitGame.embedUrl ? (
                  <button ref={launchRef} type="button" onClick={launch} className="please-sit-button">{ja ? 'ここでゲームをはじめる' : 'Start the game here'}<span aria-hidden="true">→</span></button>
                ) : (
                  <a href={pleaseSitGame.itchUrl} target="_blank" rel="noopener noreferrer" className="please-sit-button">{ja ? 'itch.ioで遊ぶ' : 'Play on itch.io'}<ArrowUpRightIcon className="h-4 w-4" /></a>
                )}
              </div>
            </>
          )}
        </div>
        <div className="please-sit-player__toolbar">
          <div className="please-sit-player__actions">
            {active && <><button type="button" onClick={fullscreen}>{ja ? '全画面にする' : 'Fullscreen'}</button><button type="button" onClick={close}>{ja ? 'ゲームを閉じる' : 'Close game'}</button></>}
            <span>{ja ? 'ゲーム内 Esc：一時停止' : 'In game: Esc to pause'}</span>
          </div>
          <a href={pleaseSitGame.itchUrl} target="_blank" rel="noopener noreferrer" className="please-sit-link">{ja ? 'itch.ioで開く' : 'Open on itch.io'}<ArrowUpRightIcon className="h-4 w-4" /></a>
        </div>
        <p className="please-sit-note" role="status">{active
          ? slow ? (ja ? '読み込みに時間がかかっています。itch.ioから別のタブでもお試しください。' : 'Loading is taking longer than expected. You can also try a separate tab on itch.io.')
            : loaded ? (ja ? 'ゲーム内の読み込みが終わったら開始できます。全画面から戻る際は、もう一度Escを押すとゲーム内メニューが開きます。' : 'Start when the in-game loading finishes. After leaving fullscreen, press Esc again to open the game menu.')
              : (ja ? 'ゲームを読み込んでいます。' : 'Loading the game.')
          : (ja ? '起動するまでゲームは読み込みません。スマートフォンでは横向き・全画面での操作がおすすめです。' : 'The game loads only when you start it. On a phone, use landscape orientation and fullscreen.')}</p>
        {fullscreenError && <p className="please-sit-note" role="status">{ja ? 'このブラウザでは全画面を開けませんでした。itch.ioのページからも遊べます。' : 'Fullscreen is unavailable in this browser. You can also play on the itch.io page.'}</p>}
        <ol className="please-sit-beats">{beats.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
      </section>
      <section className="please-sit-section please-sit-document" aria-labelledby="please-sit-document-title">
        <div>
          <p className="please-sit-kicker">GAME DESIGN / 日本語 PDF</p>
          <h2 id="please-sit-document-title">{ja ? '「座る」を、遊びにする。' : 'Making a game out of taking a seat.'}</h2>
          <p className="please-sit-intro">{ja ? '各話を一頁ずつ、場面・目標・考える点・相手の反応・笑いどころで解説。初期の試遊と作者自身の再プレイで見つけた課題、5段階の改善もまとめています。' : 'The Japanese proposal gives every scene a page for its setting, goals, decisions, NPC responses, and joke. It also records five iterations, distinguishing early external playtests from the author’s later replay findings.'}</p>
        </div>
        <a href={pleaseSitGame.designPdf} download className="please-sit-button please-sit-button--outline">{ja ? '企画書を読む（PDF）' : 'Design document (PDF, Japanese)'}<span aria-hidden="true">↓</span></a>
      </section>
      <section className="please-sit-section please-sit-credits" aria-labelledby="please-sit-credits-title">
        <p className="please-sit-kicker">MAKING & CREDITS</p>
        <h2 id="please-sit-credits-title">{ja ? '制作について' : 'Making the game'}</h2>
        <dl>
          <div><dt>{ja ? '企画・制作' : 'Concept & production'}</dt><dd>王家進 / Kashin Ou</dd></div>
          <div><dt>{ja ? '開発支援' : 'Development assistance'}</dt><dd>Codex</dd></div>
          <div><dt>{ja ? '音声' : 'Voice'}</dt><dd>{ja ? 'macOS Kyoko（合成音声）' : 'macOS Kyoko (synthetic voice)'}</dd></div>
          <div><dt>{ja ? 'ゲーム内書体' : 'In-game typeface'}</dt><dd>Zen Maru Gothic / SIL Open Font License</dd></div>
        </dl>
        <p className="please-sit-note">{ja ? '掲載画像はゲームの画面キャプチャです。実装にはAIによる開発支援を使用しています。' : 'Images on this page are game captures. The implementation uses AI development assistance.'}</p>
      </section>
    </div>
  )
}
