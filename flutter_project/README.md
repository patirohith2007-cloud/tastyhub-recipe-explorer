# TastyHub – Recipe Explorer
**Flutter Application Development Programme Project**

A complete, professional, responsive Recipe Application Website and Android App built strictly following the college project specification using **Flutter**, **Dart** (null-safe), **Provider** state management, and **ChangeNotifier**.

---

## 🛠️ Technology Stack
- **Framework:** Flutter (stable channel 3.35+)
- **Programming Language:** Dart with null safety
- **Platforms:** Flutter Web & Android (APK release ready)
- **State Management:** Provider (`provider: ^6.1.2`)
- **Shared State:** `ChangeNotifier` (`RecipeProvider`)
- **Local Persistence:** `shared_preferences` (for user recipes & favorites)
- **Networking:** `http` (integrates with TheMealDB public REST API)
- **Theme:** Warm Food Palette seeded from Warm Orange (`#E65100`) and Soft Cream (`#FFF8E7`)

---

## 📱 Application Screens
1. **Screen 1: Home / Recipe List Page**
   - TastyHub branding & welcome message
   - Live Search bar with real-time query filtering
   - Category filter chips (Chicken, Breakfast, Dessert, Seafood, etc.)
   - Dynamic Recipe Cards with imagery, prep times, and instant favourite toggling
   - **4 Mandatory States Strictly Handled:**
     - ⏳ **Loading State**: CircularProgressIndicator / Skeleton loaders
     - ⚠️ **Error State**: Informative message with **Retry Button**
     - 🔍 **Empty State**: Friendly "No recipes found" message + reset filters button
     - 🍲 **Data State**: Responsive grid of recipes
2. **Screen 2: Recipe Detail Page**
   - High-res hero imagery with flexible app bar
   - Prep time, cooking time, servings, difficulty metadata
   - Structured ingredients checklist
   - Numbered step-by-step instructions
   - Floating favorite button
3. **Screen 3: Add Recipe Page**
   - Form fields: Recipe Name, Description, Category, Prep Time, Cook Time, Image URL
   - Dynamic multi-ingredient list (add/remove items)
   - Dynamic multi-instruction steps (add/remove steps)
   - Form validation on all required fields
   - Instant local persistence to `shared_preferences`
4. **Screen 4: Favourites Page**
   - Dedicated view for all saved favorite recipes
   - Empty state with redirect back to home

---

## 🚀 How to Run in Android Studio / VS Code

1. **Install Dependencies:**
   ```bash
   flutter pub get
   ```

2. **Run on Flutter Web:**
   ```bash
   flutter run -d chrome
   ```

3. **Run on Android Emulator or Physical Device:**
   ```bash
   flutter run
   ```

4. **Generate Android Release APK:**
   ```bash
   flutter build apk --release
   ```
   The resulting APK will be saved to:
   `build/app/outputs/flutter-apk/app-release.apk`
