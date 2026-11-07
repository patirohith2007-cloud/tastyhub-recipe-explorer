# 🍳 TastyHub – Recipe Explorer
**Flutter Application Development Programme • Major Project**

[![Flutter](https://img.shields.io/badge/Flutter-3.35%2B-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.3%2B%20Null--Safe-0175C2?logo=dart&logoColor=white)](https://dart.dev)
[![Platform](https://img.shields.io/badge/Platforms-Web%20%7C%20Android%20APK-E65100)](https://flutter.dev)
[![State Management](https://img.shields.io/badge/State-Provider%20%2B%20ChangeNotifier-4CAF50)](https://pub.dev/packages/provider)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

> A modern, responsive, full-featured Recipe Application Website and Android App built with **Flutter**, **Dart** (null-safe), and **Provider** state management. Designed with a warm, culinary-inspired theme generated from a central seed color (`#E65100`), full local persistence, REST API integration, and an interactive step-by-step kitchen assistant.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Application Screens](#-application-screens)
  - [Screen 1: Home / Recipe Explorer](#screen-1-home--recipe-explorer)
  - [Screen 2: Recipe Detail & Cook Mode](#screen-2-recipe-detail--cook-mode)
  - [Screen 3: Add & Edit Recipe](#screen-3-add--edit-recipe)
  - [Screen 4: Favourites Collection](#screen-4-favourites-collection)
  - [Bonus: Grocery Shopping List & Timer](#bonus-grocery-shopping-list--kitchen-timer)
- [Technology Stack & Architecture](#-technology-stack--architecture)
- [Mandatory Four States](#-mandatory-four-states)
- [Directory Structure](#-directory-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Building the Android Release APK](#-building-the-android-release-apk)
- [Evaluation & Rubric Checklist](#-evaluation--rubric-checklist)
- [Author & Acknowledgements](#-author--acknowledgements)

---

## 🌟 Project Overview

**TastyHub – Recipe Explorer** was developed for the **Flutter Application Development Programme**. It provides home cooks and culinary enthusiasts with a clean, responsive platform to discover world cuisines, follow structured step-by-step recipes, calculate serving portions dynamically, time kitchen steps, organize grocery shopping lists, and create personal family recipes stored locally.

### Key Highlights
- **100% Flutter & Dart:** Full support for Flutter Web and native Android APK release builds.
- **Provider Architecture:** State management built cleanly with `Provider` and `ChangeNotifier`.
- **Zero API Key Leak:** Public REST endpoints via TheMealDB API without exposed secret keys.
- **Offline & Local Persistence:** Persistent storage using `shared_preferences` for favorites, shopping items, and custom recipes.
- **PWA & Mobile Installable:** Configured with Web App Manifest, maskable icons, and standalone home-screen support.

---

## 🍽️ Application Screens

### Screen 1: Home / Recipe Explorer
- **Branding & Welcome Header:** Warm culinary banner with quick category chips (Chicken, Breakfast, Dessert, Seafood, Pasta, Vegetarian, Beef, and Custom Recipes).
- **Live Search & Filter:** Instant search by recipe name or ingredients, plus a prep-time filter (`≤ 20 Min Prep`).
- **Sorting Options:** Sort recipes by *Recommended*, *Quickest Prep*, *Alphabetical (A–Z)*, and *Fewer Ingredients*.
- **Interactive Recipe Cards:** High-resolution food photography, preparation time, difficulty badges, category chips, and one-tap heart favorite toggle with instant animation.

### Screen 2: Recipe Detail & Cook Mode
- **Hero Presentation:** High-definition food photography, cuisine origin tag, prep/cook time, and difficulty metrics.
- **Interactive Serving Scaler:** Stepper (`- / +`) that dynamically recalculates ingredient quantities for 1, 2, 4, 6, or 8 portions.
- **Checkable Ingredients List:** Cross off ingredients with tick-boxes while preparing in the kitchen.
- **One-Click Grocery Export:** Button to send all recipe ingredients straight to your **Grocery Shopping List**.
- **Interactive Fullscreen Cook Mode:** Distraction-free kitchen walkthrough with large fonts, step progress bars, and Next/Prev navigation.
- **Built-in Kitchen Timer:** Integrated timer with `+1m`, `+5m`, `+10m` presets, pause/resume, and audio/visual alerts.
- **Video Tutorial Integration:** Direct links to YouTube video guides when available.

### Screen 3: Add & Edit Recipe
- **Comprehensive Input Form:** Recipe Title, Description, Category, Prep Time, Cook Time, Servings, and Food Photography.
- **Preset Photography Gallery:** Choose from 10+ high-res culinary images or input custom image URLs.
- **Dynamic Multi-Ingredient Builder:** Add, modify, and remove dynamic ingredient rows with custom quantities.
- **Dynamic Step-by-Step Instructions:** Add and reorder numbered cooking instructions.
- **Strict Form Validation:** Inline error feedback ensuring required fields, positive preparation times, and valid ingredients.
- **Personalize & Duplicate:** Clone any existing recipe and customize it to suit dietary preferences (e.g., vegan or gluten-free).

### Screen 4: Favourites Collection
- Dedicated cookbook screen displaying all saved favourite dishes.
- Search and filter within favorites.
- One-click removal with immediate UI update and snackbar toast notification.
- Empty state with a direct call-to-action button to explore new recipes.

### Bonus: Grocery Shopping List & Kitchen Timer
- **Shopping List:** Aggregated checklist of ingredients from multiple recipes.
- **Copy to Clipboard:** Copy a formatted checklist with checkboxes to paste into WhatsApp, Notes, or SMS.
- **Kitchen Timer:** Floating and in-cook timer with countdown display and zero-alarm feedback.

---

## ⚙️ Technology Stack & Architecture

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Flutter 3.35+ | Stable Channel |
| **Language** | Dart 3.3+ | Strong Null Safety |
| **Platforms** | Web & Android | Responsive UI + APK target |
| **State Management** | Provider (`^6.1.2`) | `ChangeNotifier` authoritative pattern |
| **Persistence** | `shared_preferences` (`^2.2.3`) | Local JSON serialization |
| **HTTP Networking** | `http` (`^1.2.1`) | TheMealDB REST API integration |
| **Typography** | `google_fonts` (`^6.2.1`) | Inter / Material 3 styling |
| **Theme** | Centralized Theme | Seed: `#E65100` (Warm Orange), Cream: `#FFF8E7` |

---

## 🔄 Mandatory Four States

Strictly implemented on the Home / Recipe List screen as required by the programme rubric:

1. **⏳ Loading State:** Displays animated skeleton placeholder cards with shimmer effects while fetching recipes.
2. **⚠️ Error State:** Meaningful error message with an active **Retry Button** (includes an in-app *Test Error State* toggle in the navbar to demonstrate error handling to examiners).
3. **🔍 Empty State:** Clean graphic and message displayed when no recipes match search queries, along with a *Clear Filters* action.
4. **🍲 Data State:** Fully populated responsive grid of recipe cards.

---

## 📁 Directory Structure

```text
tastyhub_recipe_app/
├── android/                        # Android native configuration
│   └── app/
│       ├── build.gradle            # Configured with JDK 17, minSdk 21, targetSdk 34
│       └── src/main/AndroidManifest.xml
├── assets/                         # Visual assets and icons
├── lib/
│   ├── main.dart                   # Application entry point with MultiProvider
│   ├── models/
│   │   └── recipe.dart             # Recipe & Ingredient data models with fromJson/toJson
│   ├── providers/
│   │   └── recipe_provider.dart    # ChangeNotifier managing the 4 states & favorites
│   ├── services/
│   │   ├── recipe_service.dart     # Public REST API client (TheMealDB)
│   │   └── storage_service.dart    # SharedPreferences local persistence
│   ├── screens/
│   │   ├── home_screen.dart        # Screen 1: 4 States, Search, Category Chips
│   │   ├── recipe_detail_screen.dart # Screen 2: Details, Servings Scaler, Cook Mode
│   │   ├── add_recipe_screen.dart  # Screen 3: Add/Edit with Form Validation
│   │   └── favorites_screen.dart   # Screen 4: Saved recipes collection
│   ├── widgets/
│   │   └── recipe_card.dart        # Reusable recipe card component
│   └── theme/
│       └── app_theme.dart          # Centrally defined warm orange Material 3 theme
├── pubspec.yaml                    # Flutter package dependencies
└── README.md                       # Documentation
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (version 3.35 or newer)
- [Android Studio](https://developer.android.com/studio) with Android SDK configured
- JDK 17
- Google Chrome (for Flutter Web)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tastyhub-recipe-explorer.git
cd tastyhub-recipe-explorer
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Run on Flutter Web
```bash
flutter run -d chrome
```

### 4. Run on Android Emulator or Physical Device
```bash
flutter run
```

---

## 📦 Building the Android Release APK

To build a standalone release APK for college submission or device installation:

```bash
flutter build apk --release
```

The compiled APK will be generated at:
```text
build/app/outputs/flutter-apk/app-release.apk
```

To build a split per-ABI APK (smaller file size):
```bash
flutter build apk --split-per-abi --release
```

---

## 📋 Evaluation & Rubric Checklist

- [x] Application Name: **TastyHub – Recipe Explorer**
- [x] Framework: Flutter stable channel, Dart null-safe
- [x] Platform targets: Flutter Web & Android APK release ready
- [x] State Management: `Provider` & `ChangeNotifier`
- [x] Four distinct screens: Home, Detail, Add Recipe, Favourites
- [x] Mandatory Four States on Home Screen: Loading, Error with Retry, Empty, Data
- [x] Form validation on all required fields
- [x] Dynamic ingredient & instruction step builders
- [x] Local persistence for personal recipes and favourites
- [x] Centrally defined theme generated from seed color `#E65100`

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
