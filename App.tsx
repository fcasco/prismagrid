import React, { useState, useMemo } from 'react';
import ControlPanel from './components/ControlPanel';
import GridDisplay from './components/GridDisplay';
import { GridConfig } from './types';
import { generateGridColors, generateRandomConfig } from './utils/color';

const App: React.FC = () => {
  // Initialize with a random configuration on app start
  const [config, setConfig] = useState<GridConfig>(() => generateRandomConfig());
  const [themeName, setThemeName] = useState<string>('');
  const [themeDesc, setThemeDesc] = useState<string>('');

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

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      <ControlPanel 
        config={config} 
        onChange={setConfig} 
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