import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterCodebase';
import { useRecipeContext } from '../context/RecipeContext';
import {
  Download,
  Copy,
  Check,
  FileCode,
  Terminal,
  Smartphone,
  Globe,
  ExternalLink,
  FolderTree,
  BookOpen,
} from 'lucide-react';
import JSZip from 'jszip';

export const FlutterCodeModal: React.FC = () => {
  const { setCurrentScreen, showToast } = useRecipeContext();
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'android-apk' | 'architecture'>('code');
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    showToast(`Copied "${selectedFile.name}" to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add each file into the zip archive with proper folders
      FLUTTER_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Add Android manifest & build.gradle helpers
      zip.file(
        'android/app/build.gradle',
        `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

android {
    namespace "com.example.tastyhub"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId "com.example.tastyhub"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source '../..'
}
`
      );

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tastyhub_recipe_explorer_flutter.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Flutter Project ZIP downloaded successfully! 🚀');
    } catch (err) {
      console.error('Failed to create zip:', err);
      showToast('Failed to create zip download.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1B18] text-neutral-100 pb-20">
      {/* Top Header */}
      <div className="border-b border-white/10 bg-[#161412] px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-[#E65100] to-[#FF7043] flex items-center justify-center text-white shadow-lg">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                  Flutter & Dart Codebase Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-[#FF7043] text-xs font-semibold border border-orange-500/30">
                  Flutter 3.35+
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Official Programme Deliverable • Provider + ChangeNotifier Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {isZipping ? 'Generating ZIP...' : 'Download Complete Flutter Project (.ZIP)'}
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('home')}
              className="px-4 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back to Web Explorer
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white/15 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4 text-[#FF7043]" />
            <span>Flutter Source Files</span>
          </button>

          <button
            onClick={() => setActiveTab('android-apk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'android-apk'
                ? 'bg-white/15 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#FF7043]" />
            <span>Android Studio & APK Build Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-white/15 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#FF7043]" />
            <span>Specification & Rubric Alignment</span>
          </button>
        </div>

        {/* Tab 1: Code Explorer */}
        {activeTab === 'code' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar: File Tree */}
            <div className="lg:col-span-4 bg-[#161412] rounded-2xl border border-white/10 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 pb-2 block">
                Flutter Project Tree
              </span>
              {FLUTTER_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E65100] text-white font-bold shadow-md'
                        : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCode
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-white' : 'text-[#FF7043]'
                        }`}
                      />
                      <span className="truncate">{file.path}</span>
                    </div>
                    <span className="text-[10px] uppercase opacity-75 ml-2">
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Code View */}
            <div className="lg:col-span-8 bg-[#161412] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#1A1816]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#FF7043]">
                    {selectedFile.path}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    {selectedFile.content.split('\n').length} lines
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 overflow-x-auto max-h-[640px] text-xs font-mono leading-relaxed text-neutral-200">
                <pre>{selectedFile.content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Android APK Build Guide */}
        {activeTab === 'android-apk' && (
          <div className="mt-6 bg-[#161412] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-[#FF7043]" />
                <span>Android Studio & Release APK Generation</span>
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Follow these exact steps to run on Android Studio and generate the
                college assignment release APK.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#FF7043] text-sm">
                  <span>Step 1: Unzip and Open in Android Studio</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Click the <strong>&quot;Download Complete Flutter Project (.ZIP)&quot;</strong>{' '}
                  button above. Extract the archive into your preferred workspace
                  folder. Launch Android Studio, click <strong>Open</strong>, and select the
                  unzipped directory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#FF7043] text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Step 2: Fetch Dependencies</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Open the embedded Terminal in Android Studio and run:
                </p>
                <div className="p-2.5 rounded-lg bg-black text-[#FF7043] font-mono text-xs">
                  flutter pub get
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#FF7043] text-sm">
                  <Globe className="w-4 h-4" />
                  <span>Step 3: Run on Flutter Web or Android Emulator</span>
                </div>
                <p className="text-xs text-neutral-300">
                  To test in Chrome browser or on an Android emulator:
                </p>
                <div className="p-2.5 rounded-lg bg-black text-[#FF7043] font-mono text-xs space-y-1">
                  <div>flutter run -d chrome</div>
                  <div className="text-neutral-500"># or for Android:</div>
                  <div>flutter run</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-green-400 text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>Step 4: Build Release APK for College Submission</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Run the release APK build command (JDK 17 is configured):
                </p>
                <div className="p-2.5 rounded-lg bg-black text-green-400 font-mono text-xs">
                  flutter build apk --release
                </div>
                <p className="text-xs text-neutral-400">
                  Output path:{' '}
                  <code className="text-neutral-200">
                    build/app/outputs/flutter-apk/app-release.apk
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Specification Alignment */}
        {activeTab === 'architecture' && (
          <div className="mt-6 bg-[#161412] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#FF7043]" />
              <span>Specification & College Rubric Verification</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-[#FF7043]">
                  State Management: Provider & ChangeNotifier
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Implemented via <code className="text-white">RecipeProvider</code> extending{' '}
                  <code className="text-white">ChangeNotifier</code>. Exposes getters, manages
                  the 4 mandatory states, and notifies UI listeners.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-[#FF7043]">
                  Mandatory Four States on Screen 1
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Loading state (CircularProgressIndicator/Skeleton), Error state (with
                  dedicated Retry button), Empty state (no recipes found), and Data state (active
                  recipes grid).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-[#FF7043]">
                  Local Persistence
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Implemented with <code className="text-white">shared_preferences</code>{' '}
                  (StorageService), storing user-created recipes and favorite recipe IDs as JSON
                  encoded structures.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-[#FF7043]">
                  Centrally Defined Theme
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  ColorScheme generated from seed color: Warm Deep Orange{' '}
                  <code className="text-white">#E65100</code>, Soft Cream{' '}
                  <code className="text-white">#FFF8E7</code>, and Neutral Surface.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
