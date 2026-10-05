'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { tamagoGame } from '@/content/tamago'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './hyakki-experience.css'

export function TamagoExperience({ locale }: { locale: 'ja' | 'en' }) {
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
    if (!tamagoGame.embedUrl) return
    setLoaded(false)
    setSlow(false)
    setFullscreenError(false)
    setActive(true)
  }
  const close = () => {
    setActive(false)
    window.requestAnimationFrame(() => launchRef.current?.focus())
  }
  const fullscreen = async () => {
    try { await frameRef.current?.requestFullscreen() }
    catch { setFullscreenError(true) }
  }
  const controls = ja ? [
    ['残す', '食材をクリックして保留。引き直しは1関で2回を共有します。「たべる」で今の一皿を確定。'],
    ['入れ替える', '1皿につき1回、食材をドラッグして交換。ミルクやジャムの隣に何を置くかで連鎖が変わります。'],
    ['組み上げる', '4皿以内に目標へ。商店で10個の食材袋と4枠のカプセルを組み替え、9関の突破を目指します。'],
  ] : [
    ['Keep', 'Click foods to hold them. Share two rerolls across each gate, then press Eat to commit the plate.'],
    ['Swap', 'Drag two foods to swap them once per plate. A milk or jam neighbor changes which food triggers again.'],
    ['Build', 'Reach the target within four plates. Rebuild a ten-food bag and four capsule slots in the shop, aiming to clear all nine gates.'],
  ]

  return (
    <div className="hyakki-experience">
      <section id="play" className="hyakki-section hyakki-play" aria-labelledby="tamago-play-title">
        <p className="hyakki-kicker">TAMAGO.exe / PLAY v4</p>
        <h2 id="tamago-play-title">{ja ? 'この一皿で、竜を育てよう。' : 'Your next plate could change everything.'}</h2>
        <p className="hyakki-section__intro">{ja ? '日本語版をブラウザで遊べます。食材を残し、配置を変え、連鎖を組むゲームです。見やすいPC画面とマウスでのプレイをおすすめします。' : 'Play the Japanese-language browser version. Keep foods, change their positions, and build trigger combinations. A computer screen and mouse are recommended.'}</p>
        <div className="hyakki-play__stage" style={{ aspectRatio: '3 / 2' }}>
          {active ? (
            <iframe
              ref={frameRef}
              src={tamagoGame.embedUrl}
              title={ja ? 'TAMAGO.exe v4 日本語版' : 'TAMAGO.exe v4, Japanese game'}
              tabIndex={0}
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              onLoad={(event) => { setLoaded(true); event.currentTarget.focus({ preventScroll: true }) }}
              onError={() => setSlow(true)}
            />
          ) : (
            <>
              <Image src={tamagoGame.cover} alt="" width={1152} height={768} sizes="(max-width: 1023px) 90vw, 1080px" className="hyakki-play__poster" />
              <div className="hyakki-play__launch">
                <span aria-hidden="true" className="hyakki-play__number" style={{ fontSize: 'clamp(32px, 6vw, 70px)' }}>TAMAGO.exe</span>
                {tamagoGame.embedUrl ? <button ref={launchRef} type="button" onClick={launch} className="hyakki-play__button hyakki-desktop-only">{ja ? 'ここでゲームを起動' : 'Launch the game here'}</button> : <a href={tamagoGame.embedUrl} target="_blank" rel="noopener noreferrer" className="hyakki-play__button hyakki-desktop-only">{ja ? '新版を別タブで開く' : 'Open the new version'}</a>}
                <a href={tamagoGame.embedUrl} target="_blank" rel="noopener noreferrer" className="hyakki-play__button hyakki-mobile-only">{ja ? '新版を別タブで開く' : 'Open the new version'}<ArrowUpRightIcon className="h-4 w-4" /></a>
              </div>
            </>
          )}
        </div>
        <div className="hyakki-play__toolbar">
          {active && <div className="hyakki-play__actions"><button type="button" onClick={close}>{ja ? 'ゲームを閉じる' : 'Close game'}</button><button type="button" onClick={fullscreen}>{ja ? '全画面で遊ぶ' : 'Play fullscreen'}</button></div>}
          <a href={tamagoGame.embedUrl} target="_blank" rel="noopener noreferrer" className="hyakki-inline-link">{ja ? '新版を別タブで開く' : 'Open the new version in a new tab'}<ArrowUpRightIcon className="h-4 w-4" /></a>
        </div>
        <p className="hyakki-note" role="status">{active
          ? (slow ? (ja ? '読み込みに時間がかかっています。「新版を別タブで開く」からもお試しいただけます。' : 'Loading is taking longer than expected. Try opening the new version in a separate tab.') : loaded ? (ja ? 'ゲーム内の読み込み完了を待って開始してください。操作ごとに自動保存されます。ブラウザ設定により保存できない場合があります。' : 'Wait for the game to finish loading. Actions save automatically, subject to browser storage availability.') : (ja ? 'ゲームを読み込み中です。' : 'Loading the game.'))
          : (ja ? 'ゲームは起動ボタンを押してから読み込まれます。小さい画面では別のタブで開いてお試しください。' : 'The game loads only after launch. On smaller screens, open it in a separate tab.')}</p>
        {fullscreenError && <p className="hyakki-note" role="status">{ja ? '全画面にできませんでした。新版を別のタブでも遊べます。' : 'Fullscreen was unavailable. You can open the new version in a separate tab.'}</p>}
        <h3 className="hyakki-controls__title">{ja ? '3つの判断' : 'Three decisions'}</h3>
        <ol className="hyakki-controls">{controls.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h4>{title}</h4><p>{body}</p></li>)}</ol>
      </section>
      <section className="hyakki-section" aria-labelledby="tamago-design-title">
        <p className="hyakki-kicker">GAME DESIGN / 日本語 PDF</p>
        <h2 id="tamago-design-title">{ja ? '遊びの仕組みと、改善の考え方。' : 'The rules, and the thinking behind them.'}</h2>
        <p className="hyakki-section__intro">{ja ? '企画の狙い、基本ループ、食材とカプセルの組み合わせ、3段階の画面設計をまとめた企画書です。' : 'The Japanese design document covers the concept, core loop, food and capsule combinations, and three visual eras.'}</p>
        <a href={tamagoGame.designPdf} download className="cta">{ja ? '企画書をダウンロード（PDF）' : 'Download the design document (PDF, Japanese)'}<span aria-hidden="true">↓</span></a>
      </section>
      <section className="hyakki-section hyakki-credits" aria-labelledby="tamago-credits-title">
        <p className="hyakki-kicker">MAKING & CREDITS</p>
        <h2 id="tamago-credits-title">{ja ? '制作について' : 'Making the game'}</h2>
        <p className="hyakki-section__intro">{ja ? '企画・ゲームデザイン・ディレクション：王家進（Kashin Ou）。実装にAI支援を使用し、竜や筐体にはAI生成画像を使用しています。立体段階の竜は画像ベースのアニメーション、食材は3Dモデルです。掲載画像は実ゲームの画面キャプチャです。' : 'Concept, game design, and direction by Kashin Ou (王家進), with AI-assisted implementation and AI-generated dragon and cabinet art. The dimensional era combines an animated dragon image with 3D food models. All screenshots shown here were captured from the game.'}</p>
      </section>
    </div>
  )
}
