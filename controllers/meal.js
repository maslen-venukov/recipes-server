import axios from 'axios';

import Meal from '../models/Meal.js';
import User from '../models/User.js';
import parseMeal from '../utils/parseMeal.js';

export const getRandom = (req, res) => {
  try {
    axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(({ data }) => {
        const obj = data.meals[0];
        const meal = parseMeal(obj);
        return res.json(meal);
      })
      .catch(e => console.log(e))
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}

export const getLast = async (req, res) => {
  try {
    const meals = await Meal.find().sort({ _id: -1 }).limit(10);
    return res.json(meals);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    // try to get meal from mongodb
    try {
      const meal = await Meal.findById(id).exec();
      const user = await User.findById(meal.user).exec();
      return res.json({
        ...meal._doc,
        user: {
          id: user._id,
          login: user.login
        }
      })
    } catch {
      // get meal from public api
      axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(async ({ data }) => {
          const obj = data.meals[0];
          const meal = parseMeal(obj);
          return res.json(meal);
        })
        .catch(e => console.log(e))
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}