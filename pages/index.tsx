import Head from 'next/head'
import React, { type FormEvent, useState } from 'react'
import { MagicCard } from '../components/MagicCard/MagicCard'
import { type ErrorApiResponse, isErrorResponse } from './api/util/errorApiResponse'
import styles from './index.module.scss'
import { type GenerateCardApiRequest } from './api/generateCard'
import { type CardInfo, emptyCard } from '../model/CardInfo'
import { type GenerateImageApiRequest } from './api/generateImage'

export default function Home () {
  const [cardDesc, setCardDesc] = useState('')
  const [result, setResult] = useState<CardInfo>(emptyCard)

  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  async function request<TReq extends { '@response'?: object }> (
    path: string,
    request: TReq
  ): Promise<NonNullable<TReq['@response']>> {
    return await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }).then(async (response) => {
      const body: NonNullable<TReq['@response']> | ErrorApiResponse = await response.json()

      if (isErrorResponse(body)) {
        throw new Error(body.error.message)
      } else if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`)
      } else {
        return body
      }
    })
  }

  async function handleError (error: any) {
    if (error instanceof Error) {
      setError(error.message)
    } else {
      setError(String(error))
    }
  }

  async function onSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setResult(emptyCard)
    setImageUrl(null)

    request<GenerateCardApiRequest>('/api/generateCard', { cardDesc }).then(
      async response => {
        setResult(response.card)
        await generateImage()
      }
    ).catch(handleError)
  }

  async function generateImage () {
    request<GenerateImageApiRequest>('/api/generateImage', { card: result }).then(
      response => { setImageUrl(response.imageUrl) },
      handleError
    )
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Generate magic card</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="cardDesc"
            placeholder="Describe it"
            value={cardDesc}
            onChange={(e) => { setCardDesc(e.target.value) }}
          />
          <input type="submit" value="Generate card" />

          {error != null && <div className="text-red-600 pt-2">
            {error}
          </div>}
        </form>
        <div className={styles.result}>
          {result != null && <MagicCard card={result} imageUrl={imageUrl}></MagicCard>}
        </div>
        <div>
          <button className={styles.btn} type="button" onClick={generateImage}>Regenerate image</button>
        </div>
      </main>
    </div>
  )
}
