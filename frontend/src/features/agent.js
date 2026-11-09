import api from "@/lib/api.js"

export const create_agent = async ({name, knowledge, instructions, tools}) => {
  const {data} = await api.post('/api/agent/create', {name, knowledge, instructions, tools})
  return data
}

export const get_all_agents = async () => {
  const {data} = await api.get('/api/agent/get/all')
  return data
}

export const get_agent = async (id) => {
  const {data} = await api.get(`/api/agent/get/${id}`)
  return data
}

export const delete_agent = async (id) => {
  const {data} = await api.delete(`/api/agent/del/${id}`)
  return data
}