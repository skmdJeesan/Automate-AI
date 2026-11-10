import { MCPAdapter } from "@langchain/mcp-adapters";
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const file_name = fileURLToPath(import.meta.url)
const dir_name = path.dirname(file_name)
const server_path = path.join(dir_name, 'server.js')

// console.log(file_name)
// console.log(dir_name)

const adapter = new MCPAdapter({
  servers: {
    automate: { // automate is our mcp server name, it's optional
      transport: 'stdio',
      command: process.execPath,
      args: [server_path]
    }
  },
});

export const get_mcp_tools = async () => {
  const tools = await adapter.listTools()
  console.log(tools.map(tool => tool.name))
  return tools
}