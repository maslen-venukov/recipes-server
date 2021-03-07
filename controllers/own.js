import path from 'path';
import fs from 'fs';

import Meal from '../models/Meal.js';
import getFileName from '../utils/getFileName.js';
import parseTags from '../utils/parseTags.js'

export const create = async (req, res) => {
  try {
    const { name, area, category, tags, ingredients, measures, instructions, youtube, source } = req.body;
    const img = (req.files && req.files.img) || req.body.img;
    const user = req.user.id;

    const parsedTags = parseTags(tags);
    const parsedIngredients = JSON.parse(ingredients);
    const parsedMeasures = JSON.parse(measures);
    const parsedInstructions = JSON.parse(instructions);

    if(parsedIngredients.length <= 2)
      return res.status(400).json({ message: 'Добавьте как минимум 3 ингредиента' });

    if(parsedInstructions.length === 0)
      return res.status(400).json({ message: 'Необходимо описать хотя бы один шаг инструкции' });

    const fileName = getFileName(img);
    const filePath = fileName && path.resolve('static', fileName);
    filePath && img.mv(filePath);

    const meal = new Meal ({
      img: fileName || img,
      name,
      area,
      category,
      tags: parsedTags,
      ingredients: parsedIngredients,
      measures: parsedMeasures,
      instructions: parsedInstructions,
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

export const update = async (req, res) => {
  try {
    const { name, area, category, tags, ingredients, measures, instructions, youtube, source } = req.body;
    const img = (req.files && req.files.img) || req.body.img;
    const _id = req.params.id;
    const user = req.user.id;

    const mealFromDb = await Meal.findById(_id).exec();

    if(!mealFromDb)
      return res.status(404).json({ message: 'Рецепт не найден' });

    if(mealFromDb.user.toString() !== user)
      return res.status(400).json({ message: 'Недостаточно прав для изменения' });

    if(req.files || !mealFromDb.img.includes('http')) {
      try {
        fs.unlinkSync(`./static/${mealFromDb.img}`);
      } catch(e) {
        console.log(e);
      }
    }

    const parsedTags = parseTags(tags);
    const parsedIngredients = JSON.parse(ingredients);
    const parsedMeasures = JSON.parse(measures);
    const parsedInstructions = JSON.parse(instructions);

    if(parsedIngredients.length <= 2)
      return res.status(400).json({ message: 'Добавьте как минимум 3 ингредиента' });

    if(parsedInstructions.length === 0)
      return res.status(400).json({ message: 'Необходимо описать хотя бы один шаг инструкции' });

    const fileName = getFileName(img);
    const filePath = fileName && path.resolve('static', fileName);
    filePath && img.mv(filePath);

    const body = {
      img: fileName || img,
      name,
      area,
      category,
      tags: parsedTags,
      ingredients: parsedIngredients,
      measures: parsedMeasures,
      instructions: parsedInstructions,
      youtube: youtube || null,
      source: source || null,
    }

    const meal = await Meal.findByIdAndUpdate(
      { _id },
      { $set: body },
      { new: true }
    )

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
    const user = req.user.id;
    const meal = await Meal.findById(_id).exec();

    if(!meal)
      return res.status(404).json({ message: 'Рецепт не найден' });

    if(meal.user.toString() !== user)
      return res.status(400).json({ message: 'Недостаточно прав для удаления' });

    try {
      fs.unlinkSync(`./static/${meal.img}`);
    } catch (e) {
      console.log(e);
    } finally {
      await Meal.deleteOne({ _id });
      return res.json({ message: 'Рецепт успешно удален' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}