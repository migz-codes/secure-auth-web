const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export interface IApiErrorBody {
  status: number
  message: string
  timestamp: string
  validationErrors?: string[]
}

export class ApiError extends Error {
  status: number
  validationErrors?: string[]

  constructor({ status, message, validationErrors }: Omit<IApiErrorBody, 'timestamp'>) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.validationErrors = validationErrors
  }
}

export const apiFetch = async <Data>(path: string, init?: RequestInit): Promise<Data> => {
  // Credentials live in httpOnly cookies set by the API, so every call has to
  // send them and CORS on the API side has to allow them.
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers }
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    // The API wraps every failure as { errors: [{ status, message, ... }] }.
    const error: Partial<IApiErrorBody> | undefined = body?.errors?.[0]

    throw new ApiError({
      status: error?.status ?? response.status,
      message: error?.message ?? 'Something went wrong. Try again.',
      validationErrors: error?.validationErrors
    })
  }

  return body as Data
}
