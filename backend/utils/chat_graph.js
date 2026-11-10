import { ChatGroq } from "@langchain/groq"
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph'
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
const checkpointer = new MongoDBSaver({ client, dbName: "chat_graph_db" });

const chat_node = async (state) => {
  const recent_messages = state.messages.slice(-4)
  const response = await llm.invoke(recent_messages)
  return { messages: [response] }
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('chat_node', chat_node)
  .addEdge(START, 'chat_node')
  .addEdge('chat_node', END)

const chat_graph = workflow.compile({ checkpointer })

export default chat_graph