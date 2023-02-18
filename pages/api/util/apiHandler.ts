import { configuration } from './openai'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { type ErrorApiResponse } from './errorApiResponse'

export function apiHandler<TReq extends { '@response'?: object }> (
  handler: (req: TReq) => Promise<NonNullable<TReq['@response']> | ErrorApiResponse>
) {
  return async (req: NextApiRequest, res: NextApiResponse<NonNullable<TReq['@response']> | ErrorApiResponse>) => {
    if (configuration.apiKey == null) {
      res.status(500).json({
        error: {
          message: 'OpenAI API key not configured, please follow instructions in README.md',
        }
      })
      return
    }

    try {
      res.status(200).json(await handler(req.body as TReq))
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
}
