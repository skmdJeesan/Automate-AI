import api from "@/lib/api.js"

export const chat = async (message) => {
  const {data} = await api.post(`/api/chat`, {message})
  return data
}

export const chat_with_agent = async (message, agent) => {
  const {data} = await api.post(`/api/chat/agent`, {message, agent})
  return data
}