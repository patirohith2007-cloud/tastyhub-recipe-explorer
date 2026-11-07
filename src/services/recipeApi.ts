import { INITIAL_RECIPES } from '../data/mockRecipes';
import { Recipe } from '../types/recipe';

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea?: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

// Convert TheMealDB meal into our structured Recipe model
export function parseMealDbMeal(meal: MealDbMeal): Recipe {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingName = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingName && ingName.trim().length > 0) {
      ingredients.push({
        id: `ing-${meal.idMeal}-${i}`,
        name: ingName.trim(),
        amount: measure && measure.trim().length > 0 ? measure.trim() : 'As required',
      });
    }
  }

  // Parse instructions into individual numbered steps
  const rawInstructions = meal.strInstructions || '';
  const steps = rawInstructions
    .split(/\r?\n|\r/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5 && !s.toLowerCase().startsWith('step'));

  const finalInstructions =
    steps.length > 0
      ? steps
      : [
          'Prepare all fresh ingredients and measuring tools.',
          'Follow traditional seasoning and heating steps.',
          'Cook until tender, well-infused, and cooked through.',
          'Garnish thoughtfully and serve fresh and hot.',
        ];

  // Estimate prep and cook times realistically based on category and steps
  const stepCount = finalInstructions.length;
  const isBaking = meal.strCategory?.toLowerCase() === 'dessert';
  const prepTime = Math.min(30, Math.max(10, stepCount * 3));
  const cookTime = isBaking ? 35 : Math.min(45, Math.max(15, stepCount * 4));

  // Determine difficulty
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
  if (ingredients.length > 8 || stepCount > 6) difficulty = 'Medium';
  if (ingredients.length > 12 || stepCount > 9) difficulty = 'Hard';

  // Description preview
  const description =
    finalInstructions[0]?.slice(0, 160) ||
    `A classic ${meal.strArea || ''} ${meal.strCategory || 'dish'} bursting with rich flavors and fresh ingredients.`;

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    description: description.endsWith('.') ? description : `${description}...`,
    category: meal.strCategory || 'General',
    area: meal.strArea || 'International',
    imageUrl: meal.strMealThumb,
    prepTime,
    cookTime,
    servings: 4,
    ingredients,
    instructions: finalInstructions,
    isUserCreated: false,
    tags: meal.strTags ? meal.strTags.split(',').map((t) => t.trim()) : [meal.strCategory || 'Food'],
    youtubeUrl: meal.strYoutube,
    difficulty,
  };
}

export const recipeApiService = {
  /**
   * Fetch recipe details by ID from TheMealDB lookup endpoint
   */
  async fetchRecipeById(id: string): Promise<Recipe | null> {
    // Check initial curated recipes first
    const foundInitial = INITIAL_RECIPES.find((r) => r.id === id);
    if (foundInitial) return foundInitial;

    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.meals && data.meals[0]) {
        return parseMealDbMeal(data.meals[0]);
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch recipes from public TheMealDB API with fallback and error simulation
   */
  async fetchRecipes(searchQuery = '', category = 'All', forceFail = false): Promise<Recipe[]> {
    if (forceFail) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      throw new Error('Connection refused: Unable to reach recipe server. Please check your network and retry.');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      if (searchQuery.trim().length > 0) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery.trim())}`;
      } else if (category && category !== 'All' && category !== 'User Created') {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Recipe API responded with status ${response.status}`);
      }

      const data = await response.json();
      let fetchedRecipes: Recipe[] = [];

      if (data && data.meals && Array.isArray(data.meals)) {
        fetchedRecipes = data.meals.map((m: MealDbMeal) => parseMealDbMeal(m));
      }

      // If category filter was used, filter our curated initial dataset as well
      const categoryInitials =
        category === 'All'
          ? INITIAL_RECIPES
          : INITIAL_RECIPES.filter((r) => r.category.toLowerCase() === category.toLowerCase());

      if (fetchedRecipes.length === 0 && searchQuery.trim().length === 0) {
        return categoryInitials;
      }

      // Combine with initial curated recipes for rich experience
      const existingIds = new Set(fetchedRecipes.map((r) => r.name.toLowerCase()));
      const uniqueInitials = categoryInitials.filter((r) => !existingIds.has(r.name.toLowerCase()));
      return [...uniqueInitials, ...fetchedRecipes];
    } catch (err: unknown) {
      console.warn('TheMealDB API offline or unavailable, using curated local recipe dataset:', err);

      // If specific search, filter initial recipes
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return INITIAL_RECIPES.filter(
          (r) =>
            r.name.toLowerCase().includes(query) ||
            r.description.toLowerCase().includes(query) ||
            r.category.toLowerCase().includes(query) ||
            r.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
        );
      }

      if (category !== 'All') {
        return INITIAL_RECIPES.filter((r) => r.category.toLowerCase() === category.toLowerCase());
      }

      return INITIAL_RECIPES;
    }
  },
};
