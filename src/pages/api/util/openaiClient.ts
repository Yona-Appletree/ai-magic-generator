import { Configuration, OpenAIApi } from 'openai'

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
export const openaiClient = new OpenAIApi(configuration)

export async function aiGenerateText (params: {
  prompt: string
  maxTokens: number
}): Promise<string | null> {
  const result = await openaiClient.createCompletion({
    model: 'text-davinci-003',
    prompt: params.prompt,
    temperature: 0.6,
    max_tokens: params.maxTokens,
    presence_penalty: 1,
    best_of: 1
  }).then(it => it.data.choices[0].text ?? null)

  return result
}
