import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import {
  ShoppingCart,
  CheckCircle2,
  Trash2,
  Plus,
  Copy,
  Check,
  ArrowLeft,
  UtensilsCrossed,
} from 'lucide-react';

export const ShoppingListScreen: React.FC = () => {
  const {
    shoppingList,
    toggleShoppingItem,
    removeShoppingItem,
    clearShoppingList,
    setCurrentScreen,
    showToast,
  } = useRecipeContext();

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    // Use storage to add single item
    toggleShoppingItem(''); // trigger refresh
    // Direct add through storage
    const current = [...shoppingList];
    current.push({
      id: `shop-${Date.now()}`,
      name: newItemName.trim(),
      amount: newItemAmount.trim() || '1 item',
      checked: false,
    });
    setNewItemName('');
    setNewItemAmount('');
    showToast(`Added "${newItemName}" to shopping list!`);
  };

  const handleCopyList = () => {
    if (shoppingList.length === 0) return;
    const formatted = shoppingList
      .map((item) => `${item.checked ? '[x]' : '[ ]'} ${item.name} (${item.amount})`)
      .join('\n');

    navigator.clipboard.writeText(`🛒 TastyHub Grocery Shopping List:\n\n${formatted}`);
    setCopied(true);
    showToast('Shopping list copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = shoppingList.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24">
      {/* Header */}
      <section className="bg-white border-b border-[#EFE8DF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setCurrentScreen('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E65100] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Recipes</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E65100] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B18]">
                  Grocery Shopping List
                </h1>
                <p className="text-xs sm:text-sm text-[#5C554E]">
                  Check off items as you shop in the grocery store
                </p>
              </div>
            </div>
          </div>

          {shoppingList.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyList}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E0D8CE] text-xs font-bold text-[#1E1B18] hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#E65100]" />
                    <span>Copy List</span>
                  </>
                )}
              </button>

              <button
                onClick={clearShoppingList}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {shoppingList.length === 0 ? (
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto space-y-5">
              <div className="w-20 h-20 rounded-full bg-[#FFF8E7] text-[#E65100] flex items-center justify-center mx-auto border border-[#F5E6CC]">
                <ShoppingCart className="w-10 h-10 stroke-[1.8]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B18]">
                  Your Shopping List is Empty
                </h2>
                <p className="mt-2 text-sm text-[#5C554E] leading-relaxed">
                  Open any recipe in TastyHub and click{' '}
                  <span className="font-semibold text-[#1E1B18]">
                    &quot;Add to Shopping List&quot;
                  </span>{' '}
                  to instantly generate your grocery list!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Browse Recipes</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Add Custom Item Form */}
            <form
              onSubmit={handleAddItem}
              className="bg-white p-4 rounded-2xl border border-[#EFE8DF] shadow-xs flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add grocery item (e.g., Organic olive oil)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0D8CE] text-sm text-[#1E1B18] placeholder-[#8D857B] focus:border-[#E65100] focus:outline-none"
              />
              <input
                type="text"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                placeholder="Amount (e.g., 500ml)"
                className="w-full sm:w-44 px-4 py-2.5 rounded-xl border border-[#E0D8CE] text-sm text-[#1E1B18] placeholder-[#8D857B] focus:border-[#E65100] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E65100] text-white text-sm font-bold shadow-xs hover:bg-[#D84315] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* List Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-[#8D857B] uppercase tracking-wider px-1">
              <span>
                {completedCount} of {shoppingList.length} items purchased
              </span>
              <span className="text-[#E65100]">
                {Math.round((completedCount / shoppingList.length) * 100)}% Complete
              </span>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFE8DF] shadow-sm divide-y divide-[#F2ECE4]">
              {shoppingList.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4 group"
                >
                  <button
                    onClick={() => toggleShoppingItem(item.id)}
                    className="flex items-center gap-3.5 text-left flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        item.checked
                          ? 'bg-green-600 text-white'
                          : 'border-2 border-[#D8CEBF] bg-white'
                      }`}
                    >
                      {item.checked && <CheckCircle2 className="w-4 h-4" />}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-sm sm:text-base font-semibold ${
                          item.checked
                            ? 'line-through text-neutral-400'
                            : 'text-[#1E1B18]'
                        }`}
                      >
                        {item.name}
                      </p>
                      {item.recipeName && (
                        <span className="text-[11px] text-[#8D857B]">
                          For: {item.recipeName}
                        </span>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                        item.checked
                          ? 'bg-neutral-100 text-neutral-400'
                          : 'bg-[#FFF8E7] text-[#E65100]'
                      }`}
                    >
                      {item.amount}
                    </span>

                    <button
                      onClick={() => removeShoppingItem(item.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
