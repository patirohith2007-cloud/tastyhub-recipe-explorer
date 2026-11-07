import React, { useState, useEffect } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { PRESET_FOOD_PHOTOS } from '../data/mockRecipes';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegetarian',
  'Chicken',
  'Seafood',
  'Pasta',
  'Beef',
  'Snacks',
  'Other',
];

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  prepTime?: string;
  ingredients?: string;
  instructions?: string;
}

export const AddRecipeScreen: React.FC = () => {
  const {
    addRecipe,
    updateRecipe,
    editingRecipe,
    openRecipeDetail,
    setCurrentScreen,
  } = useRecipeContext();

  const isEditing = Boolean(editingRecipe);

  const [name, setName] = useState(editingRecipe?.name || '');
  const [description, setDescription] = useState(editingRecipe?.description || '');
  const [category, setCategory] = useState(editingRecipe?.category || 'Dinner');
  const [prepTime, setPrepTime] = useState<number>(editingRecipe?.prepTime || 15);
  const [cookTime, setCookTime] = useState<number>(editingRecipe?.cookTime || 25);
  const [servings, setServings] = useState<number>(editingRecipe?.servings || 4);
  const [imageUrl, setImageUrl] = useState(
    editingRecipe?.imageUrl || PRESET_FOOD_PHOTOS[0].url
  );
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Dynamic ingredient rows
  const [ingredients, setIngredients] = useState<
    Array<{ id: string; name: string; amount: string }>
  >(
    editingRecipe?.ingredients?.length
      ? editingRecipe.ingredients.map((i) => ({ ...i }))
      : [
          { id: '1', name: '', amount: '' },
          { id: '2', name: '', amount: '' },
        ]
  );

  // Dynamic instruction steps
  const [instructions, setInstructions] = useState<string[]>(
    editingRecipe?.instructions?.length
      ? [...editingRecipe.instructions]
      : ['', '']
  );

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if editingRecipe changes
  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name);
      setDescription(editingRecipe.description);
      setCategory(editingRecipe.category);
      setPrepTime(editingRecipe.prepTime);
      setCookTime(editingRecipe.cookTime);
      setServings(editingRecipe.servings);
      setImageUrl(editingRecipe.imageUrl);
      setIngredients(
        editingRecipe.ingredients.map((i) => ({ ...i }))
      );
      setInstructions([...editingRecipe.instructions]);
    }
  }, [editingRecipe]);

  const addIngredientRow = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', amount: '' },
    ]);
  };

  const removeIngredientRow = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: 'name' | 'amount',
    val: string
  ) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const addInstructionRow = () => {
    setInstructions((prev) => [...prev, '']);
  };

  const removeInstructionRow = (index: number) => {
    if (instructions.length <= 1) return;
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, val: string) => {
    setInstructions((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = 'Recipe name is required.';
    } else if (name.trim().length < 3) {
      errs.name = 'Recipe name must be at least 3 characters.';
    }

    if (!description.trim()) {
      errs.description = 'Recipe description is required.';
    } else if (description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters.';
    }

    if (!category) {
      errs.category = 'Please select a valid recipe category.';
    }

    if (!prepTime || prepTime <= 0) {
      errs.prepTime = 'Preparation time must be greater than 0 minutes.';
    }

    const validIngredients = ingredients.filter((i) => i.name.trim().length > 0);
    if (validIngredients.length === 0) {
      errs.ingredients = 'At least 1 valid ingredient with a name is required.';
    }

    const validInstructions = instructions.filter((i) => i.trim().length > 0);
    if (validInstructions.length === 0) {
      errs.instructions = 'At least 1 cooking instruction step is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const validIngredients = ingredients
      .filter((i) => i.name.trim().length > 0)
      .map((i, idx) => ({
        id: i.id || `user-ing-${idx}-${Date.now()}`,
        name: i.name.trim(),
        amount: i.amount.trim() || 'To taste',
      }));

    const validInstructions = instructions
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (isEditing && editingRecipe) {
      const updated = {
        ...editingRecipe,
        name: name.trim(),
        description: description.trim(),
        category,
        imageUrl:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80',
        prepTime: Number(prepTime),
        cookTime: Number(cookTime) || 15,
        servings: Number(servings) || 4,
        ingredients: validIngredients,
        instructions: validInstructions,
      };
      updateRecipe(updated);
      setIsSubmitting(false);
    } else {
      const newRecipe = addRecipe({
        name: name.trim(),
        description: description.trim(),
        category,
        imageUrl:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80',
        prepTime: Number(prepTime),
        cookTime: Number(cookTime) || 15,
        servings: Number(servings) || 4,
        ingredients: validIngredients,
        instructions: validInstructions,
        difficulty: validIngredients.length > 6 ? 'Medium' : 'Easy',
      });

      setIsSubmitting(false);
      openRecipeDetail(newRecipe);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EFE8DF] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('home')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-[#5C554E] hover:text-[#1E1B18] hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-[#1E1B18]">
              {isEditing ? `Edit "${editingRecipe?.name}"` : 'Add Personal Recipe'}
            </h1>
            <p className="text-xs text-[#5C554E]">Saved directly to local persistence</p>
          </div>
          <div className="w-18" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DF] shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#EFE8DF]">
              <Sparkles className="w-5 h-5 text-[#E65100]" />
              <h2 className="text-lg font-bold text-[#1E1B18]">Basic Information</h2>
            </div>

            {/* Recipe Name */}
            <div>
              <label className="block text-sm font-bold text-[#1E1B18] mb-1.5">
                Recipe Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g., Mom's Secret Lemon Herb Chicken"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1E1B18] placeholder-[#8D857B] focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-red-500 ring-2 ring-red-200'
                    : 'border-[#E0D8CE] focus:border-[#E65100]'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Recipe Description */}
            <div>
              <label className="block text-sm font-bold text-[#1E1B18] mb-1.5">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors({ ...errors, description: undefined });
                }}
                placeholder="Tell food lovers what makes this dish exceptional, its texture, flavor profile, or origin..."
                className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1E1B18] placeholder-[#8D857B] focus:outline-none transition-colors ${
                  errors.description
                    ? 'border-red-500 ring-2 ring-red-200'
                    : 'border-[#E0D8CE] focus:border-[#E65100]'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category & Times Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1E1B18] mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0D8CE] bg-white text-sm font-medium text-[#1E1B18] focus:border-[#E65100] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1E1B18] mb-1.5">
                  Prep Time (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={prepTime}
                  onChange={(e) => {
                    setPrepTime(Number(e.target.value));
                    if (errors.prepTime) setErrors({ ...errors, prepTime: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1E1B18] focus:outline-none ${
                    errors.prepTime
                      ? 'border-red-500 ring-2 ring-red-200'
                      : 'border-[#E0D8CE] focus:border-[#E65100]'
                  }`}
                />
                {errors.prepTime && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.prepTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1E1B18] mb-1.5">
                  Cook Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0D8CE] bg-white text-sm text-[#1E1B18] focus:border-[#E65100] focus:outline-none"
                />
              </div>
            </div>

            {/* Food Photo Selector / URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-[#1E1B18]">
                  Food Photography Image
                </label>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                  className="text-xs font-bold text-[#E65100] hover:underline cursor-pointer"
                >
                  {showPhotoPicker ? 'Hide Presets' : 'Choose from Preset Gallery'}
                </button>
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste food image URL or choose from preset photos..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E0D8CE] bg-white text-sm text-[#1E1B18] focus:border-[#E65100] focus:outline-none"
                  />
                </div>
                {imageUrl && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EFE8DF] shrink-0 bg-neutral-100">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Photo Presets Grid */}
              {showPhotoPicker && (
                <div className="mt-4 p-4 rounded-2xl bg-[#FFFDF9] border border-[#F5E6CC] space-y-3">
                  <p className="text-xs font-bold text-[#5C554E] uppercase tracking-wider">
                    Click any curated food photo to use for your recipe:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {PRESET_FOOD_PHOTOS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setImageUrl(p.url);
                          setShowPhotoPicker(false);
                        }}
                        className={`group rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer relative ${
                          imageUrl === p.url
                            ? 'border-[#E65100] scale-95 shadow-md'
                            : 'border-transparent hover:border-[#FFB74D]'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.title}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-1.5 bg-white text-[10px] font-bold text-[#1E1B18] truncate">
                          {p.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DF]">
              <div>
                <h2 className="text-lg font-bold text-[#1E1B18]">
                  Ingredients <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-[#5C554E]">
                  Enter ingredient items and their exact measurements
                </p>
              </div>

              <button
                type="button"
                onClick={addIngredientRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8E7] text-[#E65100] text-xs font-bold border border-[#F5E6CC] hover:bg-[#FFE0B2] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            {errors.ingredients && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.ingredients}
              </p>
            )}

            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div key={ing.id || idx} className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                      placeholder={`Ingredient #${idx + 1} (e.g. Boneless Chicken Breast)`}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E0D8CE] bg-white text-sm text-[#1E1B18] focus:border-[#E65100] focus:outline-none"
                    />
                  </div>
                  <div className="w-36 sm:w-48">
                    <input
                      type="text"
                      value={ing.amount}
                      onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                      placeholder="Amount (e.g. 2 lbs)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E0D8CE] bg-white text-sm text-[#1E1B18] focus:border-[#E65100] focus:outline-none"
                    />
                  </div>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientRow(idx)}
                      className="p-2.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Instructions Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DF]">
              <div>
                <h2 className="text-lg font-bold text-[#1E1B18]">
                  Cooking Instructions <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-[#5C554E]">
                  Provide clear step-by-step guidance for cooking
                </p>
              </div>

              <button
                type="button"
                onClick={addInstructionRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8E7] text-[#E65100] text-xs font-bold border border-[#F5E6CC] hover:bg-[#FFE0B2] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            {errors.instructions && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.instructions}
              </p>
            )}

            <div className="space-y-4">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF8E7] text-[#E65100] font-bold text-xs flex items-center justify-center shrink-0 mt-1 border border-[#F5E6CC]">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      value={step}
                      onChange={(e) => updateInstruction(idx, e.target.value)}
                      placeholder={`Step ${idx + 1}: Explain what to do...`}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E0D8CE] bg-white text-sm text-[#1E1B18] focus:border-[#E65100] focus:outline-none"
                    />
                  </div>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstructionRow(idx)}
                      className="p-2.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 cursor-pointer mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentScreen('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#EFE8DF] text-sm font-semibold text-[#5C554E] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Personal Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
