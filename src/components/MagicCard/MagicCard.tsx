import React from 'react'
import { type CardInfo } from '../../model/CardInfo'
import { type LoadableValue, Loader } from '../Loader/Loader'
import { colorToBgClassRecord, ManaCost } from '../ManaCost/ManaCost'

export const placeholderImage = 'https://via.placeholder.com/512x512'

interface MagicCardProps {
  card: CardInfo

  imageUrl: LoadableValue<string | null>
}

export function MagicCard (props: MagicCardProps) {
  const card = props.card

  return (
    <div className={[
      'rounded-lg',
      colorToBgClassRecord[props.card.cardBorder]?.border,
      colorToBgClassRecord[props.card.cardBorder]?.bg,
    ].join(' ')} style={{ width: 400, borderWidth: '20px' }}>
      <div className="flex justify-between items-center bg-gray-600 bg-opacity-40 text-white px-4 py-2 font-bold">
        <div>{card.cardName}</div>
        <div>
          <ManaCost cost={card.manaCost} />
        </div>
      </div>

      <div>
        <Loader value={props.imageUrl} placeholder={placeholderImage}>
          {imageUrl => <img src={imageUrl} alt={props.card.artDescription} style={{
            objectFit: 'fill',
            objectPosition: 'top',
            width: 400,
            height: 290
          }} />}
        </Loader>
      </div>

      <div className="flex justify-between items-center bg-gray-600 bg-opacity-40 text-white px-4 py-2 font-bold">
        <div>{card.subtypes.length > 0 ? `${card.subtypes} - ` : ''}{card.type}</div>
        <div>{card.rarity}</div>
      </div>

      <div className="px-4 py-2 bg-gray-100 bg-opacity-70 flex-1">
        {card.rulesText.map((it, i) => <div key={i} className="text-gray-900 mt-4 font-normal">{it}</div>)}
        <div className="text-gray-900 mt-4 font-normal">{card.reminderText}</div>

        <div className="text-gray-600 italic mt-4 font-thin">{card.flavorText}</div>
        {/* <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div> */}
      </div>

      <div className="flex justify-between items-center bg-gray-600 bg-opacity-40 text-white px-4 py-2 font-bold">
        <div>{card.artistName}</div>
        {card.power.length > 0 && card.toughness.length > 0 && <div>{card.power} / {card.toughness}</div>}
      </div>
    </div>
  )
};
