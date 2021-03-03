const { Router } = require('express');
const axios = require('axios');

const Meal = require('../models/Meal');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const parseMeal = require('../utils/parseMeal');

const router = Router();

// get random from mealdb
router.get('/random', (req, res) => {
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
})

// get own meal by authorized user
router.get('/own', authMiddleware, async (req, res) => {
  try {
    const user = req.user.id;
    const meals = await Meal.find({ user }).sort({ _id: -1 });
    return res.json(meals);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

// get last 10 meals
router.get('/last', async (req, res) => {
  try {
    const meals = await Meal.find().sort({ _id: -1 }).limit(10);
    return res.json(meals);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

// get meal by id
router.get('/:id', async (req, res) => {
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
})

// create meal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { img, name, category, area, tags, instructions, ingredients, measures, youtube, source } = req.body;
    const user = req.user.id;

    const meal = new Meal ({
      img,
      name,
      category,
      area,
      tags: tags || null,
      instructions,
      ingredients,
      measures,
      youtube: youtube || null,
      source: source || null,
      user
    })

    await meal.save();
    return res.json(meal);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

// remove meal
router.delete('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    await Meal.deleteOne({ _id });
    return res.json({ message: 'Рецепт успешно удален' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

module.exports = router;