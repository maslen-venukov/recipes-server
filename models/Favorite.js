import mongoose from 'mongoose';

const { Schema, model, ObjectId } = mongoose;

const favoriteSchema = new Schema({
  meal: { type: ObjectId, ref: 'Meal' },
  user: { type: ObjectId, ref: 'User' }
})

export default model('Favorite', favoriteSchema);