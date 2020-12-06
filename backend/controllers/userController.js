import User from '../models/userModel.js'

// Register a new user
// POST /api/users
// Public
const registerUser = async (req,res) => {
  const user = await User.create(req.body)

  if(user) {
    const token = await user.generateAuthToken()
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}


// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = async (req, res) => {
  const {email, password } = req.body
  const user = await User.findByCredentials(email, password)
  const token = await user.generateAuthToken()
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token
  })
}

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  res.send(req.user)
}



export { authUser, getUserProfile, registerUser }