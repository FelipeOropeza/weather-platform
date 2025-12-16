import api from '@/api/api'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const { data } = await api.post('/api/login', payload)
  return data
}
