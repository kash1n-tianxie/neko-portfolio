'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { islandOutline } from './engine/island'
import { WORLD_DESTINATIONS, type WorldDestinationId, type WorldPosition } from './destinations'

export function WorldMap({ position, onTravel }: {
  position: WorldPosition
  onTravel: (id: WorldDestinationId) => void
}) {
  const t = useTranslations('world')
  const outline = useMemo(() => islandOutline().map((point, index) => `${index ? 'L' : 'M'}${point.x},${point.y}`).join(' ') + ' Z', [])

  return (
    <div className="world-map-layout">
      <div className="world-map-drawing">
        <svg viewBox="-29 -60 83 107" role="img" aria-label={t('mapDescription')}>
          <path d={outline} fill="#d1d7ba" stroke="#77836a" strokeWidth="0.65" />
          <path d="M0 32 L0 -38 M0 16 L-12 22 M0 16 L12 18 M-5 8 L5 8" fill="none" stroke="#f8f2e6" strokeWidth="1.4" strokeDasharray="1.4 1.1" />
          <ellipse cx="-12" cy="15" rx="6.4" ry="5" fill="#8cb5bd" />
          {WORLD_DESTINATIONS.map((destination) => {
            const landmark = destination.landmark ?? destination
            const featured = Boolean(destination.landmark)
            return (
              <g key={destination.id}>
                <circle cx={landmark.x} cy={landmark.z} r={featured ? 2.25 : 1.7} fill={featured ? '#c93a2b' : '#504d42'} stroke="#fff8e8" strokeWidth="0.65" />
                {featured && <text x={landmark.x} y={landmark.z + 0.7} textAnchor="middle" fill="white" fontSize="2" fontFamily="monospace">{destination.id === '2048' ? '01' : '02'}</text>}
              </g>
            )
          })}
          <g transform={`translate(${position.x} ${position.z}) rotate(${-position.heading * 180 / Math.PI})`}>
            <circle r="2.1" fill="#fff" stroke="#252720" strokeWidth="0.45" />
            <path d="M4 0 L-1.1 -1.2 L-1.1 1.2 Z" fill="#252720" />
          </g>
          <text x="44" y="-52" fontSize="3" fontFamily="monospace" fill="#5a6150" textAnchor="middle">N</text>
          <path d="M44 -49 L44 -43 M42 -47 L44 -49 L46 -47" stroke="#5a6150" strokeWidth="0.6" fill="none" />
        </svg>
        <span className="world-map-position"><i aria-hidden="true" />{t('mapYouAreHere')}</span>
      </div>
      <div className="world-destinations">
        <p>{t('mapTravelHint')}</p>
        {WORLD_DESTINATIONS.map((destination) => (
          <button type="button" key={destination.id} onClick={() => onTravel(destination.id)}>
            <span className="world-destination-number">{destination.id === '2048' ? '01' : destination.id === 'tamago-exe' ? '02' : '—'}</span>
            <span>{t(destination.labelKey)}</span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </div>
  )
}
