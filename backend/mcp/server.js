import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio, StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import dotenv from 'dotenv'
dotenv.config()

const server = new McpServer({
  name: 'automate-ai-mcp-server',
  version: '1.0.0'
})

const tavily_search_tool = process.env.TAVILY_API_KEY
  ? new TavilySearch({
    maxResults: 5,
    topic: "general",
  })
  : null

server.registerTool(
  'web_search',
  {
    description: 'search the web for current information, tutorial and news',
    inputSchema: z.object({ query: z.string() })
  },
  async ({ query }) => {
    if (!tavily_search_tool) {
      return {
        content: [{ type: 'text', text: 'Web search is unavailable because TAVILY_API_KEY is not configured.' }]
      }
    }

    try {
      const results = await tavily_search_tool.invoke(query)
      return { content: [{ type: 'text', text: JSON.stringify(results) }] }
    } catch (error) {
      console.error('web search failed:', error)
      return {
        content: [{ type: 'text', text: 'Web search failed. The search provider returned an error; no results are available.' }]
      }
    }
  }
)

const main = async () => {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error(`mcp server started successfully`)
}

main().catch((error) => {
  console.error(`mcp server error: ${error}`)
  process.exit(1)
})