import type { MessageName, MessagePayload, MessageRequest, MessageResponse } from './generate'
import { isErrorResponse } from './util/errorApiResponse'

export const generateClient = new Proxy({}, {
  get: (target, name) => {
    return async (...request: any) => {
      if (typeof name !== 'string' || name.length === 0) {
        throw new Error(`Invalid name: ${String(name)}`)
      }

      return await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name as MessageName,
          payload: request,
        } satisfies MessageRequest<MessageName>),
      }).then(async (response) => {
        const body: any = await response.json()

        if (isErrorResponse(body)) {
          throw new Error(body.error.message)
        } else if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`)
        } else {
          return body
        }
      })
    }
  }
}) as {
  [K in MessageName]: (...params: MessagePayload<K>) => Promise<MessageResponse<K>>
}
