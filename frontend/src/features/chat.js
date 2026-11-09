import api from "@/lib/api.js"

export const chat = async (message) => {
  const {data} = await api.post(`/api/chat`, {message})
  return data
}