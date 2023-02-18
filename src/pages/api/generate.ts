import { aiGenerateText, configuration, openaiClient } from './util/openaiClient'
import { type CardInfo } from '../../model/CardInfo'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { type ErrorApiResponse } from './util/errorApiResponse'

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
  async generateCard (cardDesc: string) {
    const outputText = await aiGenerateText({
      prompt: generatePrompt(cardDesc),
      maxTokens: 2000,
    }) ?? ''

    const outputFields: Array<readonly [string, string | null]> = outputText
      .split('\n')
      .map(it => it.match(/\s*(.*?)\s*:\s*(.*)/))
      .flatMap(it => it == null ? [] : [[it[1], it[2] ?? null]] as const)
      .filter(it => it.length)

    const field = (name: string) => (outputFields.find(it => it[0].toLowerCase().includes(name))?.[1] ?? '')

    console.info(outputText)

    return {
      rarity: field('rarity'),
      color: field('color'),
      name: field('name'),
      cost: field('cost'),
      type: field('type'),
      abilities: field('abilities'),
      flavorText: field('flavor'),
      toughness: field('toughness'),
      imageDesc: field('image'),
      artist: field('artist'),
    } satisfies CardInfo
  },

  async generateImage (card: CardInfo) {
    const { color, imageDesc } = card

    const imageResponse = await openaiClient.createImage({
      prompt: `
      An illustration to be used on a ${color} magic the gathering card,
        with some corner vignetting
        with the subject centered and fully visible,
        matching this description: ${imageDesc}
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

function generatePrompt (cardDesc: string): string {
  return `Describe a magic the gathering card, based on the theme, including rarity, color, name, cost, abilities, flavor text, toughness, image

  Prompt: Legendary black and green creature
  
  Rarity: Legendary
  Color: black, green
  Name: Ghave, Guru of Spores
  Cost: 1 colorless, 1 white
  Type: Legendary Creature — Fungus Shaman
  Abilities: Ghave, Guru of Spores enters the battlefield with five +1/+1 counters on it.<br>(1 colorless), Remove a +1/+1 counter from a creature you control: Create a 1/1 green Saproling creature token.<br>(1 colorless), Sacrifice a creature: Put a +1/+1 counter on target creature.
  Flavor Text: 
  Toughness: 0/0
  Image: A dark green monster with glowing eyes in a foggy forest
  Artist: James Paick

  Prompt: Dual color creature
  
  Rarity: rare
  Color: green, blue
  Name: Nimbus Swimmer
  Cost: X, 1 green, 1 blue
  Type: Creature — Leviathan
  Abilities: Flying<br>Nimbus Swimmer enters the battlefield with X +1/+1 counters on it.
  Flavor Text: The Simic soon discovered that the sky offered as few constraints on size as the sea.
  Toughness: 0/0
  Image: A green sea creature with a wide body, underwater
  Artist: Howard Lyon

  Prompt: Black creature
  
  Rarity: rare
  Color: black
  Name: Stronghold Assassin
  Cost: 1 colorless, 2 black
  Type: Creature — Zombie Assassin
  Abilities: (tap), Sacrifice a creature: Destroy target nonblack creature.
  Flavor Text: The assassin sees only throats and hears only heartbeats.
  Toughness: 2/1
  Image: A mutant humanoid with a deformed face and mask hold an eletric staff, another human being tortured with a tube in it's mouth
  Artist: Matthew D. Wilson

  Prompt: ${cardDesc}`
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
