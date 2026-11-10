import { ChatGroq } from "@langchain/groq"
import { SystemMessage } from "@langchain/core/messages"
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { system_prompt } from "./prompts.js";
import dotenv from "dotenv";
import { get_mcp_tools } from "../mcp/langgraph-adapter.js";
dotenv.config()

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
})

const client = new MongoClient(process.env.MONGO_URI);
const checkpointer = new MongoDBSaver({ client, dbName: "chat_graph_db" });

export const create_agent_graph = async (agent, user_id) => {
  const available_tools = await get_mcp_tools()
  const selected_tools = new Set(agent.tools ?? [])
  
  const mcp_tools = available_tools.filter(tool =>
    selected_tools.has(tool.name) ||
    [...selected_tools].some(name => tool.name.endsWith(`_${name}`))
  )

  const approval_required_tools = new Set(['send_email', 'create_calender_event', 'publish_insta_image'])

  const llm_with_tools = llm.bindTools(mcp_tools)

  const chat_node = async (state) => {
    const recent_messages = state.messages.slice(-4)
    const response = await llm_with_tools.invoke(
      [new SystemMessage(system_prompt(agent)), ...recent_messages],
    )
    return { messages: [response] }
  }

  const tool_node = new ToolNode(mcp_tools)

  const action_approval_node = () => {}

  const route_after_chat = (state) => {
    const last_message = state.messages[state.messages.length - 1]
    if (!last_message.tool_calls?.length) return END
    const approval_requires = last_message?.tool_calls?.some((tool_call) => (
      approval_required_tools?.has(tool_call.name)
    ))

    return approval_requires ? 'action_approval_node' : 'tool_node'
  }

  // const route_after_approval = (state) => {

  // }


  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('chat_node', chat_node)
    .addNode('tool_node', tool_node)
    .addNode('action_approval_node', action_approval_node)
    .addEdge(START, 'chat_node')
    .addConditionalEdges('chat_node', route_after_chat)
    .addEdge('tool_node', 'chat_node')
    // .addConditionalEdges('action_approval_node', route_after_approval)

  const agent_graph = workflow.compile({ checkpointer })
  return agent_graph
}