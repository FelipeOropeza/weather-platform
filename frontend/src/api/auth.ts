import api from '@/api/api'

export interface LoginPayload {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name?: string
}

export interface LoginResponse {
  access_token: string
  user: User
}


export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const { data } = await api.post('/api/login', payload)
  return data
}
