'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { hyakkiLantern } from '@/content/hyakki-lantern'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './hyakki-experience.css'

const copy = {
  ja: {
    videoTitle: '灯市を守る、ひと続きの手。',
    videoNote: '実際のゲームプレイを編集したダイジェストです。合成、道具の使用、ボスとの対峙を収録。動画は再生ボタンを押すと始まります。',
    videoLabel: '百鬼灯市・実際のゲームプレイダイジェスト',
    videoError: '動画を読み込めませんでした。スクリーンショットや無料体験版でもゲームの様子をご覧いただけます。',
    videoFallback: '動画を別のタブで開く',
    videoCredits: '映像・音楽クレジット',
    playTitle: '次の一手は、あなたの番。',
    playNote: '無料体験版 v0.6.0。ゲーム内UIは日本語です。PCのキーボードでのプレイをおすすめします。',
    start: 'ここで無料体験版を起動',
    desktopNote: 'クリック後にitch.ioからゲームを読み込みます。初回は読み込みに時間がかかることがあります。',
    mobileNote: '小さい画面では、itch.ioで開いてお試しください。見やすいPC画面でのプレイがおすすめです。',
    external: 'itch.ioで遊ぶ・ダウンロード',
    stop: 'ゲームを閉じる',
    closeNote: '途中セーブはありません。「ゲームを閉じる」と現在の対局は終了します。',
    fullscreen: '全画面で遊ぶ',
    loading: 'ゲームを読み込み中です。',
    loaded: 'ゲームページを開きました。画面内の読み込み完了を待って開始してください。音が出ない場合は、ゲーム内を一度クリックしてください。',
    slow: '読み込みに時間がかかっています。開けない場合はitch.ioからお試しください。',
    fullscreenError: '全画面に切り替えられませんでした。itch.ioから別のタブでも遊べます。',
    controlsTitle: '遊び方',
    controls: [
      ['合成する', '矢印キー・WASD、または盤面の周囲にある矢印で操作。同じ数字を重ねて式神を育てます。'],
      ['守りきる', '式神は自動攻撃。2048の完成、または最終侵攻への到達で最終決戦へ。大天狗を倒すと勝利、結界HPが0になると敗北です。'],
      ['立て直す', '盤面が詰まっても戦闘は続きます。金で買える「整理の爆竹」は32以下の駒を一つ取り除き、ボス報酬では売却や転位を使えます。'],
    ],
    creditsTitle: '制作とクレジット',
    ai: '企画・ゲームデザイン・ディレクション：Kashin Ou。実装にAI支援を使用し、背景・式神などのビジュアルにはAI生成画像を使用しています。音楽とフォントには、配布条件を確認した外部素材を使用しています。',
    normalMusic: '通常BGM', bossMusic: 'ボスBGM',
    completeCredits: 'すべてのクレジット・ライセンス',
  },
  en: {
    videoTitle: 'A few moves through the lantern market.',
    videoNote: 'An edited digest of actual gameplay, showing merges, support items, and a boss encounter. The video starts only when you press play.',
    videoLabel: 'Hyakki Lantern City — actual gameplay digest',
    videoError: 'The video could not be loaded. Explore the screenshots or try the free demo below.',
    videoFallback: 'Open the video in a new tab',
    videoCredits: 'Video & music credits',
    playTitle: 'Your next move starts here.',
    playNote: 'Free demo v0.6.0. The game interface is in Japanese. A computer with a keyboard is recommended.',
    start: 'Launch the free demo here',
    desktopNote: 'The game loads from itch.io only after you click. The first load may take a little time.',
    mobileNote: 'On a small screen, open the demo on itch.io. A larger computer screen is recommended for comfortable play.',
    external: 'Play or download on itch.io',
    stop: 'Close game', fullscreen: 'Play fullscreen',
    closeNote: 'There is no mid-run save. Closing the game ends the current run.',
    loading: 'Loading the game.',
    loaded: 'The game page is open. Wait for its loading screen to finish, then start. If audio is silent, click inside the game once.',
    slow: 'Loading is taking longer than expected. You can also open the demo on itch.io.',
    fullscreenError: 'Fullscreen was unavailable. You can open the game in a separate tab on itch.io.',
    controlsTitle: 'How to play',
    controls: [
      ['Merge', 'Use arrow keys, WASD, or the arrows around the board. Combine matching numbers to grow stronger spirits.'],
      ['Defend', 'Your spirits attack automatically. Reaching 2048 or the final invasion stage brings the final battle. Defeat the Great Tengu to win; you lose when the barrier HP reaches zero.'],
      ['Recover', 'A blocked board keeps fighting. Spend gold on a clearing firecracker to remove one tile valued 32 or below. Boss rewards unlock selling a unit or repositioning it.'],
    ],
    creditsTitle: 'Making & credits',
    ai: 'Concept, game design, and direction by Kashin Ou, with AI-assisted implementation. Backgrounds, spirits, and other visuals use AI-generated images. Music and fonts use external assets under their respective distribution licenses.',
    normalMusic: 'Ordinary BGM', bossMusic: 'Boss BGM',
    completeCredits: 'Full credits & licenses',
  },
} as const

