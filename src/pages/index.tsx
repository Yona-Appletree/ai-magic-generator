import Head from 'next/head'
import React, { type FormEvent, useState } from 'react'
import { MagicCard, placeholderImage } from '../components/MagicCard/MagicCard'
import styles from './index.module.scss'
import { type CardGenerationResult, type CardPrompt, cardRarities, emptyCard, emptyCardPrompt } from '../model/CardInfo'
import { generateClient } from './api/generateClient'
import { Loader, useLoadableState } from '../components/Loader/Loader'

const emptyGeneration: CardGenerationResult = {
  userPrompt: emptyCardPrompt,
  resultCard: emptyCard,
  promptText: '',
  resultText: ''
}

export default function Home () {
  const [cardPrompt, setCardPrompt] = useState(emptyCardPrompt)

  const [generatedCard, setGeneratedCard] = useLoadableState<CardGenerationResult>(emptyGeneration)
  const [imageUrl, setImageUrl] = useLoadableState<string | null>(placeholderImage)

  async function onSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await generateCard()
  }

  async function generateCard () {
    await setGeneratedCard(generateClient.generateCard(cardPrompt))
    await generateImage()
  }

  async function generateImage () {
    await setImageUrl(generateClient.generateImage((await generatedCard.promise).resultCard))
  }

  const updatePrompt = (update: Partial<CardPrompt>) => {
    setCardPrompt({
      ...cardPrompt,
      ...update
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Magic card generator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h1>Generate magic card</h1>
        <form onSubmit={onSubmit}>

          <label>Card theme</label>
          <input name="card-theme"
                 type="text"
                 value={cardPrompt.cardTheme}
                 onChange={e => { updatePrompt({ cardTheme: e.target.value }) }}
          />

          <label>Plane</label>
          <input name="card-theme"
                 type="text"
                 value={cardPrompt.plane}
                 onChange={e => { updatePrompt({ plane: e.target.value }) }}
          />

          <label>Release Year</label>
          <select name="release-year"
                  value={cardPrompt.releaseYear}
                  onChange={e => { updatePrompt({ releaseYear: e.target.value }) }}
          >
            {
              Array(40).fill(0)
                .map((_, i) => 1993 + i)
                .map(year => <option key={year} value={year}>{year}</option>)
            }
          </select>

          <label>Rarity</label>
          <select value={cardPrompt.rarity}
                  onChange={e => { updatePrompt({ rarity: e.target.value }) }} >
            {
              ['any', ...cardRarities].map(it => <option key={it} value={it}>{it}</option>)
            }
          </select>

          <label>Power Level</label>
          <input type="range"
                 min={0}
                 max={100}
                 step={1}
                 value={Math.round(cardPrompt.powerLevel)}
                 onChange={e => { updatePrompt({ powerLevel: parseFloat(e.target.value) }) }}/>

          <label>Complexity</label>
          <input type="range"
                 min={0}
                 max={100}
                 step={1}
                 value={Math.round(cardPrompt.complexity)}
                 onChange={e => { updatePrompt({ complexity: parseFloat(e.target.value) }) }}/>

          <input type="submit" value="Generate card" />
        </form>
        <div className={styles.result}>
          <Loader value={generatedCard} placeholder={emptyGeneration}>
            {value => <MagicCard card={value.resultCard}
                                 imageUrl={imageUrl}
            ></MagicCard>}
          </Loader>
        </div>
        <div>
          <button className={styles.btn} type="button" onClick={generateImage}>Regenerate image</button>
        </div>
      </main>

      <main>
        <h3 className="font-bold text-white">Preamble:</h3>
        <textarea cols={100} rows={15}
                  value={cardPrompt.preamble}
                  onChange={e => { updatePrompt({ preamble: e.target.value }) }}
                  className={styles.aiTextbox}
        />

        <h3 className="font-bold text-white">Prompt Text:</h3>
        <textarea cols={100} rows={15}
                  value={generatedCard.value?.promptText}
                  readOnly={true}
                  className={styles.aiTextbox}
        />

        <h3 className="font-bold text-white">Result Text:</h3>
        <textarea cols={100} rows={15}
                  value={generatedCard.value?.resultText}
                  readOnly={true}
                  className={styles.aiTextbox}
        />
      </main>
    </div>
  )
}
