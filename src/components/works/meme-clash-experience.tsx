'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { memeClashGame } from '@/content/meme-clash'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './please-sit-experience.css'
import './meme-clash.css'

export function MemeClashExperience({ locale }: { locale: 'ja' | 'en' }) {
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
    if (!memeClashGame.embedUrl) return
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
  const controls = [
    ['A / D', ja ? '左右に移動' : 'Move left / right'],
    ['S / W', ja ? '防御・下方向 / 上方向' : 'Guard & down / up direction'],
    ['J / K / L', ja ? '攻撃 / ジャンプ / 瞬歩' : 'Attack / jump / dash'],
    ['U / I', ja ? 'スキル / 必殺技（気100）' : 'Skill / super (100 energy)'],
    ['S + I', ja ? '大必殺技（気300）' : 'Ultimate (300 energy)'],
    ['O / Esc', ja ? '被ダメージ中の脱出 / 一時停止' : 'Escape while taking damage / pause'],
  ]
  const p2Controls = [
    ['← / →', ja ? '左右に移動' : 'Move left / right'],
    ['↓ / ↑', ja ? '防御・下方向 / 上方向' : 'Guard & down / up direction'],
    ['1 / 2 / 3', ja ? '攻撃 / ジャンプ / 瞬歩' : 'Attack / jump / dash'],
    ['4 / 5', ja ? 'スキル / 必殺技' : 'Skill / super'],
    ['↓ + 5', ja ? '大必殺技（気300）' : 'Ultimate (300 energy)'],
    ['6', ja ? '被ダメージ中の脱出' : 'Escape while taking damage'],
  ]
  const controlGroups: { title: string; rows: string[][] }[] = [
    { title: ja ? '1P：プレイヤー1' : '1P: Player one', rows: controls },
    { title: ja ? '2P：プレイヤー2' : '2P: Player two', rows: p2Controls },
  ]
  const beats = ja ? [
    ['7人から選ぶ。', 'ミーム猫、定時くん、クンチキン、トララレロ、蒼刃リオ、通知ちゃん、ウォジャック。CPU戦・ローカル対戦・トレーニングから始められます。'],
    ['一撃ずつ、つなぐ。', 'Jを一回ずつ押し直して通常連携。W・Sと攻撃やスキルを組み合わせると方向派生に。トレーニングの課題とゲーム内の技表で確認できます。'],
    ['大技で締める。', '気が300たまったらS＋Iで大必殺技。記号や書類が画面を彩ります。技の届く距離と、出した後の隙にも気を配ってください。'],
  ] : [
    ['Choose from seven.', 'Meme Cat, Teiji-kun, Kun Chicken, Tralalero, Rio, Notification-chan, and Wojak. Start with CPU battles, local versus, or training.'],
    ['Connect one hit at a time.', 'Press J again during an attack’s chaining window. Combine W or S with attacks and skills for directional moves. Training tasks and the in-game move guide explain the options.'],
    ['Finish with a super.', 'With 300 energy, S + I unleashes an ultimate. Punctuation and paperwork fill the fight. Watch your reach and the recovery time after the move.'],
  ]

  return (
    <div className="please-sit-experience meme-clash-experience">
      <section id="play" className="please-sit-section" aria-labelledby="meme-clash-play-title">
        <p className="please-sit-kicker">PLAY / IN DEVELOPMENT / v{memeClashGame.version}</p>
        <h2 id="meme-clash-play-title">{ja ? 'その「！」を、一撃に。' : 'Turn that “!” into an attack.'}</h2>
        <p className="please-sit-intro">{ja ? '日本語の無料体験版。PCとキーボードで遊んでください。初回は約500 MBを読み込むため、通信環境によって数分かかります。読み込み後、ゲーム画面をクリックして操作を始めます。' : 'A free demo with a Japanese interface. Use a desktop computer and keyboard. The initial download is about 500 MB and may take several minutes, depending on your connection. Click the game after loading to begin using the controls.'}</p>
        <div className="please-sit-player">
          {active ? (
            <iframe ref={frameRef} src={memeClashGame.embedUrl} title={ja ? 'ミーム大乱闘 v0.39.0 — itch.io' : 'MEME CLASH v0.39.0 — itch.io'} tabIndex={0} allow="autoplay; fullscreen; gamepad" allowFullScreen
              onLoad={(event) => { setLoaded(true); setSlow(false); event.currentTarget.focus({ preventScroll: true }) }} onError={() => setSlow(true)} />
          ) : (
            <>
              <Image src={memeClashGame.poster} alt="" width={1280} height={720} sizes="(max-width: 1023px) 90vw, 1050px" className="please-sit-player__poster" />
              <div className="please-sit-player__launch">
                {memeClashGame.embedUrl
                  ? <button ref={launchRef} type="button" onClick={launch} className="please-sit-button">{ja ? '体験版をはじめる' : 'Start the demo'}<span aria-hidden="true">→</span></button>
                  : <a href={memeClashGame.itchUrl} target="_blank" rel="noopener noreferrer" className="please-sit-button">{ja ? 'itch.ioで遊ぶ' : 'Play on itch.io'}<ArrowUpRightIcon className="h-4 w-4" /></a>}
              </div>
            </>
          )}
        </div>
        <div className="please-sit-player__toolbar">
          <div className="please-sit-player__actions">
            {active && <><button type="button" onClick={fullscreen}>{ja ? '全画面にする' : 'Fullscreen'}</button><button type="button" onClick={close}>{ja ? 'ゲームを閉じる' : 'Close game'}</button></>}
            <span>{ja ? 'ゲーム内 Esc：一時停止' : 'In game: Esc to pause'}</span>
          </div>
          <a href={memeClashGame.itchUrl} target="_blank" rel="noopener noreferrer" className="please-sit-link">{ja ? 'itch.ioで開く' : 'Open on itch.io'}<ArrowUpRightIcon className="h-4 w-4" /></a>
        </div>
        <p className="please-sit-note" role="status">{active
          ? slow ? (ja ? '読み込みに時間がかかっています。itch.ioから別のタブでもお試しください。' : 'Loading is taking longer than expected. Try opening the game on itch.io in a separate tab.')
            : loaded ? (ja ? 'ゲーム内の読み込みが終わったら開始できます。' : 'Start once the in-game loading has finished.')
              : (ja ? 'ゲームを読み込んでいます。' : 'Loading the game.')
          : (ja ? '開始するまでゲームは読み込みません。表示速度はブラウザと端末によって変わります。' : 'The game loads only after you start it. Performance varies by browser and device.')}</p>
        {fullscreenError && <p className="please-sit-note" role="status">{ja ? 'このブラウザでは全画面を開けませんでした。itch.ioのページからも遊べます。' : 'Fullscreen is unavailable in this browser. You can also play on the itch.io page.'}</p>}
        <ol className="please-sit-beats">{beats.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
      </section>
      <section className="please-sit-section" aria-labelledby="meme-clash-controls-title">
        <p className="please-sit-kicker">CONTROLS / KEYBOARD</p>
        <h2 id="meme-clash-controls-title">{ja ? '最初の一戦のために。' : 'For your first match.'}</h2>
        <p className="please-sit-intro">{ja ? '初期キー設定。W・↑は上方向の技に使い、ジャンプはK・2です。設定画面でキーを変更できます。2人対戦は同じPC・同じキーボードで遊びます。' : 'Default bindings. W and ↑ select upward moves; K and 2 are the jump keys. Bindings can be changed in settings. Local two-player mode shares one computer and keyboard.'}</p>
        <div className="meme-clash-controls">{controlGroups.map(({ title, rows }) => <div key={title}><h3>{title}</h3><dl>{rows.map(([key, action]) => <div key={key}><dt>{key}</dt><dd>{action}</dd></div>)}</dl></div>)}</div>
        <p className="please-sit-note">{ja ? 'トレーニングではRで位置をリセット、Tで練習相手の防御を切り替え。ホームではF1、対戦中はポーズメニューから操作・技のガイドを確認できます。技や脱出には使用条件があります。' : 'In training, R resets positions and T changes the practice opponent’s guard. Open the controls and move guide with F1 on the home screen, or through the pause menu during a match. Moves and escapes have their own usage conditions.'}</p>
      </section>
      <section className="please-sit-section please-sit-credits" aria-labelledby="meme-clash-credits-title">
        <p className="please-sit-kicker">MAKING & CREDITS</p>
        <h2 id="meme-clash-credits-title">{ja ? '制作について' : 'Making the game'}</h2>
        <dl>
          <div><dt>{ja ? '企画・制作' : 'Concept & production'}</dt><dd>王家進 / Kashin Ou</dd></div>
          <div><dt>{ja ? '開発支援' : 'Development assistance'}</dt><dd>Codex</dd></div>
          <div><dt>{ja ? 'エンジン' : 'Engine'}</dt><dd>Godot 4.7</dd></div>
          <div><dt>{ja ? 'コードの参考・移植元' : 'Source adapted from'}</dt><dd><a href="https://github.com/5DPLAY-Game-Studio/BleachVsNaruto" target="_blank" rel="noopener noreferrer" className="please-sit-link">5DPLAY / BleachVsNaruto</a> · GPL-3.0-or-later</dd></div>
        </dl>
        <p className="please-sit-note">{ja ? '制作中の体験版です。掲載画像はゲームの実機キャプチャ。実装と素材制作にAIによる支援を使用しています。' : 'This is an in-development demo. Images are actual game captures. AI assistance is used in implementation and asset production.'}</p>
      </section>
    </div>
  )
}
