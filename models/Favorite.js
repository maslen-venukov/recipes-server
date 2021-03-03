const { Schema, model, ObjectId } = require('mongoose');

const favoriteSchema = new Schema({
  meal: { type: ObjectId, ref: 'Meal' },
  user: { type: ObjectId, ref: 'User' }
})

module.exports = model('Favorite', favoriteSchema);