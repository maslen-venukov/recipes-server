const { Schema, model, ObjectId } = require('mongoose');

const mealSchema = new Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  area: { type: String, required: true },
  tags: [{ type: String }],
  instructions: [{ type: String, required: true }],
  ingredients: [{ type: String, required: true }],
  measures: [{ type: String, required: true }],
  youtube: { type: String },
  source: { type: String },
  user: { type: ObjectId, ref: 'User' }
})

module.exports = model('Meal', mealSchema);