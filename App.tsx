
import React, { useState, useCallback, useEffect } from 'react';
import { ProjectBlueprint } from './types';
import { generateBlueprint, generateAllMockups } from './services/geminiService';
import ProjectIdeaForm from './components/ProjectIdeaForm';
import BlueprintDisplay from './components/BlueprintDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { PlusIcon, LightbulbIcon, CheckCircleIcon } from './components/Icons';

declare var pako: any;

// Helper functions for sharing
const encodeBlueprint = (blueprint: ProjectBlueprint): string => {
    const jsonString = JSON.stringify(blueprint);
    const compressed = pako.deflate(jsonString);
    let binaryString = '';
    compressed.forEach((byte: number) => {
        binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
};

const decodeBlueprint = (encoded: string): ProjectBlueprint | null => {
    const binaryString = atob(encoded);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.inflate(bytes, { to: 'string' });
    return JSON.parse(decompressed) as ProjectBlueprint;
};


const App: React.FC = () => {
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingMockups, setIsGeneratingMockups] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    // Check for a shared blueprint in the URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decodedBlueprint = decodeBlueprint(hash);
        if (decodedBlueprint) {
          setBlueprint(decodedBlueprint);
          // Clean the URL
          window.history.replaceState(null, '', ' ');
        }
      } catch (e) {
        console.error("Failed to decode blueprint from URL:", e);
        setError("Could not load shared blueprint. The link may be invalid or corrupted.");
        // Clean the URL
        window.history.replaceState(null, '', ' ');
      }
    }
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleReset = useCallback(() => {
    setBlueprint(null);
    setError(null);
    setIsLoading(false);
    setIsGeneratingMockups(false);
    // Clean the URL, removing the hash
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const handleGenerateBlueprint = useCallback(async (idea: string) => {
    setIsLoading(true);
    setError(null);
    setBlueprint(null);
    setIsGeneratingMockups(false);

    try {
      const textBlueprint = await generateBlueprint(idea);
      setBlueprint(textBlueprint);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleShare = useCallback(() => {
    if (!blueprint) return;
    const encoded = encodeBlueprint(blueprint);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    navigator.clipboard.writeText(url);
    showNotification('Blueprint link copied to clipboard!');
  }, [blueprint]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
                <LoadingSpinner />
            </div>
        )}
        {!blueprint ? (
          <div className="max-w-3xl mx-auto space-y-12 py-12 md:py-24">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl mb-4">
                <PlusIcon className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                From <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Idea</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Blueprint</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Turn your spark of an idea into a structured project plan with AI-powered architecture, tech stacks, and visual prototypes.
              </p>
            </div>
            
            <ProjectIdeaForm onSubmit={handleGenerateBlueprint} isLoading={isLoading} />
            
            {error && <ErrorMessage message={error} />}
          </div>
        ) : (
          <div className="space-y-6">
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors font-medium"
            >
                <PlusIcon className="w-5 h-5" />
                New Project Idea
            </button>
            <BlueprintDisplay 
              blueprint={blueprint} 
              onShare={handleShare}
              isGeneratingMockups={isGeneratingMockups}
              onGenerateMockups={() => {}} 
            />
          </div>
        )}
      </div>

      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-subtle z-50 border border-cyan-400/50 backdrop-blur-md">
            <div className="bg-white/20 p-1 rounded-full">
                <CheckCircleIcon className="w-4 h-4" />
            </div>
            <span className="font-medium">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default App;
