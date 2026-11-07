import React, { useState, useEffect } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import {
  ArrowLeft,
  Heart,
  Clock,
  Flame,
  Users,
  ChefHat,
  CheckCircle,
  PlayCircle,
  Sparkles,
  Printer,
  Trash2,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  Timer,
  ShoppingCart,
  Copy,
  Edit,
  Play,
  Pause,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RecipeDetailScreen: React.FC = () => {
  const {
    currentRecipe,
    setCurrentScreen,
    toggleFavorite,
    isFavorite,
    deleteUserRecipe,
    startEditingRecipe,
    duplicateRecipe,
    addToShoppingList,
    showToast,
  } = useRecipeContext();

  const [servingMultiplier, setServingMultiplier] = useState<number>(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [isCookMode, setIsCookMode] = useState<boolean>(false);
  const [cookStepIndex, setCookStepIndex] = useState<number>(0);

  // Kitchen Timer State
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            showToast('⏰ Kitchen Timer Finished! Time to check your food!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FBF8F5]">
        <div className="text-center">
          <p className="text-lg font-bold text-[#1E1B18]">Recipe not found.</p>
          <button
            onClick={() => setCurrentScreen('home')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#E65100] text-white font-semibold cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(currentRecipe.id);

  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `🍳 ${currentRecipe.name}\n\n${currentRecipe.description}\n\nPrep: ${currentRecipe.prepTime}m | Cook: ${currentRecipe.cookTime}m\n\nIngredients:\n${currentRecipe.ingredients.map((i) => `• ${i.name} (${i.amount})`).join('\n')}\n\nExplore more on TastyHub!`;
    navigator.clipboard.writeText(text);
    showToast('Recipe copied to clipboard! Ready to share. 📋');
  };

  const handleAddAllToShoppingList = () => {
    addToShoppingList(currentRecipe.ingredients, currentRecipe.name);
  };

  const startTimerMinutes = (mins: number) => {
    setTimerSecondsLeft(mins * 60);
    setIsTimerRunning(true);
    setShowTimer(true);
    showToast(`Timer set for ${mins} minutes! ⏱️`);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Safe fallbacks for missing data
  const prepTime = currentRecipe.prepTime || 15;
  const cookTime = currentRecipe.cookTime || 20;
  const difficulty = currentRecipe.difficulty || 'Easy';

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-[#EFE8DF] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('home')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-[#5C554E] hover:text-[#1E1B18] hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recipes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimer(!showTimer)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                timerSecondsLeft > 0
                  ? 'bg-orange-500 text-white animate-pulse'
                  : 'bg-white border border-[#EFE8DF] text-[#5C554E] hover:bg-neutral-50'
              }`}
              title="Kitchen Timer"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{timerSecondsLeft > 0 ? formatTimer(timerSecondsLeft) : 'Timer'}</span>
            </button>

            <button
              onClick={() => setIsCookMode(true)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#FFF8E7] text-[#E65100] border border-[#F5E6CC] text-xs font-bold hover:bg-[#FFE0B2] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Interactive Cook Mode</span>
            </button>

            <button
              onClick={handleShare}
              aria-label="Share Recipe"
              className="p-2 rounded-xl text-[#5C554E] hover:text-[#1E1B18] hover:bg-neutral-100 cursor-pointer"
              title="Share Recipe Text"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              aria-label="Print Recipe"
              className="p-2 rounded-xl text-[#5C554E] hover:text-[#1E1B18] hover:bg-neutral-100 cursor-pointer"
              title="Print Recipe Card"
            >
              <Printer className="w-4 h-4" />
            </button>

            {currentRecipe.isUserCreated ? (
              <>
                <button
                  onClick={() => startEditingRecipe(currentRecipe)}
                  className="p-2 rounded-xl text-[#E65100] hover:bg-orange-50 cursor-pointer"
                  title="Edit Recipe"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${currentRecipe.name}"?`)) {
                      deleteUserRecipe(currentRecipe.id);
                    }
                  }}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Delete this custom recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => duplicateRecipe(currentRecipe)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EFE8DF] text-xs font-bold text-[#5C554E] hover:bg-neutral-100 cursor-pointer"
                title="Create your own variation of this recipe"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Personalize Copy</span>
              </button>
            )}

            <button
              onClick={() => toggleFavorite(currentRecipe.id)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-xs ${
                favorite
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-white text-[#5C554E] border border-[#EFE8DF] hover:border-red-200 hover:text-red-600'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${favorite ? 'fill-red-600 text-red-600' : ''}`}
              />
              <span>{favorite ? 'Favourited' : 'Add to Favourites'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Floating Kitchen Timer Banner */}
      {showTimer && (
        <div className="bg-[#1E1B18] text-white py-3 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-[#FF7043]" />
            <div>
              <span className="text-xs uppercase font-bold text-neutral-400 block">
                Cooking Timer
              </span>
              <span className="text-xl font-mono font-bold text-white tracking-wider">
                {formatTimer(timerSecondsLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => startTimerMinutes(1)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              +1m
            </button>
            <button
              onClick={() => startTimerMinutes(5)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              +5m
            </button>
            <button
              onClick={() => startTimerMinutes(10)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              +10m
            </button>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-3 py-1 rounded-lg bg-[#E65100] text-white text-xs font-bold flex items-center gap-1"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => {
                setTimerSecondsLeft(0);
                setIsTimerRunning(false);
              }}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowTimer(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recipe Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-lg bg-neutral-100">
              <img
                src={currentRecipe.imageUrl}
                alt={currentRecipe.name}
                className="w-full aspect-4/3 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                  {currentRecipe.category}
                </span>
                {currentRecipe.area && (
                  <span className="px-3 py-1 rounded-full bg-white/90 text-[#1E1B18] text-xs font-bold">
                    {currentRecipe.area} Cuisine
                  </span>
                )}
              </div>

              {currentRecipe.isUserCreated && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#E65100] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE0B2]" />
                  <span>My Creation</span>
                </div>
              )}
            </div>

            {/* Cook Mode CTA Button on Mobile */}
            <button
              onClick={() => setIsCookMode(true)}
              className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#E65100] text-white font-bold shadow-md shadow-orange-500/20"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Start Interactive Cook Mode</span>
            </button>
          </div>

          {/* Recipe Title & Overview */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E65100]">
                <ChefHat className="w-4 h-4" />
                <span>{currentRecipe.category} Masterclass</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#1E1B18] mt-2 leading-tight">
                {currentRecipe.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#5C554E] leading-relaxed">
              {currentRecipe.description}
            </p>

            {/* Key Recipe Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-[#EFE8DF] shadow-xs text-center">
                <Clock className="w-5 h-5 mx-auto text-[#E65100] mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-[#8D857B] font-bold block">
                  Prep Time
                </span>
                <span className="text-sm font-bold text-[#1E1B18]">{prepTime} mins</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#EFE8DF] shadow-xs text-center">
                <Flame className="w-5 h-5 mx-auto text-[#FF7043] mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-[#8D857B] font-bold block">
                  Cook Time
                </span>
                <span className="text-sm font-bold text-[#1E1B18]">{cookTime} mins</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#EFE8DF] shadow-xs text-center">
                <Users className="w-5 h-5 mx-auto text-[#0288D1] mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-[#8D857B] font-bold block">
                  Servings
                </span>
                <span className="text-sm font-bold text-[#1E1B18]">
                  {servingMultiplier} portions
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#EFE8DF] shadow-xs text-center">
                <Sparkles className="w-5 h-5 mx-auto text-[#4CAF50] mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-[#8D857B] font-bold block">
                  Difficulty
                </span>
                <span className="text-sm font-bold text-[#1E1B18]">{difficulty}</span>
              </div>
            </div>

            {/* Actions Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddAllToShoppingList}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF8E7] hover:bg-[#FFE0B2] text-[#E65100] border border-[#F5E6CC] text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Ingredients to Shopping List</span>
              </button>

              {currentRecipe.youtubeUrl && (
                <a
                  href={currentRecipe.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Watch Video Tutorial</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Body: Ingredients & Step-by-Step Instructions */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Ingredients Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE8DF] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DF]">
              <div>
                <h2 className="text-xl font-bold text-[#1E1B18]">Ingredients</h2>
                <p className="text-xs text-[#5C554E] mt-0.5">
                  Click to check off ingredients as you prepare
                </p>
              </div>

              {/* Servings Stepper */}
              <div className="flex items-center gap-1.5 bg-[#FFF8E7] px-2.5 py-1 rounded-xl border border-[#F5E6CC]">
                <button
                  onClick={() => setServingMultiplier(Math.max(1, servingMultiplier - 1))}
                  className="w-6 h-6 rounded-md bg-white text-[#E65100] font-bold flex items-center justify-center hover:bg-orange-100 cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-bold text-[#E65100] px-1">
                  {servingMultiplier}x
                </span>
                <button
                  onClick={() => setServingMultiplier(servingMultiplier + 1)}
                  className="w-6 h-6 rounded-md bg-white text-[#E65100] font-bold flex items-center justify-center hover:bg-orange-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <ul className="space-y-3">
              {currentRecipe.ingredients.map((ing) => {
                const isChecked = Boolean(checkedIngredients[ing.id]);
                return (
                  <li
                    key={ing.id}
                    onClick={() => toggleIngredientCheck(ing.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-neutral-50 text-neutral-400'
                        : 'hover:bg-[#FFFDF9] text-[#1E1B18]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-green-600 text-white'
                          : 'border-2 border-[#D8CEBF] bg-white'
                      }`}
                    >
                      {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 text-sm flex items-center justify-between">
                      <span className={isChecked ? 'line-through' : 'font-medium'}>
                        {ing.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md ${
                          isChecked
                            ? 'text-neutral-400 bg-neutral-100'
                            : 'font-bold text-[#E65100] bg-[#FFF8E7]'
                        }`}
                      >
                        {ing.amount}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pt-2 flex items-center justify-between border-t border-[#F2ECE4] text-xs text-[#8D857B]">
              <span>
                {Object.values(checkedIngredients).filter(Boolean).length} of{' '}
                {currentRecipe.ingredients.length} ingredients ready
              </span>
              <button
                onClick={handleAddAllToShoppingList}
                className="font-bold text-[#E65100] hover:underline cursor-pointer"
              >
                + Add all to Grocery List
              </button>
            </div>
          </div>

          {/* Instructions Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DF] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DF]">
              <div>
                <h2 className="text-xl font-bold text-[#1E1B18]">
                  Cooking Instructions
                </h2>
                <p className="text-xs text-[#5C554E] mt-0.5">
                  {currentRecipe.instructions.length} sequential steps to culinary success
                </p>
              </div>

              <button
                onClick={() => setIsCookMode(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E65100] text-white text-xs font-bold shadow-xs hover:bg-[#D84315] cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Launch Cook Mode</span>
              </button>
            </div>

            <div className="space-y-6">
              {currentRecipe.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-2xl bg-[#FFF8E7] text-[#E65100] font-black text-sm flex items-center justify-center shrink-0 border border-[#F5E6CC] group-hover:bg-[#E65100] group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-sm sm:text-base text-[#1E1B18] leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Cook Mode Fullscreen Overlay */}
      <AnimatePresence>
        {isCookMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 bg-[#1E1B18] text-white flex flex-col p-6 sm:p-12 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF7043]">
                  Interactive Cook Mode • Step {cookStepIndex + 1} of{' '}
                  {currentRecipe.instructions.length}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold truncate max-w-xl">
                  {currentRecipe.name}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => startTimerMinutes(5)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Timer className="w-3.5 h-3.5 text-[#FF7043]" />
                  <span>5m Timer</span>
                </button>
                <button
                  onClick={() => setIsCookMode(false)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Step Card */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto py-12 text-center space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-[#E65100] text-white text-3xl font-black flex items-center justify-center shadow-2xl">
                {cookStepIndex + 1}
              </div>

              <p className="text-xl sm:text-3xl font-medium leading-relaxed max-w-2xl text-neutral-100">
                {currentRecipe.instructions[cookStepIndex]}
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#E65100] h-full transition-all duration-300"
                  style={{
                    width: `${
                      ((cookStepIndex + 1) / currentRecipe.instructions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 max-w-4xl mx-auto w-full">
              <button
                disabled={cookStepIndex === 0}
                onClick={() => setCookStepIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={() => {
                  if (cookStepIndex < currentRecipe.instructions.length - 1) {
                    setCookStepIndex((prev) => prev + 1);
                  } else {
                    setIsCookMode(false);
                    showToast('Congratulations! You cooked this recipe! 👨‍🍳🎉');
                  }
                }}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white font-bold shadow-lg shadow-orange-500/30 cursor-pointer"
              >
                <span>
                  {cookStepIndex === currentRecipe.instructions.length - 1
                    ? 'Finish Cooking 🎉'
                    : 'Next Step'}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
