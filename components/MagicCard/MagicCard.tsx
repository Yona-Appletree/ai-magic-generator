import React from 'react'
import { type CardInfo } from '../../model/CardInfo'

interface MagicCardProps {
  card: CardInfo

  imageUrl: string | null
}

export function MagicCard (props: MagicCardProps) {
  const { rarity, name, cost, type, abilities, artist, flavorText, toughness } = props.card

  return (
    <div className="border-8 rounded-lg" style={{ width: 400 }}>
      <div className="bg-white shadow-md overflow-hidden">
        <div className="flex justify-between items-center bg-gray-600 text-white px-4 py-2 font-bold">
          <div>{name}</div>
          <div>{cost}</div>
        </div>

        <div>
          <img src={props.imageUrl ?? 'https://via.placeholder.com/400x290'} style={{
            objectFit: 'cover',
            width: 400,
            height: 290,
            objectPosition: 'top'
          }}></img>
        </div>

        <div className="flex justify-between items-center bg-gray-600 text-white px-4 py-2 font-bold">
          <div>{type}</div>
          <div>{rarity}</div>
        </div>

        <div className="px-4 py-2">
          <div style={{ whiteSpace: 'pre-wrap' }}
          >{abilities.replace(/<br>/gi, '\n\n')}</div>
          <div className="text-gray-600 italic mt-4 font-thin">{flavorText}</div>
          {/* <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div> */}
        </div>

        <div className="flex justify-between items-center bg-gray-600 text-white px-4 py-2 font-bold">
          <div>{artist}</div>
          <div>{toughness}</div>
        </div>
      </div>
    </div>
  )
};
