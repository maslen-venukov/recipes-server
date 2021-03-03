import Meal from '../models/Meal.js';

export const create = async (req, res) => {
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
}

export const getAll = async (req, res) => {
  try {
    const user = req.user.id;
    const meals = await Meal.find({ user }).sort({ _id: -1 });
    return res.json(meals);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}

export const remove = async (req, res) => {
  try {
    const _id = req.params.id;
    await Meal.deleteOne({ _id });
    return res.json({ message: 'Рецепт успешно удален' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}