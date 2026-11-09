import mongoose from 'mongoose'

const agent_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  knowledge: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  tools: [
    {
      type: String,
      trim: true
    }
  ]
}, {timestamps: true})

const Agent = mongoose.model('Agent', agent_schema)
export default Agent