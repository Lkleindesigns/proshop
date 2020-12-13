import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
}, {
  timestamps: true
})

userSchema.plugin(uniqueValidator)

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
  // user.tokens = user.tokens.concat({ token })
  // await user.save()
  return token
}

// userSchema.methods.matchPassword = async function(enteredPassword) {
//   const user = this
//   return await bcrypt.compare(enteredPassword, user.password)
// }

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if(!user) {
    throw new Error('Invalid Credentials')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch) {
    throw new Error('Invalid Credentials')
  }

  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const User = mongoose.model('User', userSchema)

export default User