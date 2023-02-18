import { openai } from './util/openai'
import { type CardInfo } from '../../model/CardInfo'
import { apiHandler } from './util/apiHandler'

export interface GenerateImageApiRequest {
  '@response'?: GenerateImageApiResponse

  card: CardInfo
}

export interface GenerateImageApiResponse {
  imageUrl: string | null
}

export default apiHandler<GenerateImageApiRequest>(async (request) => {
  const { card } = request
  const { color, imageDesc } = card

  const imageResponse = await openai.createImage({
    prompt: `An illustration to be used on a ${color} magic the gathering card, matching this description: ${imageDesc}`,
    n: 1,
    size: '512x512',
  })

  return {
    imageUrl: imageResponse.data.data?.[0]?.url ?? null
  }
})
