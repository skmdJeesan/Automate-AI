import { HumanMessage } from "@langchain/core/messages"
import chat_graph from "../utils/chat_graph.js"
import Agent from "../models/agent.model.js"
import { create_agent_graph } from "../utils/agent_graph.js"

export const chat = async (req, res) => {
  try {
    const { message } = req.body
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        message: `message must be a non-empty string.`
      })
    }

    const thread_id = `temporary:${req.user._id}`
    // why thread_id is required? - for memory related work!
    const data = await chat_graph.invoke(
      { messages: [new HumanMessage(message.trim())] },
      { configurable: { thread_id } }
    )

    const last_message = data.messages[data.messages.length - 1].content
    return res.status(200).json({
      ai_response: last_message
    })
  } catch (error) {
    return res.status(500).json({
      message: `chat error: ${error}`
    })
  }
}

export const agent_chat = async (req, res) => {
  try {
    const { message, agent } = req.body
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        message: `message must be a non-empty string.`
      })
    }

    const agent_exist = await Agent.findOne({name: agent})
    if(!agent_exist) {
      return res.status(400).json({
        message: `agent does not exist!`
      })
    }

    const thread_id = `agent:${agent_exist._id}:${req.user._id}`
    // why thread_id is required? - for memory related work!

    const agent_graph = await create_agent_graph(agent_exist, req.user._id)
    const data = await agent_graph.invoke(
      { messages: [new HumanMessage(message.trim())] },
      { configurable: { thread_id } }
    )

    const last_message = data.messages[data.messages.length - 1].content
    return res.status(200).json({
      ai_response: last_message
    })
  } catch (error) {
    return res.status(500).json({
      message: `agent chat error: ${error}`
    })
  }
}