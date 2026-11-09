import Agent from "../models/agent.model.js"

export const create_agent = async (req, res) => {
  try {
    const user_id = req.user?._id
    const { name, knowledge, instructions, tools } = req.body
    if (!name || !knowledge || !instructions || !tools) {
      return res.status(400).json({
        message: `send all agent details!`
      })
    }

    const agent_exist = await Agent.findOne({name})
    if(agent_exist) {
      return res.status(400).json({
        message: `agent name must be unique!`
      })
    }

    const agent = await Agent.create({
      user_id, name, knowledge, instructions, tools
    })

    return res.status(201).json(agent)
  } catch (error) {
    return res.status(500).json({
      message: `create agent error: ${error}`
    })
  }
}

export const get_all_agents = async (req, res) => {
  try {
    // this is agents those are create by the user
    const user_id = req.user?._id
    const agents = await Agent.find({ user_id })
    return res.status(200).json(agents)
  } catch (error) {
    return res.status(500).json({
      message: `get all agent error: ${error}`
    })
  }
}

export const get_agent = async (req, res) => {
  try {
    // this is the agent whose id is in req.params
    const agent_id = req.params.id
    if (!agent_id) {
      return res.status(401).json({
        message: `agent_id is missing!`
      })
    }

    const agent = await Agent.findById(agent_id)
    return res.status(200).json(agent)
  } catch (error) {
    return res.status(500).json({
      message: `get agent error: ${error}`
    })
  }
}

export const delete_agent = async (req, res) => {
  try {
    const agent_id = req.params.id
    const user_id = req.user?._id
    const agent = await Agent.findOneAndDelete({ _id: agent_id, user_id })
    if (!agent) {
      return res.status(404).json({
        message: `agent not found!`
      })
    }
    return res.status(200).json({
      message: `agent deleted successfully!`
    })
  } catch (error) {
    return res.status(500).json({
      message: `delete agent error: ${error}`
    })
  }
}