import { app } from "../config/firebase.js"
import { getAuth } from "firebase-admin/auth"
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const {token: firebase_token} = req.body
    if(!firebase_token) {
      return res.status(400).json({
        message: `token not found!`
      })
    }

    const decoded = await getAuth(app).verifyIdToken(firebase_token)

    // this will update user if it exists and create user if it does not exist
    const user = await User.findOneAndUpdate(
      {firebase_uid: decoded.uid},
      {
        $set: {
          name: decoded.name,
          email: decoded.email,
          profile: decoded.picture
        },
        $setOnInsert: {firebase_uid: decoded.uid}
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    // generate jwt token
    const token = jwt.sign(
      {user_id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    )

    // store jwt in cookies for login autmatically for 7d
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7*24*60*60*1000
    })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({
      message: `login error: ${error}`
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7*24*60*60*1000
    })

    return res.status(200).json({
      message: `user logout successfully!`
    })
  } catch (error) {
    return res.status(500).json({
      message: `login error: ${error}`
    })
  }
}

export const get_me = async (req, res) => {
  try {
    const user = req.user
    return res.status(200).json(user)
  } catch (error) {
    return res.status(404).json({message: `get me error: ${error}`})
  }
}