import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if(!token) return res.status(404).json({message: `unauthorized!`})
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.user_id)
    if(!user) return res.status(404).json({message: `user not found!`})
    req.user = user
    next()
  } catch (error) {
    return res.status(404).json({message: `protect error: ${error}`})
  }
}

export default protect