import React, { useState } from 'react';
import { useRecipeContext, SortOption } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import {
  Search,
  X,
  Plus,
  RefreshCw,
  AlertCircle,
  Sparkles,
  FolderOpen,
  SlidersHorizontal,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = [
  { id: 'All', label: 'All Recipes' },
  { id: 'Chicken', label: '🍗 Chicken' },
  { id: 'Breakfast', label: '🥞 Breakfast' },
  { id: 'Dessert', label: '🍰 Dessert' },
  { id: 'Seafood', label: '🦐 Seafood' },
  { id: 'Pasta', label: '🍝 Pasta' },
  { id: 'Vegetarian', label: '🥗 Vegetarian' },
  { id: 'Beef', label: '🥩 Beef' },
  { id: 'User Created', label: '⭐ My Recipes' },
];

export const HomeScreen: React.FC = () => {
  const {
    recipes,
    viewState,
    errorMessage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    maxPrepTimeFilter,
    setMaxPrepTimeFilter,
    retryFetch,
    setCurrentScreen,
  } = useRecipeContext();

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24">
      {/* Hero Welcome Section */}
      <section className="bg-gradient-to-b from-[#FFF8E7] via-[#FFFDF9] to-[#FBF8F5] border-b border-[#EFE8DF]/60 pt-8 pb-10 sm:pt-12 sm:pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#E65100] border border-[#F5E6CC] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to TastyHub Explorer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-[#1E1B18] tracking-tight max-w-3xl mx-auto leading-tight"
          >
            Discover, Cook & Savor{' '}
            <span className="text-[#E65100]">Incredible Recipes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base text-[#5C554E] max-w-2xl mx-auto leading-relaxed"
          >
            Explore diverse world cuisines, step-by-step cooking instructions,
            and create your own custom family culinary treasures.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-3 max-w-2xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-[#8D857B] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipe by name, ingredients, or cuisine..."
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-white rounded-2xl border border-[#E0D8CE] text-sm sm:text-base text-[#1E1B18] placeholder-[#8D857B] shadow-sm hover:border-[#FFB74D] focus:border-[#E65100] focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-4 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Category Chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="pt-4 flex items-center justify-center gap-2 flex-wrap"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#E65100] text-white shadow-md shadow-orange-500/20 scale-105'
                      : 'bg-white text-[#5C554E] hover:text-[#1E1B18] hover:bg-[#FFF8E7] border border-[#EFE8DF]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header bar above recipe grid */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EFE8DF] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1B18]">
                {selectedCategory === 'All'
                  ? 'All Featured Recipes'
                  : `${selectedCategory} Collection`}
              </h2>
              {viewState === 'data' && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#E65100] text-xs font-bold border border-[#F5E6CC]">
                  {recipes.length} available
                </span>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-[#5C554E] mt-1">
                Showing search results for &ldquo;
                <span className="font-semibold text-[#1E1B18]">{searchQuery}</span>
                &rdquo;
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-[#E0D8CE] text-xs font-medium text-[#1E1B18]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#E65100]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="time">Quickest First</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="ingredients">Fewer Ingredients</option>
              </select>
            </div>

            {/* Quick Time Filter Toggle */}
            <button
              onClick={() => setMaxPrepTimeFilter(maxPrepTimeFilter === 20 ? 0 : 20)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                maxPrepTimeFilter === 20
                  ? 'bg-[#E65100] text-white border-[#E65100]'
                  : 'bg-white text-[#5C554E] border-[#E0D8CE] hover:border-neutral-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>≤ 20 Min Prep</span>
            </button>

            <button
              onClick={() => setCurrentScreen('add')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E65100] text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:bg-[#D84315] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Personal Recipe</span>
            </button>
          </div>
        </div>

        {/* --- STATE 1: LOADING STATE --- */}
        {viewState === 'loading' && (
          <div className="py-12 space-y-6">
            <div className="flex items-center justify-center gap-3 text-[#E65100]">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-base font-semibold">
                Loading recipes from culinary service...
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EFE8DF] shadow-xs animate-pulse"
                >
                  <div className="aspect-4/3 w-full bg-neutral-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-full" />
                    <div className="h-3 bg-neutral-100 rounded w-5/6" />
                    <div className="pt-3 border-t border-neutral-100 flex justify-between">
                      <div className="h-4 bg-neutral-200 rounded w-1/3" />
                      <div className="h-4 bg-neutral-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- STATE 2: ERROR STATE (WITH RETRY BUTTON) --- */}
        {viewState === 'error' && (
          <div className="py-16">
            <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle className="w-9 h-9 stroke-[2]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1E1B18]">
                  Unable to Load Recipes
                </h3>
                <p className="mt-2 text-sm text-[#5C554E] leading-relaxed">
                  {errorMessage ||
                    'A network timeout occurred while reaching the recipe repository. Please verify your connection.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={retryFetch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E65100] text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:bg-[#D84315] active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Loading</span>
                </button>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMaxPrepTimeFilter(0);
                    retryFetch();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl border border-[#EFE8DF] text-sm font-semibold text-[#5C554E] hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE 3: EMPTY STATE --- */}
        {viewState === 'empty' && (
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-5">
              <div className="w-20 h-20 rounded-full bg-[#FFF8E7] text-[#E65100] flex items-center justify-center mx-auto border border-[#F5E6CC]">
                <FolderOpen className="w-10 h-10 stroke-[1.8]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1E1B18]">
                  No Recipes Found
                </h3>
                <p className="mt-2 text-sm text-[#5C554E] leading-relaxed">
                  {searchQuery
                    ? `No recipes matched "${searchQuery}". Try different search keywords or clear your query.`
                    : maxPrepTimeFilter > 0
                    ? `No recipes found under ${maxPrepTimeFilter} minutes prep time.`
                    : `There are currently no recipes under "${selectedCategory}". Be the first to share one!`}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMaxPrepTimeFilter(0);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#E0D8CE] text-sm font-semibold text-[#1E1B18] hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Clear Search & Filters
                </button>

                <button
                  onClick={() => setCurrentScreen('add')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E65100] text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:bg-[#D84315] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Recipe</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE 4: DATA STATE --- */}
        {viewState === 'data' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
