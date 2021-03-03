const { Router } = require('express');

const Favorite = require('../models/Favorite');
const Meal = require('../models/Meal');
const authMiddleware = require('../middlewares/auth');

const router = Router();

// add to favorites
router.post('/:id', authMiddleware, async (req, res) => {
  try {
    const meal = req.params.id;
    const user = req.user.id;

    const favorite = new Favorite({
      meal,
      user
    })

    await favorite.save();

    const { _id, img, name } = await Meal.findById(favorite.meal).exec();
    const data = {
      _id: favorite.id,
      meal: { _id, img, name }
    }

    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

// get all
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user.id;
    const favorites = await Favorite.find({ user });

    const data = await Promise.all(favorites.map(async favorite => {
      const { _id, img, name } = await Meal.findById(favorite.meal).exec();
      const meal = { _id, img, name };
      return { _id: favorite._id, meal };
    }))

    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

// remove
router.delete('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    await Favorite.deleteOne({ _id });
    return res.json({ message: 'Рецепт удален из избранного' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
})

module.exports = router;