export function HyakkiExperience({ locale }: { locale: 'ja' | 'en' }) {
  const text = copy[locale]
  const [active, setActive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const [fullscreenError, setFullscreenError] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)
  const mobileLaunchRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!active || loaded) return
    const timeout = window.setTimeout(() => setSlow(true), 20000)
    return () => window.clearTimeout(timeout)
  }, [active, loaded])

  const launch = () => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    setLoaded(false)
    setSlow(false)
    setFullscreenError(false)
    setActive(true)
  }
  const close = () => {
    setActive(false)
    window.requestAnimationFrame(() => {
      if (window.matchMedia('(min-width: 1024px)').matches) launchRef.current?.focus()
      else mobileLaunchRef.current?.focus()
    })
  }
  const fullscreen = async () => {
    try {
      await frameRef.current?.requestFullscreen()
    } catch {
      setFullscreenError(true)
    }
  }

  return (
    <div className="hyakki-experience">
      <section className="hyakki-section" aria-labelledby="hyakki-video-title">
        <p className="hyakki-kicker">GAMEPLAY DIGEST / v0.6.0</p>
        <h2 id="hyakki-video-title">{text.videoTitle}</h2>
        <p className="hyakki-section__intro">{text.videoNote}</p>
        <video
          className="hyakki-video"
          controls
          playsInline
          preload="none"
          poster={hyakkiLantern.videoPoster}
          width={1440}
          height={900}
          aria-label={text.videoLabel}
          onError={() => setVideoError(true)}
        >
          <source src={hyakkiLantern.video} type="video/mp4" onError={() => setVideoError(true)} />
          <a href={hyakkiLantern.video}>{text.videoFallback}</a>
        </video>
        {videoError && <p role="status" className="hyakki-note">{text.videoError}</p>}
        <p className="hyakki-note">
          {locale === 'ja' ? '映像はゲームプレイを編集し、音声にフェード処理を加えています。' : 'Game footage is edited, with fades applied to the soundtrack.'}{' '}
          {text.bossMusic}: <a href="https://freesound.org/people/jobro/sounds/112248/" target="_blank" rel="noopener noreferrer">“Taiko drums” — jobro</a>{' '}
          (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>);{' '}
          <a href="https://opengameart.org/content/taiko-drums-seamless-loop" target="_blank" rel="noopener noreferrer">seamless edit: congusbongus</a>.
        </p>
        <a href="/assets/works/hyakki-lantern/CAPTURE-NOTES.txt" target="_blank" rel="noopener noreferrer" className="hyakki-inline-link">{text.videoCredits}<ArrowUpRightIcon className="h-4 w-4" /></a>
      </section>

      <section id="play" className="hyakki-section hyakki-play" aria-labelledby="hyakki-play-title">
        <p className="hyakki-kicker">PLAY THE DEMO / WEB · WINDOWS · macOS</p>
        <h2 id="hyakki-play-title">{text.playTitle}</h2>
        <p className="hyakki-section__intro">{text.playNote}</p>
        <div className="hyakki-play__stage">
          {active ? (
            <iframe
              ref={frameRef}
              src={hyakkiLantern.embedUrl}
              title={locale === 'ja' ? '百鬼灯市 無料体験版 — itch.io' : 'Hyakki Lantern City free demo — itch.io'}
              tabIndex={0}
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              onLoad={(event) => {
                setLoaded(true)
                // Wait for navigation to finish before focusing a cross-origin frame.
                event.currentTarget.focus({ preventScroll: true })
              }}
              onError={() => setSlow(true)}
            />
          ) : (
            <>
              <Image src="/assets/works/hyakki-lantern/gameplay-growth.webp" alt="" width={1440} height={900} sizes="(max-width: 1023px) 90vw, 1080px" className="hyakki-play__poster" />
              <div className="hyakki-play__launch">
                <span aria-hidden="true" className="hyakki-play__number">2048</span>
                <button ref={launchRef} type="button" onClick={launch} className="hyakki-play__button hyakki-desktop-only">{text.start}</button>
                <a ref={mobileLaunchRef} href={hyakkiLantern.itchUrl} target="_blank" rel="noopener noreferrer" className="hyakki-play__button hyakki-mobile-only">{text.external}<ArrowUpRightIcon className="h-4 w-4" /></a>
              </div>
            </>
          )}
        </div>
        <div className="hyakki-play__toolbar">
          {active && (
            <div className="hyakki-play__actions">
              <button type="button" onClick={close}>{text.stop}</button>
              <button type="button" onClick={fullscreen}>{text.fullscreen}</button>
            </div>
          )}
          <a href={hyakkiLantern.itchUrl} target="_blank" rel="noopener noreferrer" className="hyakki-inline-link">{text.external}<ArrowUpRightIcon className="h-4 w-4" /></a>
        </div>
        {active && <p className="hyakki-note">{text.closeNote}</p>}
        <p className="hyakki-note hyakki-desktop-only" role="status">
          {active ? (slow ? text.slow : loaded ? text.loaded : text.loading) : text.desktopNote}
        </p>
        {!active && <p className="hyakki-note hyakki-mobile-only">{text.mobileNote}</p>}
        {fullscreenError && <p className="hyakki-note" role="status">{text.fullscreenError}</p>}
        <h3 className="hyakki-controls__title">{text.controlsTitle}</h3>
        <ol className="hyakki-controls">
          {text.controls.map(([title, body], index) => (
            <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h4>{title}</h4><p>{body}</p></li>
          ))}
        </ol>
      </section>

    </div>
  )
}

