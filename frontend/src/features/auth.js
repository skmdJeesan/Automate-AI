import api from "@/lib/api.js"

export const login = async (token) => {
  const {data} = await api.post('/api/auth/login', {token})
  return data
}

export const logout = async () => {
  const {data} = await api.get('/api/auth/logout')
  return data
}

export const get_me = async () => {
  const {data} = await api.get('/api/auth/me')
  return data
}