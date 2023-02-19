import { aiGenerateText, configuration, openaiClient } from './util/openaiClient'
import {
  cardExamples,
  type CardGenerationResult,
  type CardInfo,
  type CardPrompt,
  withoutPreamble,
} from '../../model/CardInfo'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { type ErrorApiResponse } from './util/errorApiResponse'

import JSON5 from 'json5'

// =====================================================================================================================
// Message definitions

const messageHandlers = {
  async generateRandomPrompt () {
    return (await aiGenerateText({
      prompt: 'A short (3-10 word) description of a random magic card, such as "Blue flying creature", "Cave dwelling zombie"',
      maxTokens: 20
    }) ?? 'A confused AI').replace(/[^\w\s]/ig, '')
  },

  /**
   * Generate card info from a given prompt.
   */
  async generateCard (userPrompt: CardPrompt) {
    const promptText = `
    
    ${userPrompt.preamble}

${cardExamples.map(example => `\n\nPrompt: ${JSON.stringify(withoutPreamble(example.prompt), null, 2)}\nResult: ${JSON.stringify(example.result, null, 2)}`).join('')}

Prompt: ${JSON.stringify(withoutPreamble(userPrompt), null, 2)}
Result: `

    const resultText = await aiGenerateText({
      prompt: promptText,
      maxTokens: 2000,
    }) ?? ''

    console.info(resultText)

    const rawResult = JSON5.parse(resultText)

    return {
      userPrompt,
      promptText,
      resultText,
      resultCard: {
        cardName: rawResult.cardName ?? '',
        releaseYear: rawResult.releaseYear ?? '',
        manaCost: rawResult.manaCost ?? '',
        artDescription: rawResult.artDescription ?? '',
        cardSupertypes: rawResult.cardSupertypes ?? '',
        type: rawResult.type ?? '',
        subtypes: rawResult.subtypes ?? '',
        rarity: rawResult.rarity ?? '',
        rulesText: rawResult.rulesText ?? '',
        reminderText: rawResult.reminderText ?? '',
        flavorText: rawResult.flavorText ?? '',
        power: rawResult.power ?? 50,
        toughness: rawResult.toughness ?? 50,
        loyalty: rawResult.loyalty ?? '',
        artistName: rawResult.artistName ?? '',
        collectorsNumber: rawResult.collectorsNumber ?? 50,
        cardColors: rawResult.cardColors ?? '',
        cardBorder: rawResult.cardBorder ?? '',
      } satisfies CardInfo
    } satisfies CardGenerationResult
  },

  async generateImage (card: CardInfo) {
    const imageResponse = await openaiClient.createImage({
      prompt: `
      An illustration to be used on a ${card.cardColors.join(' and ')} magic the gathering card,
        with some corner vignetting
        with the subject centered and fully visible,
        matching this description: ${card.artDescription}
      `,
      n: 1,
      size: '512x512',
    })

    return imageResponse.data.data?.[0]?.url ?? null
  },
} as const

// =====================================================================================================================
// Message handler

export type MessageName = keyof typeof messageHandlers
export type MessagePayload<T extends MessageName> = Parameters<typeof messageHandlers[T]>
export type MessageResponse<T extends MessageName> = Awaited<ReturnType<typeof messageHandlers[T]>>
export interface MessageRequest<T extends MessageName> {
  name: T
  payload: MessagePayload<T>
}

export default async function (req: NextApiRequest, res: NextApiResponse<MessageResponse<MessageName> | ErrorApiResponse>) {
  if (configuration.apiKey == null) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      }
    })
    return
  }

  const request = req.body as MessageRequest<MessageName>
  const handler = messageHandlers[request.name]

  try {
    // @ts-expect-error: Generic response handling
    res.status(200).json(await handler(...request.payload))
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response != null) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${String(error.message)}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      })
    }
  }
}
