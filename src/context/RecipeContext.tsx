import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Recipe, ViewState, ScreenType, ShoppingListItem } from '../types/recipe';
import { recipeApiService } from '../services/recipeApi';
import { storageService } from '../services/storage';
import { INITIAL_RECIPES } from '../data/mockRecipes';

export type SortOption = 'recommended' | 'time' | 'alphabetical' | 'ingredients';

interface RecipeContextType {
  recipes: Recipe[];
  favorites: Recipe[];
  userRecipes: Recipe[];
  currentRecipe: Recipe | null;
  editingRecipe: Recipe | null;
  currentScreen: ScreenType;
  viewState: ViewState;
  errorMessage: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortOption;
  maxPrepTimeFilter: number; // 0 = all
  isSimulatedError: boolean;
  toastMessage: string | null;
  shoppingList: ShoppingListItem[];

  // Actions modeling Flutter ChangeNotifier methods
  setCurrentScreen: (screen: ScreenType) => void;
  openRecipeDetail: (recipe: Recipe) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: SortOption) => void;
  setMaxPrepTimeFilter: (mins: number) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  addRecipe: (recipeData: Omit<Recipe, 'id' | 'isUserCreated' | 'createdAt'>) => Recipe;
  updateRecipe: (recipe: Recipe) => void;
  deleteUserRecipe: (recipeId: string) => void;
  duplicateRecipe: (recipe: Recipe) => void;
  startEditingRecipe: (recipe: Recipe) => void;
  fetchRecipes: (forceFail?: boolean) => Promise<void>;
  retryFetch: () => void;
  toggleSimulatedError: () => void;
  showToast: (msg: string) => void;

  // Shopping List Actions
  addToShoppingList: (ingredients: Array<{ id: string; name: string; amount: string }>, recipeName?: string) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [maxPrepTimeFilter, setMaxPrepTimeFilter] = useState<number>(0);
  const [isSimulatedError, setIsSimulatedError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize stored favorites, shopping list & user recipes on launch
  useEffect(() => {
    const savedFavorites = storageService.getFavoriteIds();
    const savedUserRecipes = storageService.getUserRecipes();
    const savedShoppingList = storageService.getShoppingList();
    setFavoriteIds(savedFavorites);
    setUserRecipes(savedUserRecipes);
    setShoppingList(savedShoppingList);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Main data loader supporting the 4 mandatory states: Loading, Error, Empty, Data
  const loadRecipesData = async (forceFail = false) => {
    setViewState('loading');
    setErrorMessage(null);

    try {
      const fetched = await recipeApiService.fetchRecipes(
        searchQuery,
        selectedCategory,
        forceFail || isSimulatedError
      );

      const localUserRecipes = storageService.getUserRecipes();
      setUserRecipes(localUserRecipes);

      // Merge user-created recipes with external API recipes
      let combined: Recipe[] = [...localUserRecipes, ...fetched];

      // Filter by category if selected
      if (selectedCategory && selectedCategory !== 'All') {
        if (selectedCategory === 'User Created') {
          combined = combined.filter((r) => r.isUserCreated);
        } else {
          combined = combined.filter(
            (r) => r.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
      }

      // Filter by search query if present
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        combined = combined.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
        );
      }

      // Filter by prep time if set
      if (maxPrepTimeFilter > 0) {
        combined = combined.filter((r) => r.prepTime <= maxPrepTimeFilter);
      }

      // Apply sorting
      if (sortBy === 'time') {
        combined.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime));
      } else if (sortBy === 'alphabetical') {
        combined.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'ingredients') {
        combined.sort((a, b) => a.ingredients.length - b.ingredients.length);
      }

      setRecipes(combined);

      // Determine view state
      if (combined.length === 0) {
        setViewState('empty');
      } else {
        setViewState('data');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to recipe services. Please check your connection and retry.';
      setErrorMessage(message);
      setViewState('error');
    }
  };

  // Trigger recipe fetch on filter / search / sort changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRecipesData();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy, maxPrepTimeFilter, isSimulatedError]);

  // Retry action for Error State
  const retryFetch = () => {
    setIsSimulatedError(false);
    loadRecipesData(false);
  };

  const toggleSimulatedError = () => {
    const nextVal = !isSimulatedError;
    setIsSimulatedError(nextVal);
    loadRecipesData(nextVal);
  };

  // Toggle favorite
  const toggleFavorite = (recipeId: string) => {
    const isNowFav = storageService.toggleFavoriteId(recipeId);
    const updatedFavIds = storageService.getFavoriteIds();
    setFavoriteIds(updatedFavIds);

    const recipe =
      recipes.find((r) => r.id === recipeId) ||
      INITIAL_RECIPES.find((r) => r.id === recipeId);

    const name = recipe ? recipe.name : 'Recipe';
    if (isNowFav) {
      showToast(`Added "${name}" to Favourites ❤️`);
    } else {
      showToast(`Removed "${name}" from Favourites`);
    }

    if (currentRecipe && currentRecipe.id === recipeId) {
      setCurrentRecipe({ ...currentRecipe, isFavorite: isNowFav });
    }
  };

  const isFavorite = (recipeId: string) => favoriteIds.includes(recipeId);

  // Add personal recipe
  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'isUserCreated' | 'createdAt'>): Recipe => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isUserCreated: true,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    storageService.saveUserRecipe(newRecipe);

    const updatedUserRecipes = storageService.getUserRecipes();
    setUserRecipes(updatedUserRecipes);
    setRecipes((prev) => [newRecipe, ...prev]);
    setViewState('data');

    showToast(`"${newRecipe.name}" successfully published! 🎉`);
    return newRecipe;
  };

  // Update existing recipe
  const updateRecipe = (updated: Recipe) => {
    storageService.updateUserRecipe(updated);
    const updatedUserRecipes = storageService.getUserRecipes();
    setUserRecipes(updatedUserRecipes);
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (currentRecipe && currentRecipe.id === updated.id) {
      setCurrentRecipe(updated);
    }
    setEditingRecipe(null);
    showToast(`"${updated.name}" updated successfully! ✨`);
    setCurrentScreen('detail');
  };

  // Delete user recipe
  const deleteUserRecipe = (recipeId: string) => {
    storageService.deleteUserRecipe(recipeId);
    const updatedUserRecipes = storageService.getUserRecipes();
    setUserRecipes(updatedUserRecipes);
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    if (favoriteIds.includes(recipeId)) {
      toggleFavorite(recipeId);
    }
    showToast('Recipe deleted successfully');
    if (currentScreen === 'detail') {
      setCurrentScreen('home');
    }
  };

  // Duplicate recipe to personalize
  const duplicateRecipe = (source: Recipe) => {
    const clone: Recipe = {
      ...source,
      id: `user-clone-${Date.now()}`,
      name: `${source.name} (My Variation)`,
      isUserCreated: true,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    setEditingRecipe(clone);
    setCurrentScreen('edit');
    showToast(`Created customizable copy of "${source.name}"!`);
  };

  // Start editing a recipe
  const startEditingRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setCurrentScreen('edit');
  };

  // Open recipe detail view with deep fetch if missing instructions/ingredients
  const openRecipeDetail = async (recipe: Recipe) => {
    // If ingredients are empty or standard placeholder, attempt deep fetch
    if (recipe.ingredients.length === 0 || !recipe.instructions.length) {
      const detailed = await recipeApiService.fetchRecipeById(recipe.id);
      if (detailed) {
        recipe = { ...detailed, isFavorite: isFavorite(recipe.id) };
      }
    }

    setCurrentRecipe({
      ...recipe,
      isFavorite: isFavorite(recipe.id),
    });
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Shopping List methods ---
  const addToShoppingList = (
    ingredients: Array<{ id: string; name: string; amount: string }>,
    recipeName?: string
  ) => {
    storageService.addIngredientsToShoppingList(ingredients, recipeName);
    const updated = storageService.getShoppingList();
    setShoppingList(updated);
    showToast(`Added ${ingredients.length} items to your Shopping List! 🛒`);
  };

  const toggleShoppingItem = (id: string) => {
    const updated = shoppingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    storageService.saveShoppingList(updated);
  };

  const removeShoppingItem = (id: string) => {
    const updated = shoppingList.filter((item) => item.id !== id);
    setShoppingList(updated);
    storageService.saveShoppingList(updated);
  };

  const clearShoppingList = () => {
    storageService.saveShoppingList([]);
    setShoppingList([]);
    showToast('Shopping list cleared.');
  };

  // Computed favorites list
  const favorites = useMemo(() => {
    const all = [...userRecipes, ...recipes, ...INITIAL_RECIPES];
    const uniqueMap = new Map<string, Recipe>();
    all.forEach((r) => {
      if (!uniqueMap.has(r.id)) {
        uniqueMap.set(r.id, r);
      }
    });

    return favoriteIds
      .map((id) => uniqueMap.get(id))
      .filter((r): r is Recipe => Boolean(r));
  }, [favoriteIds, recipes, userRecipes]);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favorites,
        userRecipes,
        currentRecipe,
        editingRecipe,
        currentScreen,
        viewState,
        errorMessage,
        searchQuery,
        selectedCategory,
        sortBy,
        maxPrepTimeFilter,
        isSimulatedError,
        toastMessage,
        shoppingList,
        setCurrentScreen,
        openRecipeDetail,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        setMaxPrepTimeFilter,
        toggleFavorite,
        isFavorite,
        addRecipe,
        updateRecipe,
        deleteUserRecipe,
        duplicateRecipe,
        startEditingRecipe,
        fetchRecipes: loadRecipesData,
        retryFetch,
        toggleSimulatedError,
        showToast,
        addToShoppingList,
        toggleShoppingItem,
        removeShoppingItem,
        clearShoppingList,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