export function HyakkiCredits({ locale }: { locale: 'ja' | 'en' }) {
  const text = copy[locale]
  return (
      <section className="hyakki-section hyakki-credits" aria-labelledby="hyakki-credits-title">
        <p className="hyakki-kicker">AI-ASSISTED CREATION / LICENSED MUSIC</p>
        <h2 id="hyakki-credits-title">{text.creditsTitle}</h2>
        <p className="hyakki-section__intro">{text.ai}</p>
        <dl>
          <div><dt>{text.normalMusic}</dt><dd><a href="https://opengameart.org/content/asianoriental1" target="_blank" rel="noopener noreferrer">“Asianoriental1” — Tozan</a><span><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0</a></span></dd></div>
          <div><dt>{text.bossMusic}</dt><dd><a href="https://freesound.org/people/jobro/sounds/112248/" target="_blank" rel="noopener noreferrer">“Taiko drums” — jobro</a><span><a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a> · <a href="https://opengameart.org/content/taiko-drums-seamless-loop" target="_blank" rel="noopener noreferrer">seamless edit: congusbongus</a></span></dd></div>
        </dl>
        <a className="hyakki-inline-link" href="https://html-classic.itch.zone/html/19580850/credits.html" target="_blank" rel="noopener noreferrer">{text.completeCredits}<ArrowUpRightIcon className="h-4 w-4" /></a>
      </section>
  )
}
