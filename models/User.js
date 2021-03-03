import mongoose from 'mongoose';

const { Schema, model, ObjectId } = mongoose;

const userSchema = new Schema({
  login: { type: String, require: true, unique: true },
  password: { type: String, require: true }
})

export default model('User', userSchema);