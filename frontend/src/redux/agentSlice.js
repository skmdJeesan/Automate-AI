import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agents: null,
  selectedAgent: '',
  loading: false
}

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAgents: (state, action) => {
      state.agents = action.payload
    },

    setSelectedAgent: (state, action) => {
      state.selectedAgent = action.payload
    },

    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setDelete: (state, action) => {
      const id = action.payload
      state.agents = state.agents.filter((agent) => agent?._id !== id)
    }
  }
})

export const {setAgents, setSelectedAgent, setLoading, setDelete} = agentSlice.actions
export default agentSlice.reducer