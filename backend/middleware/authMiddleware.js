import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protect = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
  const user = await User.findOne({ _id: decoded._id, }).select('-password')
  if(!user) {
    throw new Error('Authentication Error')
  }

  req.token = token
  req.user = user
  next()
}


export { protect }
//Validate token