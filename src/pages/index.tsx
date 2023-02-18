import Head from 'next/head'
import React, { type FormEvent, useEffect } from 'react'
import { MagicCard, placeholderImage } from '../components/MagicCard/MagicCard'
import styles from './index.module.scss'
import { type CardInfo, emptyCard, loadingCard } from '../model/CardInfo'
import { generateClient } from './api/generateClient'
import { Loader, useLoadableState } from '../components/Loader/Loader'

export default function Home () {
  const [cardPrompt, setCardPrompt] = useLoadableState('')

  const [generatedCard, setGeneratedCard] = useLoadableState<CardInfo>(emptyCard)
  const [imageUrl, setImageUrl] = useLoadableState<string | null>(placeholderImage)

  async function onSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await setGeneratedCard(generateClient.generateCard(await cardPrompt.promise))
    await generateImage()
  }

  async function generateImage () {
    await setImageUrl(generateClient.generateImage(await generatedCard.promise))
  }

  useEffect(() => {
    setCardPrompt(generateClient.generateRandomPrompt()).finally(() => {})
  }, [])

  return (
    <div>
      <Head>
        <title>Magic card generator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Generate magic card</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="cardDesc"
            placeholder="Describe it"
            value={cardPrompt.value ?? ''}
            onChange={(e) => { setCardPrompt(Promise.resolve(e.target.value)) }}
          />
          <input type="submit" value="Generate card" />
        </form>
        <div className={styles.result}>
          <Loader value={generatedCard} placeholder={loadingCard}>
            {value => <MagicCard card={value}
                                 imageUrl={imageUrl}
            ></MagicCard>}
          </Loader>
        </div>
        <div>
          <button className={styles.btn} type="button" onClick={generateImage}>Regenerate image</button>
        </div>
      </main>
    </div>
  )
}
