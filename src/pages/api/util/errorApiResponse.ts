export interface ErrorApiResponse {
  error: {
    message: string
  }
}

export function isErrorResponse (input: unknown): input is ErrorApiResponse {
  return typeof input === 'object' &&
        input != null &&
        'error' in input
}
