import mongoose from 'mongoose'

const userTable = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
})

const User = mongoose.models.User || mongoose.model('User', userTable)

export default User
