import React from 'react'
import { type CardInfo } from '../../model/CardInfo'
import { type LoadableValue, Loader } from '../Loader/Loader'
import { ManaCost, parseManaCost } from '../ManaCost/ManaCost'

export const placeholderImage = 'https://via.placeholder.com/512x512'

interface MagicCardProps {
  card: CardInfo

  imageUrl: LoadableValue<string | null>
}

export function MagicCard (props: MagicCardProps) {
  const { rarity, name, cost, type, abilities, artist, flavorText, toughness } = props.card

  return (
    <div className="border-8 rounded-lg relative" style={{ width: 400 }}>
      <div className="bg-white shadow-md overflow-hidden">
        <div className="flex justify-between items-center bg-gray-600 text-white px-4 py-2 font-bold">
          <div>{name}</div>
          <div>
            <ManaCost cost={parseManaCost(cost)}></ManaCost>
          </div>
        </div>

        <div>
          <Loader value={props.imageUrl} placeholder={placeholderImage}>
            {imageUrl => <img src={imageUrl} alt={props.card.imageDesc} width={400} height={400} style={{
              objectFit: 'fill',
              objectPosition: 'top'
            }} />}
          </Loader>
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
