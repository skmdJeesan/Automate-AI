import { ChatGroq } from "@langchain/groq"
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph'
import { RemoveMessage } from "@langchain/core/messages";
import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

import dotenv from "dotenv";
dotenv.config()

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
})

const client = new MongoClient(process.env.MONGO_URI);
const checkpointer = new MongoDBSaver({ client });

const chat_node = async (state) => {
  const invalidMessages = state.messages.filter(({ content }) => typeof content !== 'string')
  const messages = state.messages.filter(({ content }) => typeof content === 'string')
  const response = await llm.invoke(messages)

  return {
    messages: [
      ...invalidMessages
        .filter(({ id }) => id)
        .map(({ id }) => new RemoveMessage({ id })),
      response
    ]
  }
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('chat_node', chat_node)
  .addEdge('__start__', 'chat_node')
  .addEdge('chat_node', '__end__')

const chat_graph = workflow.compile({ checkpointer })

export default chat_graph