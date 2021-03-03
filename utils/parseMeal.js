const parseMeal = obj => {
  const ingredients = Object.keys(obj).map(key => key.includes('Ingredient') && obj[key]).filter(ingredient => ingredient && ingredient.trim());
  const measures = Object.keys(obj).map(key => key.includes('Measure') && obj[key]).filter(measure => measure && measure.trim());
  const tags = obj.strTags && obj.strTags.split(',');
  const instructions = obj.strInstructions.split('\r\n');

  const { idMeal: id, strMeal: name, strCategory: category, strArea: area, strMealThumb: img, strYoutube: youtube, strSource: source } = obj;
  const meal = { id, name, category, area, instructions, img, tags, youtube, ingredients, measures, source };

  return meal;
}

module.exports = parseMeal;