import React, { useState, useMemo, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import GridDisplay from './components/GridDisplay';
import { GridConfig, DEFAULT_CONFIG } from './types';
import { generateGridColors } from './utils/color';
import { generateThemeFromPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<GridConfig>(DEFAULT_CONFIG);
  const [themeName, setThemeName] = useState<string>('');
  const [themeDesc, setThemeDesc] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Re-generate grid whenever config changes
  const grid = useMemo(() => {
    return generateGridColors(
      config.baseHue,
      config.baseSat,
      config.baseLight,
      config.hueStep,
      config.satStep,
      config.lightStep,
      config.rows,
      config.cols,
      config.columnMode
    );
  }, [config]);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const result = await generateThemeFromPrompt(prompt);
      setConfig(prev => ({
        ...prev,
        ...result,
        rows: prev.rows, // Keep user's grid size
        cols: prev.cols
      }));
      setThemeName(result.name);
      setThemeDesc(result.description);
    } catch (error) {
      console.error("Failed to generate theme", error);
      alert("Failed to generate theme. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      <ControlPanel 
        config={config} 
        onChange={setConfig} 
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        currentName={themeName}
        currentDescription={themeDesc}
        onUpdateMetadata={(name, desc) => {
          setThemeName(name);
          setThemeDesc(desc);
        }}
      />
      <main className="flex-1 h-full relative">
        <GridDisplay 
          grid={grid} 
          themeName={themeName} 
          themeDescription={themeDesc}
        />
      </main>
    </div>
  );
};

export default App;