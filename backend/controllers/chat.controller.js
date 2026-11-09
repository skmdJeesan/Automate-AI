import { HumanMessage } from "@langchain/core/messages"
import chat_graph from "../utils/chat_graph.js"

export const chat = async (req, res) => {
  try {
    const { message } = req.body
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        message: `message must be a non-empty string.`
      })
    }

    const thread_id = req.user._id.toString()
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