import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  firebase_uid: {
    type: String,
    require: true,
    unique: true
  },
  name: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  profile: {
    type: String,
    default: ''
  }
}, {timestamps: true})

const User = mongoose.model('User', user_schema)
export default User